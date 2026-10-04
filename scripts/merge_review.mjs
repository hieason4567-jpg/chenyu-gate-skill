// 人物合并复核（纯本地、零积分）：ASSETS_PASS 以前只查「表填全了没有」，不查「该合的合了没有」。
// 2026-10-04：一部 68 集的整理通过后还剩 128 个职业/镜头标签，其中「小张／黑衣监控分析员」「江浩／赛事蓝衣选手」
// 「曹启彪／第30集男弟子甲」是同一个人，被用户指出才合并。
//
// 试过自动找「疑似同一人」的对子（外观重合、同框排除、说话人和动作主语对不上），在真实 68 集数据上只抓到两三对，
// 已知的例子一个都抓不到——是不是同一个人要看剧情，程序判断不了。所以这里不替 Agent 判断，只做一件事：
// 合并之后还剩下的「称谓/职业/镜头描述式」角色里，戏份不小的（3 句台词以上，或跨了 2 集以上），
// 每一个都要 Agent 给出「他确实是独立的人、剧里也没有名字」的依据，否则就回合并表里并掉或改成真名。
// 只有一两句台词的单集龙套不查。

export const ROLE_REVIEW_FILE = '称谓角色复核.md';
export const ROLE_DECISION_FILE = '称谓角色复核.json';

// 名字像称谓/职业/外观描述/镜头标签，而不是人名
const DESCRIPTIVE_NAME_RE = /(男子|女子|男人|女人|少年|少女|青年|中年|老人|老者|老太|大妈|大爷|小孩|男孩|女孩|选手|学员|弟子|队员|成员|教练|宗师|武者|保安|保镖|司机|医生|护士|记者|主持|裁判|观众|群众|路人|工人|服务员|店员|经理|主管|助理|秘书|管家|佣人|警察|警员|士兵|军官|分析员|工作人员|负责人|手下|打手|随从|女友|男友|黑衣|白衣|蓝衣|红衣|灰衣|甲$|乙$|丙$|丁$|戊$|[A-Z]$|\d+$)/;
export const isDescriptiveName = (name) => DESCRIPTIVE_NAME_RE.test(String(name || '')) || /^(EP\d+|OBS_)/i.test(String(name || ''));

// 角色名本身是地点、柜台或物件的名字（「前台」「礼宾台」）：人和柜台用同一个词，后面每一步都会混。
// 2026-10-04 一部剧里 [前台-前台] 出现 202 处，其中 179 处其实指的是柜台。必须改成指人的名字（前台接待、礼宾员、保安员）。
const PLACE_LIKE_ROLE_RE = /^(前台|礼宾台?|吧台|柜台|收银台|服务台|咨询台|导诊台|问讯处|接待处|售票处|挂号处|门卫室?|保安室|值班室|传达室|门岗|岗亭|大堂|餐厅|厨房|后厨|病房|诊室|药房|办公室|会议室|车间|仓库|店铺|柜面|窗口)$/;
export function placeLikeRoleNames(roleNames = [], { places = [], props = [] } = {}) {
  const taken = new Set([...places, ...props].map((name) => String(name || '').trim()).filter(Boolean));
  return [...new Set(roleNames.map((name) => String(name || '').trim()).filter(Boolean))]
    .filter((name) => PLACE_LIKE_ROLE_RE.test(name) || taken.has(name))
    .map((name) => ({ name, why: taken.has(name) ? '和整理出的场景/道具同名' : '是地点或柜台的名字' }));
}

const sizeOf = (value) => (value?.size ?? value?.length ?? 0);
const epNumber = (id) => Number(String(id || '').replace(/\D/g, '')) || 0;

// labels: collectAssetEvidence(整理版合集).labels 的值（{ name, episodes, lines:[{episode,time,text,action}], looks }）
export function rolesNeedingReview(labels = [], { minLines = 3, minEpisodes = 2 } = {}) {
  const all = [...labels];
  const named = all.filter((x) => !isDescriptiveName(x.name) && sizeOf(x.episodes) >= 2);
  const items = [];
  for (const x of all) {
    if (!isDescriptiveName(x.name)) continue;
    const lineCount = (x.lines || []).length;
    const episodeCount = sizeOf(x.episodes);
    if (lineCount < minLines && episodeCount < minEpisodes) continue;
    const episodes = [...x.episodes].map(epNumber).filter(Boolean).sort((a, b) => a - b);
    const here = new Set(episodes);
    // 同集出场的具名角色：是不是其中某一个，由 Agent 按剧情判断
    const around = named.filter((n) => [...n.episodes].some((ep) => here.has(epNumber(ep)))).sort((a, b) => sizeOf(b.episodes) - sizeOf(a.episodes)).slice(0, 8).map((n) => n.name);
    items.push({
      id: x.name, name: x.name, episodes, line_count: lineCount,
      looks: [...(x.looks instanceof Map ? x.looks.keys() : (x.looks || []))].slice(0, 2).map((look) => (Array.isArray(look) ? look[0] : String(look || ''))).filter(Boolean),
      samples: (x.lines || []).slice(0, 3).map((line) => ({ where: `${line.episode} ${line.time}`, text: String(line.text || ''), action: String(line.action || '') })),
      around
    });
  }
  items.sort((a, b) => b.line_count - a.line_count || b.episodes.length - a.episodes.length);
  return items;
}

export function renderRoleReview(items, { totalRoles = 0, descriptiveRoles = 0 } = {}) {
  const cell = (value) => String(value || '').replace(/\|/g, '／').replace(/\s+/g, ' ').trim() || '-';
  const lines = [
    '# 称谓角色复核（人物合并的最后一步）',
    '',
    `整理后共 ${totalRoles} 个角色，其中 ${descriptiveRoles} 个还是称谓/职业/镜头描述式的名字。下面 ${items.length} 个戏份不小（3 句台词以上，或跨了 2 集以上），逐个确认：`,
    '',
    '1. **他是不是已有的某个具名角色？** 同一个人在不同集被平台记成了不同的称呼（「赛事蓝衣选手」其实是江浩，「第30集男弟子甲」其实是曹启彪）。',
    '   看他的台词、谁在跟他说话、他在办什么事，对照「同集出场的具名角色」。是 → 回 `资产合并表.json` 并到那个角色名下（加进 `aliases` 或把 `labels` 指过去）。',
    '2. **剧里有没有喊过他的名字？** 台词、字幕、名牌里出现过名字 → 把正式名改成真名，称谓放进 `aliases`。',
    '3. **确实是没有名字的独立角色** → 在 `称谓角色复核.json` 里 `decision` 填 `independent`，`reason` 写依据',
    '   （比如「第 34–37 集的主治医生，全程被称作医生，和具名角色同框对话」）。',
    '',
    '并掉或改名的，重跑 `assets-apply` 后会自动从这张表里消失；剩下的都要有 `independent` + 依据，才给 `ASSETS_PASS`。',
    '',
    '| 角色（现在的名字） | 出现集 | 台词数 | 外观 | 台词样例 | 同集出场的具名角色 |',
    '| --- | --- | --- | --- | --- | --- |'
  ];
  for (const item of items) {
    const samples = item.samples.map((s) => `${s.where}「${s.text}」`).join(' ／ ');
    lines.push(`| ${cell(item.name)} | ${cell(item.episodes.join('、'))} | ${item.line_count} | ${cell(item.looks.join('；'))} | ${cell(samples)} | ${cell(item.around.join('、'))} |`);
  }
  return lines.join('\n') + '\n';
}

export function roleDecisionTemplate(items, existing = []) {
  const old = new Map((Array.isArray(existing) ? existing : []).filter((e) => e && e.id).map((e) => [e.id, e]));
  return items.map((item) => {
    const prev = old.get(item.id) || {};
    return { id: item.id, episodes: item.episodes.join('、'), lines: item.line_count, decision: prev.decision === 'independent' ? 'independent' : '', reason: String(prev.reason || '') };
  });
}

export function pendingRoleReviews(items, decisions = []) {
  const byId = new Map((Array.isArray(decisions) ? decisions : []).map((d) => [d?.id, d]));
  const pending = [];
  for (const item of items) {
    const d = byId.get(item.id);
    const where = `「${item.name}」（第 ${item.episodes.join('、')} 集，${item.line_count} 句台词）`;
    if (d?.decision !== 'independent') pending.push(`${where} 还没确认：是某个具名角色就并掉，有名字就改名，确实独立就填 independent + reason`);
    else if (String(d.reason || '').trim().length < 8) pending.push(`${where} 填了 independent 但 reason 太简略，写明为什么不是已有的具名角色`);
  }
  return pending;
}
