// 形象变体候选（纯本地、零积分）：把平台分析时记下的「谁在哪几集换过造型」交到 Agent 手里，逐条表态，再对照剧本查漏。
//
// 背景（2026-10-04）：写作规范早就要求「变体按剧情事件建」，但只有文字规则——Agent 凭记忆判断全剧谁换过形象，
// 格式门也只查「已经写出来的形象标得对不对」。72 集「只改角色名」的一稿，31 个角色全是单形象，第 20 集的病号服+手臂包扎
// 仍绑着「孕妇」，所有检查都过了。平台的 character_variants.json 里其实记着这些造型，只是 Skill 从来没用它。
//
// 这里做三件事：
//   1) buildCandidates：从 character_variants.json 里挑出「主造型以外」值得判断的造型，换成合并后的角色名
//   2) decisionTemplate / mergeDecisions：每个候选让 Agent 填 build（建成变体，写变体名）或 skip（不建，写原因）
//   3) checkAgainstScript：没表态的、说了要建但剧本对应集没用上的、强信号却说不建又没写原因的，逐条列出来
// 检查只负责指出来让 Agent 返工，不改剧本、不替 Agent 做判断。

export const VARIANT_CANDIDATE_FILE = '形象变体候选.md';
export const VARIANT_DECISION_FILE = '形象变体判定.json';

// 强信号：剧情事件造成的、观众需要认出「他变了」的造型；活动必须穿的功能性着装；原文明确写了换衣服的。日常换衣（睡衣、外套、换了件衬衫）不算。
const STRONG_RULES = [
  ['住院/病号服', /病号服|病服|住院服|病人服|手术服/],
  ['受伤/包扎', /包扎|绷带|纱布|石膏|吊着胳膊|拄拐|血迹|带血|染血|伤口|淤青|鼻青脸肿|伤疤|烧伤/],
  ['怀孕', /孕肚|孕妇|怀孕|大肚子|隆起的腹/],
  ['婚礼', /婚纱|新娘|新郎|喜服|嫁衣|凤冠霞帔/],
  ['丧事', /丧服|孝服|戴孝|披麻/],
  ['关押', /囚服|囚衣|手铐|镣铐|狱服/],
  ['年龄段不同', /幼年|童年|孩童|小时候|少年时|年轻时|青年时期|老年|年迈|白发苍苍/],
  ['伪装/假扮', /伪装|乔装|假扮|冒充|蒙面|面具|易容|变装/],
  ['身份制服', /警服|军装|制服|铠甲|战袍|官服|龙袍|袈裟|道袍|工服|保洁服|护士服|白大褂/],
  ['变身/形态', /变身|化形|现出原形|兽形|虫茧|魂体|半透明的身体|发光的身体/],
  // 2026-10-04 用户定：活动或场合必须穿的功能性着装要单独建形象（穿西装短裙在雪道上滑雪，画面是错的）
  ['功能性着装', /滑雪服|滑雪装|雪服|雪镜|泳装|泳衣|泳裤|比基尼|潜水服|潜水装|赛车服|骑行服|击剑服|宇航服|航天服|防护服|防化服|消防服|救生衣|登山服|攀岩|马术服|球衣|拳击|道服|武道服|练功服|舞蹈服|芭蕾|戏服|演出服|厨师服/],
  // 2026-10-04 用户定：原文明确写了换衣服的必须建卡，不能当日常换装跳过
  ['明确换装', /换上|换成|换穿|换了一身|换装|更衣|脱下[^，。；]{0,12}穿上/]
];
export function strongSignals(text) {
  const value = String(text || '');
  return STRONG_RULES.filter(([, re]) => re.test(value)).map(([label]) => label);
}

const epNumber = (id) => Number(String(id || '').replace(/\D/g, '')) || 0;
const spanText = (numbers) => {
  const list = [...new Set(numbers)].filter((n) => n > 0).sort((a, b) => a - b);
  const parts = [];
  for (let i = 0; i < list.length; i += 1) {
    let j = i;
    while (j + 1 < list.length && list[j + 1] === list[j] + 1) j += 1;
    parts.push(j > i ? `${list[i]}–${list[j]}` : String(list[i]));
    i = j;
  }
  return parts.join('、');
};

// 分析稿里的名字 → 整理后的正式名（资产合并表的 characters[].aliases 和 labels）→ 洗稿后的新名字（洗稿映射的 renames）
export function nameResolver({ assetMap = null, renames = null } = {}) {
  const formal = new Map();
  for (const c of assetMap?.characters || []) {
    const name = String(c?.name || '').trim();
    if (!name) continue;
    formal.set(name, name);
    for (const alias of c.aliases || []) if (String(alias || '').trim()) formal.set(String(alias).trim(), name);
  }
  for (const [label, value] of Object.entries(assetMap?.labels || {})) {
    const to = String(value && typeof value === 'object' ? value.to : value || '').trim();
    if (to) formal.set(String(label).trim(), formal.get(to) || to);
  }
  const renamed = new Map(Object.entries(renames || {}).map(([from, to]) => [String(from).trim(), String(to).trim()]));
  return (name) => {
    const source = String(name || '').trim();
    const merged = formal.get(source) || source;
    return { source, merged, script: renamed.get(merged) || renamed.get(source) || merged };
  };
}

// 候选 = 每个角色「镜头行数最多的那套造型」以外的造型里：出现 3 行以上的，或带强信号的。
// 同一角色合并前的多个名字（临时编号、别名）先并到一起再算。
export function buildCandidates(variantsJson, resolve = (name) => ({ source: name, merged: name, script: name })) {
  const byRole = new Map();
  for (const c of variantsJson?.characters || []) {
    const who = resolve(c?.name);
    if (!who.merged || /^OBS_/i.test(who.merged)) continue; // 还没归属的临时编号不出候选
    const role = byRole.get(who.merged) || { merged: who.merged, script: who.script, sources: new Set(), variants: [] };
    role.sources.add(who.source);
    for (const v of c.variants || []) role.variants.push(v);
    byRole.set(who.merged, role);
  }
  const candidates = [];
  for (const role of byRole.values()) {
    if (role.variants.length < 2) continue;
    const main = role.variants.reduce((a, b) => (Number(b.rows || 0) > Number(a.rows || 0) ? b : a));
    let index = 0;
    for (const v of role.variants) {
      if (v === main) continue;
      // 「明确换装」只认镜头行里写出来的换装动作（由逐镜头扫描给出）。平台归并时填的 change_cause 是模型推测的（几乎每条都写「换…」），不算证据。
      const text = [v.variant_name, v.description, ...(v.looks || []).slice(0, 12)].join(' ');
      const signals = [...new Set([...strongSignals(text), ...strongSignals(v.change_cause)])].filter((label) => label !== '明确换装').filter((label) => !strongSignals([main.variant_name, main.description].join(' ')).includes(label));
      const rows = Number(v.rows || 0);
      if (rows < 3 && !signals.length) continue;
      index += 1;
      candidates.push({
        id: `${role.script}#${index}`,
        role: role.script,
        source_role: [...role.sources].join(' / '),
        main_look: String(main.variant_name || '').trim(),
        look: String(v.variant_name || '').trim(),
        description: String(v.description || '').trim(),
        cause: String(v.change_cause || '').trim(),
        episodes: spanText((v.episodes || []).map(epNumber)),
        episode_list: [...new Set((v.episodes || []).map(epNumber))].filter(Boolean).sort((a, b) => a - b),
        first: v.first ? `${v.first.episode_id || ''} ${v.first.time || ''} ${v.first.scene || ''}`.trim() : '',
        rows,
        signals
      });
    }
  }
  candidates.sort((a, b) => (b.signals.length ? 1 : 0) - (a.signals.length ? 1 : 0) || a.role.localeCompare(b.role, 'zh') || (a.episode_list[0] || 0) - (b.episode_list[0] || 0));
  return candidates;
}

// 第二个证据来源：逐集分析表里每个镜头的「外观」原文。不依赖平台归并得对不对——
// 平台把病号服错并进主造型、或者老项目没有 character_variants.json 时，强信号照样能被列出来。
// looks: [{ episode: 'EP020', time, who, look }]（who 已是合并后的角色名）。
// 一个信号占了这个角色一半以上的镜头或出场集，说明是他的常态（一直怀孕的孕妇、一直穿制服的警察、只出场一集的龙套），不算变体候选。
export function scanAppearanceSignals(looks = [], { existing = [], scriptName = (name) => name } = {}) {
  const byRole = new Map();
  for (const item of looks) {
    const who = String(item?.who || '').trim();
    const n = epNumber(item?.episode);
    if (!who || !n || /^OBS_/i.test(who)) continue;
    const role = byRole.get(who) || { episodes: new Set(), signals: new Map(), rows: 0 };
    role.episodes.add(n);
    role.rows += 1;
    for (const label of strongSignals(item.look)) {
      const hit = role.signals.get(label) || { episodes: new Set(), samples: [], rows: 0, first: '' };
      hit.episodes.add(n);
      hit.rows += 1;
      if (!hit.first) hit.first = `EP${String(n).padStart(3, '0')} ${item.time || ''}`.trim();
      if (hit.samples.length < 3 && !hit.samples.includes(item.look)) hit.samples.push(String(item.look));
      role.signals.set(label, hit);
    }
    byRole.set(who, role);
  }
  const out = [];
  for (const [who, role] of byRole) {
    const name = scriptName(who);
    for (const [label, hit] of role.signals) {
      // 常态：这个信号占了他一半以上的镜头（或一半以上的出场集）——一直穿制服的司机、只出场一集的铠甲武者，那就是他的主造型
      if (hit.rows * 2 >= role.rows || hit.episodes.size * 2 > role.episodes.size) continue;
      if (hit.rows < 2 && label !== '明确换装') continue; // 只有一个镜头提到，多半是瞬时状态或记错（换装动作本身就只有一个镜头，例外）
      const list = [...hit.episodes].sort((a, b) => a - b);
      // 平台候选里已经有同一角色、同一信号、集数有重叠的，就不重复列
      const covered = existing.some((c) => c.role === name && c.signals.includes(label) && c.episode_list.some((n) => hit.episodes.has(n)));
      if (covered) continue;
      out.push({
        id: `${name}@${label}`, role: name, source_role: who, main_look: '',
        look: label, description: hit.samples.join('；'), cause: '',
        episodes: spanText(list), episode_list: list, first: hit.first, rows: hit.rows, signals: [label], from: 'rows'
      });
    }
  }
  out.sort((a, b) => a.role.localeCompare(b.role, 'zh') || (a.episode_list[0] || 0) - (b.episode_list[0] || 0));
  return out;
}

export function renderCandidates(candidates, { title = '' } = {}) {
  const strong = candidates.filter((c) => c.signals.length);
  const lines = [
    `# 形象变体候选${title ? ' · ' + title : ''}`,
    '',
    `平台看画面时记下的「主造型以外的造型」共 ${candidates.length} 条，其中带强信号（住院、受伤包扎、怀孕、婚礼、伪装、年龄段不同等）的 ${strong.length} 条。`,
    '',
    '**每一条都要在「形象变体判定.json」里表态**，不能跳过：',
    '- `build`：剧情里有原因、观众需要认出「他变了」→ 建成变体。`variant` 写变体名（身份/事件，如 病号服、受伤包扎、新娘、幼年、冒充护卫；不用服装名），',
    '  然后把候选列出的那几集里这个角色的【形象】改成 `角色=变体名（原因）`，场内补上可见的换装 △。',
    '- `skip`：只是日常换衣、同一身衣服的不同拍法、瞬时状态（淋湿、衣服扯乱、哭花妆）→ 不建，`reason` 写一句为什么。',
    '- 带强信号的候选默认应该 `build`；确实不建要写清楚原因（比如「只有一个镜头的回忆闪回，已并入主形象」）。',
    '- **功能性着装**（滑雪服、泳装、潜水服、手术服、赛车服、练功服…）：本人**正在做**这项活动时必须建；只是到了那个场地但没参与的（坐在雪场休息区）不建；',
    '  离开活动场地后要换回原来的形象——出现集里只有活动那几场用这个变体，不要整集、整剧都穿着它。',
    '- **明确换装**：分析稿或原文明确写了他换了衣服（换上、换成、更衣），就要建，不能当成「日常换衣」跳过；没有任何换装动作、只是外观写法不同的才算日常换衣。',
    '',
    '| 编号 | 角色 | 造型（平台记录） | 出现集 | 首次出现 | 镜头行 | 强信号 | 原片记录的原因 |',
    '| --- | --- | --- | --- | --- | --- | --- | --- |'
  ];
  const cell = (value) => String(value || '').replace(/\|/g, '／').replace(/\s+/g, ' ').trim() || '-';
  for (const c of candidates) {
    lines.push(`| ${cell(c.id)} | ${cell(c.role)}${c.source_role && c.source_role !== c.role ? `（分析稿里叫 ${cell(c.source_role)}）` : ''} | ${cell(c.look)}：${cell(c.description)} | ${cell(c.episodes)} | ${cell(c.first)} | ${c.rows} | ${cell(c.signals.join('、'))} | ${cell(c.cause)} |`);
  }
  lines.push('', '主造型（不用表态）：', ...[...new Map(candidates.filter((c) => c.main_look).map((c) => [c.role, c.main_look])).entries()].map(([role, look]) => `- ${role}：${look}`));
  return lines.join('\n') + '\n';
}

// 判定表模板：已有的判定按 id 保留（重跑 prepare 不丢 Agent 填过的内容）
export function decisionTemplate(candidates, existing = []) {
  const old = new Map((Array.isArray(existing) ? existing : []).filter((e) => e && e.id).map((e) => [e.id, e]));
  return candidates.map((c) => {
    const prev = old.get(c.id) || {};
    return {
      id: c.id, role: c.role, look: c.look, episodes: c.episodes, signals: c.signals,
      decision: ['build', 'skip'].includes(prev.decision) ? prev.decision : '',
      variant: String(prev.variant || ''),
      reason: String(prev.reason || '')
    };
  });
}

// scriptUsage: [{ episode, name, variant }]（剧本每场【形象】行）
export function checkAgainstScript(candidates, decisions = [], scriptUsage = []) {
  const byId = new Map((Array.isArray(decisions) ? decisions : []).map((d) => [d?.id, d]));
  const used = new Map(); // 角色 -> Map(集 -> Set(变体))
  for (const u of scriptUsage) {
    const role = String(u.name || '').trim();
    if (!used.has(role)) used.set(role, new Map());
    const eps = used.get(role);
    if (!eps.has(u.episode)) eps.set(u.episode, new Set());
    eps.get(u.episode).add(String(u.variant || '').trim());
  }
  const flags = [];
  let built = 0;
  let skipped = 0;
  for (const c of candidates) {
    const d = byId.get(c.id);
    const where = `${c.id}「${c.look}」（第 ${c.episodes} 集${c.signals.length ? '，强信号：' + c.signals.join('、') : ''}）`;
    if (!d || !['build', 'skip'].includes(d.decision)) { flags.push(`${where} 还没表态：decision 填 build 或 skip`); continue; }
    if (d.decision === 'skip') {
      skipped += 1;
      if (!String(d.reason || '').trim()) flags.push(`${where} 填了 skip 但没写 reason`);
      else if (c.signals.length && String(d.reason).trim().length < 8) flags.push(`${where} 是强信号造型却不建变体，reason 太简略——写清楚为什么观众不需要认出这个变化`);
      continue;
    }
    built += 1;
    const variant = String(d.variant || '').trim();
    if (!variant) { flags.push(`${where} 填了 build 但没写 variant（变体名）`); continue; }
    const eps = used.get(c.role);
    if (!eps) { flags.push(`${where} 要建变体「${variant}」，但剧本【形象】行里找不到角色「${c.role}」（角色名和剧本里的不一致？）`); continue; }
    const hit = c.episode_list.filter((n) => eps.get(n)?.has(variant));
    if (!hit.length) {
      const actual = c.episode_list.filter((n) => eps.has(n)).slice(0, 4).map((n) => `第${n}集=${[...eps.get(n)].join('/')}`).join('，');
      flags.push(`${where} 判定建变体「${variant}」，但剧本这几集没有一场写 ${c.role}=${variant}${actual ? `（现在是 ${actual}）` : '（这几集的【形象】行里没有这个角色）'}——把对应场次的【形象】改过来`);
    }
  }
  // ① 离开场合后要换回：功能性着装、病号服、婚礼、丧事、关押这类只属于那个场合的变体，出现在候选集数之外的集里，多半是忘了换回（男主在酒店大堂还穿着滑雪装）
  // ② 同一场活动每个参与的人都要建：有人用了功能性着装变体，同场其他人还是各自最常用的那个形象，列出来确认是没参与还是漏了
  const hints = [];
  const EVENT_BOUND = new Set(['功能性着装', '住院/病号服', '婚礼', '丧事', '关押']);
  const functional = new Set();
  for (const c of candidates) {
    const d = byId.get(c.id);
    const variant = String(d?.variant || '').trim();
    if (d?.decision !== 'build' || !variant || !c.signals.some((label) => EVENT_BOUND.has(label))) continue;
    if (c.signals.includes('功能性着装')) functional.add(`${c.role}=${variant}`);
    const eps = used.get(c.role);
    if (!eps) continue;
    const outside = [...eps.entries()].filter(([n, set]) => set.has(variant) && !c.episode_list.includes(n)).map(([n]) => n).sort((a, b) => a - b);
    if (outside.length) hints.push(`${c.role}=${variant} 在第 ${outside.slice(0, 8).join('、')} 集也在用，但分析稿里这个造型只出现在第 ${c.episodes} 集——离开那个场合后要换回原来的形象（确实一直穿着就不用改）`);
  }
  if (functional.size) {
    const count = new Map(); // 角色 -> Map(变体 -> 次数)，次数最多的当作他的常用形象
    const scenes = new Map(); // 集#场 -> [{ name, variant }]
    for (const u of scriptUsage) {
      const name = String(u.name || '').trim();
      const variant = String(u.variant || '').trim();
      if (!count.has(name)) count.set(name, new Map());
      count.get(name).set(variant, (count.get(name).get(variant) || 0) + 1);
      const key = `${u.episode}#${u.scene}`;
      if (!scenes.has(key)) scenes.set(key, []);
      scenes.get(key).push({ name, variant });
    }
    const usual = (name) => [...(count.get(name) || new Map()).entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || '';
    const missing = new Map(); // 角色 -> [场]
    for (const [key, cast] of scenes) {
      if (!cast.some((p) => functional.has(`${p.name}=${p.variant}`))) continue;
      for (const p of cast) {
        if (functional.has(`${p.name}=${p.variant}`) || p.variant !== usual(p.name) || (count.get(p.name)?.size || 0) > 1 && [...functional].some((item) => item.startsWith(p.name + '='))) continue;
        if (!missing.has(p.name)) missing.set(p.name, []);
        missing.get(p.name).push(key.replace('#', '集 '));
      }
    }
    for (const [name, where] of missing) hints.push(`${name} 在第 ${where.slice(0, 4).join('、')}${where.length > 4 ? ' 等' + where.length + '场' : ''} 和穿了功能性着装的人同场，但还是平时的形象「${usual(name)}」——他也参与了这项活动就要给他建同类变体，只是在场没参与就不用改`);
  }
  return { flags, hints, built, skipped, total: candidates.length };
}
