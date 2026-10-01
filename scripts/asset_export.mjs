// 全局资产清单（纯本地、零积分）：从剧本的 场次头 / 人物： / 【形象】 / 【道具】 行汇总全剧人物、形象、场景、道具，
// 合并审核结论.json 里的外观描述，导出给下游建角色卡/场景图/道具图用。
const epTag = (n) => `第${String(n).padStart(3, '0')}集`;
const span = (set) => {
  const a = [...set].sort((x, y) => x - y);
  const parts = [];
  for (let i = 0; i < a.length; i++) {
    let j = i;
    while (j + 1 < a.length && a[j + 1] === a[j] + 1) j++;
    parts.push(i === j ? `${a[i]}` : `${a[i]}–${a[j]}`);
    i = j;
  }
  return parts.join('、');
};
// 括号内的 、，, 换成／（多个归属），括号内的 ；; 保留（归属；状态 的分隔），只在括号外按 、，,；; 拆项
const splitList = (s) => String(s || '').replace(/[（(][^）)]*[）)]/g, (m) => m.replace(/[、，,]/g, '／').replace(/[；;]/g, '\u0001')).split(/[、，,；;]/).map((x) => x.replace(/\u0001/g, '；').trim()).filter(Boolean);

export function collectAssets(episodes, { looks = [], creatures = [] } = {}) {
  const people = new Map(); // 名 -> { eps:Set, lines, looks: Map(变体 -> { eps:Set, appearance }) }
  const scenes = new Map(); // 场景名 -> { eps:Set, times:Set }
  const casting = new Map(); // 集 -> Map(场次号 -> { 角色: 变体 })，客户端按场绑定 [角色-变体名]
  let sceneNo = '';
  const props = new Map(); // 道具名 -> { eps:Set, owners:Set, states:Set, counts:Set }
  const person = (name) => { if (!people.has(name)) people.set(name, { eps: new Set(), lines: 0, looks: new Map() }); return people.get(name); };
  const lookText = new Map(looks.map((x) => [`${String(x.role || '').trim()}=${String(x.variant || '').trim()}`, String(x.appearance || '')]));
  for (const { n, text } of episodes) {
    for (const raw of String(text).replace(/\r\n/g, '\n').split('\n')) {
      const l = raw.trim();
      const head = l.match(/^\d+\s*[-–—]\s*\d+\s+(日|夜|晨|昏|黄昏|清晨|傍晚|白天|夜晚)?\s*(内|外|室内|室外)?\s*(.+)$/);
      if (head && /^\d+-\d+\s/.test(l)) {
        sceneNo = l.match(/^(\d+-\d+)/)[1];
        const name = head[3].trim();
        if (!scenes.has(name)) scenes.set(name, { eps: new Set(), times: new Set() });
        scenes.get(name).eps.add(n);
        if (head[1] || head[2]) scenes.get(name).times.add(`${head[1] || ''}${head[2] || ''}`);
        continue;
      }
      if (/^人物[:：]/.test(l)) { for (const p of splitList(l.slice(3))) person(p).eps.add(n); continue; }
      if (l.startsWith('【形象】')) {
        for (const kv of l.slice(4).split(/[；;]/)) {
          const m = kv.match(/^\s*([^=＝]+)[=＝]\s*([^（(]+)(?:[（(]([^）)]*)[）)])?/);
          if (!m) continue;
          const who = m[1].trim(), v = m[2].trim();
          const p = person(who); p.eps.add(n);
          if (!p.looks.has(v)) p.looks.set(v, { eps: new Set(), scenes: 0, reason: '', appearance: lookText.get(`${who}=${v}`) || '' });
          const lk = p.looks.get(v);
          lk.eps.add(n); lk.scenes++;
          if (!lk.reason && m[3]) lk.reason = m[3].trim();
          if (sceneNo) {
            if (!casting.has(n)) casting.set(n, new Map());
            const byScene = casting.get(n);
            if (!byScene.has(sceneNo)) byScene.set(sceneNo, {});
            byScene.get(sceneNo)[who] = v;
          }
        }
        continue;
      }
      if (l.startsWith('【道具】')) {
        for (const item of splitList(l.slice(4))) {
          const inner = (item.match(/[（(]([^）)]+)[）)]/) || [])[1] || '';
          const [owner, ...stateParts] = inner.split(/[；;]/);
          const count = (item.match(/[×xX*](\d+)/) || [])[1] || '';
          const name = item.replace(/[（(][^）)]*[）)]/g, '').replace(/[×xX*]\d+/, '').trim();
          if (!name) continue;
          if (!props.has(name)) props.set(name, { eps: new Set(), owners: new Set(), states: new Set(), counts: new Set() });
          const pr = props.get(name); pr.eps.add(n);
          for (const o of String(owner || '').split('／')) if (o.trim()) pr.owners.add(o.trim());
          for (const s of stateParts) if (s.trim()) pr.states.add(s.trim());
          if (count) pr.counts.add(count);
        }
        continue;
      }
      const d = l.match(/^([^△（【\s][^：:（]{0,14})(?:（[^）]*）)?[：:]/);
      if (d && !/^(人物|形象|道具|场景|环境|画面)$/.test(d[1].trim()) && people.has(d[1].trim())) people.get(d[1].trim()).lines++;
    }
  }
  const creatureSet = new Set(creatures);
  return { people, scenes, props, creatureSet, casting };
}

export function renderAssetList({ people, scenes, props, creatureSet }, { title = '' } = {}) {
  const rows = [];
  rows.push(`# ${title ? title + ' · ' : ''}全局资产清单`, '');
  rows.push(`人物 ${people.size} 个（其中非人角色 ${[...people.keys()].filter((k) => creatureSet.has(k)).length} 个）｜形象 ${[...people.values()].reduce((s, p) => s + p.looks.size, 0)} 个｜场景 ${scenes.size} 个｜道具 ${props.size} 件`, '');
  rows.push('## 一、人物与形象', '', '| 人物 | 类型 | 出场集 | 台词句数 | 形象（变体名） | 外观 | 该形象出现集 |', '| --- | --- | --- | --- | --- | --- | --- |');
  const ordered = [...people.entries()].sort((a, b) => (b[1].lines - a[1].lines) || (Math.min(...a[1].eps) - Math.min(...b[1].eps)));
  for (const [name, p] of ordered) {
    const kind = creatureSet.has(name) ? '非人角色' : /数人|若干|\d+名|[二两三四五六七八九十]名/.test(name) ? '群体' : '人物';
    const looks = [...p.looks.entries()];
    if (!looks.length) rows.push(`| ${name} | ${kind} | ${span(p.eps)} | ${p.lines} | - | - | - |`);
    looks.forEach(([v, lk], i) => rows.push(`| ${i ? '' : name} | ${i ? '' : kind} | ${i ? '' : span(p.eps)} | ${i ? '' : p.lines} | ${v} | ${lk.appearance || '（待补外观）'} | ${span(lk.eps)} |`));
  }
  rows.push('', '## 二、场景', '', '| 场景 | 日夜/内外 | 出现集 |', '| --- | --- | --- |');
  for (const [name, s] of [...scenes.entries()].sort((a, b) => Math.min(...a[1].eps) - Math.min(...b[1].eps))) rows.push(`| ${name} | ${[...s.times].join('、') || '-'} | ${span(s.eps)} |`);
  rows.push('', '## 三、道具', '', '| 道具 | 归属 | 数量 | 出现集 | 场景中的状态/去向 |', '| --- | --- | --- | --- | --- |');
  for (const [name, pr] of [...props.entries()].sort((a, b) => b[1].eps.size - a[1].eps.size || Math.min(...a[1].eps) - Math.min(...b[1].eps))) rows.push(`| ${name} | ${[...pr.owners].join('、') || '-'} | ${[...pr.counts].join('/') || '-'} | ${span(pr.eps)} | ${[...pr.states].slice(0, 6).join('；') || '-'} |`);
  return rows.join('\n') + '\n';
}

// 道具叫法检查：同一件东西多个叫法（轮椅/空轮椅）、两件东西合成一项（托盘和药瓶）
export function propNameIssues({ props }) {
  const names = [...props.keys()];
  const issues = [];
  for (const n of names) if (/[和与及]/.test(n) && n.length > 3) issues.push(`「${n}」像是两件东西写成了一项——一件道具写一项`);
  const used = new Set();
  for (const a of [...names].sort((x, y) => x.length - y.length)) {
    if (used.has(a) || a.length < 2) continue;
    const same = names.filter((b) => b !== a && !used.has(b) && b.includes(a) && !/[和与及]/.test(b));
    if (same.length) { issues.push(`「${[a, ...same].join('」「')}」可能是同一件道具的不同叫法——全剧用一个名字，状态写进括号`); same.forEach((x) => used.add(x)); }
  }
  return issues;
}

export function assetListJson({ people, scenes, props, creatureSet }) {
  return {
    characters: [...people.entries()].map(([name, p]) => ({ name, creature: creatureSet.has(name), episodes: [...p.eps].sort((a, b) => a - b), dialogue_lines: p.lines, looks: [...p.looks.entries()].map(([variant, lk]) => ({ tag: `[${name}-${variant}]`, variant, appearance: lk.appearance, episodes: [...lk.eps].sort((a, b) => a - b) })) })),
    scenes: [...scenes.entries()].map(([name, s]) => ({ name, times: [...s.times], episodes: [...s.eps].sort((a, b) => a - b) })),
    props: [...props.entries()].map(([name, pr]) => ({ name, owners: [...pr.owners], states: [...pr.states], counts: [...pr.counts], episodes: [...pr.eps].sort((a, b) => a - b) }))
  };
}
const GROUP_RE = /数人|若干|\d+名|[二两三四五六七八九十]名|们$/;
const CREATURE_RE = /蛊|虫|蛾|蟾|蛙|螳螂|蜂|蛛|蝶|鸭|鹅|鸵鸟|鸟|兽|蛇|狐|猫|狗|犬|兔|龟|鼠|狼|熊/;
const HUMAN_LOOK_RE = /男|女|老人|老者|孩|西装|衬衫|外套|大衣|长袍|裙|裤|头发|盘发|短发|长发|辫/;

// 形象表（给客户端「上传形象表」用）：有这张表时客户端按表建角色形象卡、按场绑定 [角色-变体名]，不再让 AI 猜变体。
// main = 场次最多的那个形象；reason 取【形象】括号里第一次写的原因（伪装/回忆/受伤…）；scenes 按 集 -> 场次号 -> 角色=变体。
export function lookTableJson({ people, creatureSet, casting, scenes: places = new Map(), props = new Map() }, { title = '' } = {}) {
  const characters = [];
  for (const [name, p] of people) {
    const looks = [...p.looks.entries()];
    if (!looks.length) continue;
    const main = looks.reduce((a, b) => (b[1].scenes > a[1].scenes ? b : a))[0];
    characters.push({
      name,
      kind: creatureSet.has(name) || CREATURE_RE.test(name + (p.looks.get(main)?.appearance || '')) && !HUMAN_LOOK_RE.test(p.looks.get(main)?.appearance || '') ? 'creature' : GROUP_RE.test(name) ? 'group' : 'human',
      episodes: span(p.eps),
      looks: looks.map(([variant, lk]) => ({ variant, tag: `[${name}-${variant}]`, main: variant === main, reason: variant === main ? '' : lk.reason, appearance: lk.appearance, episodes: span(lk.eps) }))
    });
  }
  const scenes = {};
  for (const [n, byScene] of [...casting.entries()].sort((a, b) => a[0] - b[0])) scenes[n] = Object.fromEntries(byScene);
  // 场景与道具清单（每项出现集数）：客户端有了这两段就不再全剧扫描资产，场景卡/道具卡照表建；
  // key=跨 2 集以上的道具（客户端先建卡），单集道具到那一集分集规划时按需建
  const placeList = [...places.entries()].sort((a, b) => Math.min(...a[1].eps) - Math.min(...b[1].eps))
    .map(([name, s]) => ({ name, times: [...s.times], episodes: span(s.eps) }));
  const propList = [...props.entries()].sort((a, b) => Math.min(...a[1].eps) - Math.min(...b[1].eps))
    .map(([name, pr]) => ({ name, key: pr.eps.size >= 2, owners: [...pr.owners], counts: [...pr.counts], states: [...pr.states].slice(0, 6), episodes: span(pr.eps) }));
  return { schema: 'chenyu.look-table/v1', title, characters, scenes, places: placeList, props: propList };
}

// 场景道具设计（和客户端全局资产表同一套规则，知识库 asset.global_table.system）：
// 场景写可搭建的空间说明，道具先判断要不要建卡、要建的写实体外观；合并进形象表 places/props，客户端照描述建卡出图
export const PLACE_PROP_DESIGN_FILE = '场景道具设计.json';
const hanCount = (s) => (String(s || '').match(/[㐀-鿿]/g) || []).length;

export function placePropTemplate(table, existing = [], inputs = new Map()) {
  const old = new Map((Array.isArray(existing) ? existing : []).filter((e) => e && e.type && e.name).map((e) => [`${e.type}=${e.name}`, e]));
  const rows = [];
  for (const p of table.places || []) {
    const prev = old.get(`place=${p.name}`);
    rows.push({ type: 'place', name: p.name, input: inputs.get(`place=${p.name}`) || { times: p.times, episodes: p.episodes },
      design: prev?.design || { description: '', shortDescription: '', parentLocation: '' } });
  }
  for (const p of table.props || []) {
    const prev = old.get(`prop=${p.name}`);
    rows.push({ type: 'prop', name: p.name, input: inputs.get(`prop=${p.name}`) || { owners: p.owners, states: p.states, episodes: p.episodes },
      design: prev?.design || { card: null, reason: '', description: '', shortDescription: '' } });
  }
  return rows;
}

// 字数、字段按客户端全局资产表契约：场景 80–180 字、道具 50–140 字、短标签 4–18 字
export function placePropIssues(e) {
  const d = e?.design || {};
  const tag = `${e.type === 'place' ? '场景' : '道具'}「${e.name}」`;
  const out = [];
  const short = String(d.shortDescription || '').trim();
  if (e.type === 'place') {
    const n = hanCount(d.description);
    if (!n) return [`${tag} 没写 description`];
    if (n < 80 || n > 180) out.push(`${tag} description ${n} 字，要 80–180 字的可搭建空间说明（布局、门窗墙地、固定家具、纵深）`);
    if (!String(d.parentLocation || '').trim()) out.push(`${tag} 没写 parentLocation（所属物理地点，同一建筑/院落/机构/车辆填同一个）`);
  } else {
    if (d.card !== true && d.card !== false) return [`${tag} card 要填 true（建卡出图）或 false（不建卡）`];
    if (d.card === false) { if (!String(d.reason || '').trim()) out.push(`${tag} 不建卡要写 reason`); return out; }
    const n = hanCount(d.description);
    if (!n) return [`${tag} 建卡但没写 description`];
    if (n < 50 || n > 140) out.push(`${tag} description ${n} 字，要 50–140 字的实体外观说明`);
  }
  if (hanCount(short) < 4 || hanCount(short) > 18) out.push(`${tag} shortDescription 要 4–18 字`);
  return out;
}

export function mergePlacePropDesigns(table, entries) {
  const issues = [];
  const byKey = new Map((Array.isArray(entries) ? entries : []).map((e) => [`${e?.type}=${e?.name}`, e]));
  for (const p of table.places || []) {
    const e = byKey.get(`place=${p.name}`);
    if (!e) { issues.push(`场景「${p.name}」没有设计（重跑 looks-prepare 补模板）`); continue; }
    issues.push(...placePropIssues(e));
    const d = e.design || {};
    if (String(d.description || '').trim()) Object.assign(p, { description: String(d.description).trim(), shortDescription: String(d.shortDescription || '').trim(), parentLocation: String(d.parentLocation || '').trim() });
  }
  for (const p of table.props || []) {
    const e = byKey.get(`prop=${p.name}`);
    if (!e) { issues.push(`道具「${p.name}」没有设计（重跑 looks-prepare 补模板）`); continue; }
    issues.push(...placePropIssues(e));
    const d = e.design || {};
    if (d.card === true || d.card === false) p.card = d.card;
    if (d.card === false && d.reason) p.reason = String(d.reason).trim();
    if (d.card === true && String(d.description || '').trim()) Object.assign(p, { description: String(d.description).trim(), shortDescription: String(d.shortDescription || '').trim() });
  }
  return issues;
}

// 形象表体检：没写外观的形象、非主形象没写原因
export function lookTableIssues(table) {
  const issues = [];
  for (const c of table.characters) for (const l of c.looks) {
    if (!l.appearance) issues.push(`${l.tag} 没写外观（审核结论 looks 补 appearance：年龄段、发型、样貌、服装）`);
    if (!l.main && !l.reason) issues.push(`${l.tag} 不是主形象但没写因何而变（【形象】括号里写剧情原因：伪装/回忆/受伤/变身…；没有剧情原因的日常换装并入主形象）`);
  }
  return issues;
}

export { epTag };

// ───────── 形象设计（走客户端造型 AI 的同一套固定流程，思考由 Agent 做） ─────────
// Agent 读的提示词＝客户端造型 AI 收到的同一套：知识库 styling.core_rules / styling.voice_preset_guide（运行时用积分 KEY 取）、
// 豆包音色候选、全量形象库索引、原文审核规则；回答＝造型 AI 单条返回的原样 JSON（styling）。
// 客户端拿到 look.styling 当作模型回答，走同一条解析/归一化/分类/音色/审核路径，卡片字段全部由客户端原流程产出。
export const STYLING_FIELDS = ['classification', 'wardrobeCapsuleId', 'description', 'voicePresetKey', 'voiceRefDescription', 'ttsProvider', 'doubaoVoiceId', 'doubaoVoiceModel', 'doubaoVoiceSpeed'];
const DESCRIPTION_MARKERS = ['性别：', '年龄段：', '外观特征：', '脸部：', '身材：', '发型：', '服饰类型：', '发色：', '主色调：', '部件配色：', '视觉锚点：'];

export function emptyStyling() {
  return { classification: { roleDomain: '', roleTags: [] }, wardrobeCapsuleId: '', description: '', voicePresetKey: '', voiceRefDescription: '', ttsProvider: 'Doubao', doubaoVoiceId: '', doubaoVoiceModel: 'seed-tts-2.0', doubaoVoiceSpeed: 1 };
}

/** 形象设计模板：每个形象一条（造型 AI 单条返回格式），已填的保留；input 是给 Agent 的角色信息 */
export function lookStylingTemplate(table, existing = [], inputs = new Map()) {
  const prev = new Map((Array.isArray(existing) ? existing : []).map((e) => [`${e.role}=${e.variant}`, e]));
  const out = [];
  for (const c of table.characters) for (const l of c.looks) {
    const key = `${c.name}=${l.variant}`;
    const old = prev.get(key);
    out.push({ role: c.name, variant: l.variant, characterName: `[${c.name}-${l.variant}]`, kind: c.kind, main: l.main, reason: l.reason, episodes: l.episodes,
      input: inputs.get(key) || { appearanceFeatures: l.appearance || '' },
      styling: { ...emptyStyling(), ...(old?.styling || {}) } });
  }
  return out;
}

/** 按客户端的要求查一条回答：缺字段、描述不足 120 字或缺段落/顺序不对、音色预设与性别不符、音色编号/胶囊编号不在清单里 */
export function stylingIssues(entry, { voiceIds = null, capsuleIds = null, gender = '' } = {}) {
  const s = entry.styling || {};
  const issues = [];
  for (const k of ['wardrobeCapsuleId', 'description', 'voicePresetKey', 'voiceRefDescription', 'doubaoVoiceId']) if (!String(s[k] || '').trim()) issues.push(`缺 ${k}`);
  if (!s.classification || !String(s.classification.roleDomain || '').trim()) issues.push('缺 classification.roleDomain');
  const desc = String(s.description || '');
  if (desc) {
    const zh = (desc.match(/[\u4e00-\u9fff]/g) || []).length;
    if (zh < 120) issues.push(`description 只有 ${zh} 个中文字（客户端要求 ≥120）`);
    let at = -1;
    for (const m of DESCRIPTION_MARKERS) {
      const i = desc.indexOf(m);
      if (i < 0) { issues.push(`description 缺「${m}」`); continue; }
      if (i < at) issues.push(`description「${m}」顺序不对（按 性别→年龄段→外观特征→脸部→身材→发型→服饰类型→发色→主色调→部件配色→视觉锚点）`);
      at = Math.max(at, i);
    }
  }
  const vp = String(s.voicePresetKey || '');
  if (vp && !/^(男|女)-(儿童|少年|青年|中年|老年)-[\u4e00-\u9fffA-Za-z0-9]+$/u.test(vp)) issues.push(`voicePresetKey「${vp}」格式不对（性别-年龄-音色）`);
  const g = String(gender || '');
  if (vp && /女/.test(g) && vp.startsWith('男-')) issues.push(`voicePresetKey「${vp}」与女性角色不符`);
  if (vp && /男/.test(g) && !/女/.test(g) && vp.startsWith('女-')) issues.push(`voicePresetKey「${vp}」与男性角色不符`);
  if (voiceIds && s.doubaoVoiceId && !voiceIds.has(String(s.doubaoVoiceId))) issues.push(`doubaoVoiceId「${s.doubaoVoiceId}」不在豆包音色候选里`);
  if (capsuleIds && s.wardrobeCapsuleId && !capsuleIds.has(String(s.wardrobeCapsuleId))) issues.push(`wardrobeCapsuleId「${s.wardrobeCapsuleId}」不在形象库里（用全量形象库索引里的真实 id）`);
  if (String(s.ttsProvider || 'Doubao') !== 'Doubao') issues.push('ttsProvider 必须是 Doubao');
  return issues;
}

/** 把回答并进形象表 looks[].styling；返回问题清单 */
export function mergeLookStylings(table, entries = [], opts = {}) {
  const byKey = new Map((Array.isArray(entries) ? entries : []).map((e) => [`${e.role}=${e.variant}`, e]));
  const issues = [];
  for (const c of table.characters) for (const l of c.looks) {
    const e = byKey.get(`${c.name}=${l.variant}`);
    if (!e || !String(e.styling?.description || '').trim()) { issues.push(`[${c.name}-${l.variant}] 还没有形象设计`); continue; }
    const problems = stylingIssues(e, { ...opts, gender: e.input?.gender || '' });
    for (const x of problems) issues.push(`[${c.name}-${l.variant}] ${x}`);
    const st = {};
    for (const k of STYLING_FIELDS) if (e.styling[k] !== undefined && e.styling[k] !== '') st[k] = e.styling[k];
    l.styling = st;
  }
  return issues;
}

/** 全量形象库索引（和客户端 buildFullWardrobeCatalogIndexJson 同结构：id/label/gender/ageBands/roleTags，表格式无损传输） */
const COLOR_WORD_RE = /(黑|白|灰|红|橙|黄|绿|青|蓝|紫|粉|棕|褐|咖|金|银|米|杏|驼|卡其|藏青|墨|酒红|玫红|藏蓝|靛|奶|象牙|雾|浅|深)(色)?/g;
export function buildCatalogIndex(capsules = []) {
  const columns = ['id', 'label', 'gender', 'ageBands', 'roleTags'];
  const rows = capsules.map((c) => [c.id, String(c.label || '').replace(COLOR_WORD_RE, '').trim() || c.label, c.gender || 'any', c.ageBands || [], c.roleTags || []]);
  return JSON.stringify({ columns, rows });
}
