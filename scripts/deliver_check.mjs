// 【共用模块】洗稿交付门：平台和 Skill 用同一份，两个仓库里必须逐字节一致：
//   E:/chenyu-pro-skill/scripts/deliver_check.mjs
//   E:/chenyu-agent-platform/packages/video-reverse/src/deliver_check.mjs
// Skill 由客户的 Agent 按检查结果迭代修稿；平台由辰屿导演按同一份结果迭代修稿。
// 洗稿交付门（纯本地、零积分）：机器指标 + 审核结论.json 逐项核对，任何一项不达标就 DELIVERY_FAIL，
// 并把"下一轮要做的事"逐条列出来——Agent 照单修改、重跑，直到 DELIVERY_PASS 才算交付。
// 三个重点：剧情完整（原片主要事件逐条落位）、对话称呼（每个称呼都有归属和理由）、剧情逻辑（影响理解的问题清零、三张表齐全）。
import { parseDossier } from './asset_workbook.mjs';
import { applyRenames, parseScript, washCheck } from './wash_check.mjs';

export const REVIEW_FILE = '审核结论.json';
export const THRESHOLDS = Object.freeze({
  nearCopyRate: 0.05, // 相似度 0.7–0.8 的台词占比上限
  totalLinesDrift: 0.10, // 全剧台词量和原片相差上限
  episodeLinesDrift: 0.30, // 单集台词量相差上限（超出要在审核结论里写理由）
  addressMinLines: 5, // 台词 ≥5 句的角色，称呼要逐个登记
});

const KIN = ['爸爸', '妈妈', '爸', '妈', '爷爷', '奶奶', '外婆', '婆婆', '叔叔', '二叔', '三叔', '叔', '婶', '阿姨', '伯父', '伯母', '舅舅',
  '哥哥', '哥', '姐姐', '姐', '妹妹', '弟弟', '老公', '老婆', '夫人', '少爷', '小姐', '先生', '太太', '董事长', '前辈', '师父', '师傅',
  '丫头', '小姑娘', '老东西', '未婚夫', '未婚妻', '女儿', '儿子', '孙子', '孙女', '侄子', '老爷子'];

export function dossierEvents(dossierText) {
  const head = parseDossier(dossierText).head;
  const part = head.split('## 五、')[1] || '';
  const events = [];
  for (const line of part.split('\n')) {
    const c = line.startsWith('|') ? line.split('|').map((s) => s.trim()) : [];
    if (c.length > 4 && /^EP\d+_E\d+$/.test(c[1])) events.push({ id: c[1], episode: Number(c[2].replace(/\D/g, '')), title: c[3], desc: c[4] });
  }
  return events;
}

// 从台词里抽出"说话人 → 用到的人名/称谓"（人名 = 映射表里人物的新名 + 所有说话人名 + 非人角色）
export function addressUsage(episodes, map, dossierText) {
  const head = parseDossier(dossierText).head;
  const table = head.split('## 二、')[1]?.split('\n## ')[0] || '';
  const people = new Set(map.creatures);
  for (const line of table.split('\n')) {
    const c = line.startsWith('|') ? line.split('|').map((s) => s.trim()) : [];
    if (c.length > 3 && /^C\d+$/.test(c[1])) {
      people.add(applyRenames(c[2], map.renames).text);
      for (const a of (c[4] || '').split(/[、,，]/)) { const r = applyRenames(a.trim(), map.renames); if (r.count && r.text.length >= 2) people.add(r.text); }
    }
  }
  const lines = new Map(), usage = new Map();
  const parsed = episodes.map((e) => ({ n: e.n, d: parseScript(e.text).dialogue }));
  for (const { d } of parsed) for (const x of d) { people.add(x.who); lines.set(x.who, (lines.get(x.who) || 0) + 1); }
  for (const [from, to] of Object.entries(map.renames)) if (/^(.{1,3})(少|总|董|家|先生|医生|小姐|老师)$/.test(to) && !to.endsWith('家')) people.add(to);
  const terms = [...new Set([...people, ...KIN])].filter((t) => t.length >= 1).sort((a, b) => b.length - a.length);
  for (const { n, d } of parsed) {
    for (const x of d) {
      if ((lines.get(x.who) || 0) < THRESHOLDS.addressMinLines) continue;
      let rest = x.text;
      for (const t of terms) {
        if (t === x.who || !rest.includes(t)) continue;
        rest = rest.split(t).join('□');
        const key = `${x.who}→${t}`;
        if (!usage.has(key)) usage.set(key, { from: x.who, term: t, episodes: new Set() });
        usage.get(key).episodes.add(n);
      }
    }
  }
  return [...usage.values()];
}

const epTag = (n) => `第${String(n).padStart(3, '0')}集`;
const truthy = (v) => v === true || v === '是' || v === 'yes';

export function deliverCheck({ episodes, dossierText, map, review, gateErrors = 0, gateWarnings = [] }) {
  const todo = [];
  const report = [];
  const wc = washCheck({ episodes, dossierText, map });
  const s = wc.stats;
  const r = review || {};
  const waived = new Set((r.waivers || []).map((w) => String(w.where || w).trim()));
  const isWaived = (msg) => [...waived].some((w) => w && msg.startsWith(w));

  // ---- 一、机器指标 ----
  if (s.mode === 'keep') {
    report.push(`台词 ${s.lines} 句 / 原片 ${s.sourceLines} 句；原台词保留 ${s.retained} 句（${(s.retainRate * 100).toFixed(1)}%）`);
    const changes = r.dialogue_changes || [];
    // 登记的原句写原片原文或换名后的都认
    const sameLine = (a, b) => { const x = String(a || ''), y = String(b || ''); return x.includes(y.slice(0, 8)) || y.includes(x.slice(0, 8)); };
    const justified = (m) => changes.some((c) => Number(String(c.where || '').match(/\d+/)?.[0]) === m.n && c.reason && (!c.source || sameLine(m.source, c.source) || sameLine(m.source, applyRenames(String(c.source), map.renames).text)));
    for (const m of wc.missing || []) {
      if (!justified(m)) todo.push(`原台词要放回：${epTag(m.n)}${m.line ? ` 第${m.line}行附近` : ''} 原片「${m.source}」${m.now ? `（现在写成「${m.now}」）` : '（洗稿里没有对应的句子）'}——照原句放回（名字/设定词已按对照表换好，识别错字顺手改正）；确需改动的（设定词、逻辑补丁）在审核结论 dialogue_changes 写 {"where":"第N集","source":"原句","reason":"…"}`);
    }
  } else {
    report.push(`台词 ${s.lines} 句 / 原片 ${s.sourceLines} 句；照抄 ${s.copied} 句；偏像 ${s.nearCopied} 句（${s.lines ? ((s.nearCopied / s.lines) * 100).toFixed(1) : 0}%）`);
  }
  if (gateErrors) todo.push(`格式门还有 ${gateErrors} 处硬伤：跑 chenyu-pro gate --dir 按报告改`);
  for (const w of gateWarnings) if (!isWaived(w)) todo.push(`格式警告未处理：${w}（改掉，或在审核结论 waivers 里写明为什么不改）`);
  for (const e of wc.errors) todo.push(e);
  if (s.mode === 'rewrite' && s.lines && s.nearCopied / s.lines > THRESHOLDS.nearCopyRate) todo.push(`和原片偏像(0.7–0.8)的台词占 ${((s.nearCopied / s.lines) * 100).toFixed(1)}%，超过 ${THRESHOLDS.nearCopyRate * 100}%：wash-check 里⚠"偏像"的句子继续换说法`);
  if (s.sourceLines && Math.abs(s.lines - s.sourceLines) / s.sourceLines > THRESHOLDS.totalLinesDrift) todo.push(`全剧台词 ${s.lines} 句，原片 ${s.sourceLines} 句，相差超过 ${THRESHOLDS.totalLinesDrift * 100}%：核对是不是加戏/删戏`);
  const epNotes = new Map((r.episodes || []).map((e) => [Number(e.n), e]));
  for (const p of s.perEpisode) {
    if (p.source && Math.abs(p.lines - p.source) >= 3 && Math.abs(p.lines - p.source) / p.source > THRESHOLDS.episodeLinesDrift && !epNotes.get(p.n)?.length_note) {
      todo.push(`${epTag(p.n)} 台词 ${p.lines} 句，原片 ${p.source} 句（超过 ±${THRESHOLDS.episodeLinesDrift * 100}%）：收回到原片规模，或在审核结论 episodes[].length_note 写理由`);
    }
  }
  for (const w of wc.warnings) {
    if (/说话但不在本场|刚说完话|没进本场「人物：」行|动作行 \d+ 行，原片镜头/.test(w) && !isWaived(w)) todo.push(`${w}（改掉，或确认没问题后在审核结论 waivers 里登记 "${w.split(' ')[0]}"）`);
  }

  // ---- 二、剧情完整：原片主要事件逐条落位 ----
  const events = dossierEvents(dossierText);
  const placed = r.events || {};
  let kept = 0;
  // 只核对这次交付的集数（分批交付时，没写到的集不用登记）
  const present = new Set(episodes.map((e) => e.n));
  const inScope = events.filter((ev) => present.has(ev.episode));
  for (const ev of inScope) {
    const p = placed[ev.id];
    if (!p) { todo.push(`剧情完整：原片事件 ${ev.id}「${ev.title}」没有登记落位——在审核结论 events 里写 {"kept":true,"where":"第N集 N-M场"}`); continue; }
    if (!truthy(p.kept)) { if (!p.reason) todo.push(`剧情完整：事件 ${ev.id}「${ev.title}」标了未保留，却没写原因——补回这段戏，或写明原因（删核心情节须用户批准）`); continue; }
    if (!p.where) { todo.push(`剧情完整：事件 ${ev.id} 写了保留但没写在哪一集哪一场`); continue; }
    const n = Number(String(p.where).match(/\d+/)?.[0] || 0);
    if (n && !episodes.some((e) => e.n === n)) { todo.push(`剧情完整：事件 ${ev.id} 登记在第 ${n} 集，但剧本目录里没有这一集`); continue; }
    kept++;
  }
  report.push(`原片主要事件 ${inScope.length} 条（本次交付的集数），登记保留 ${kept} 条`);
  for (const e of r.episodes || []) {
    if (e.hook_kept !== undefined && !truthy(e.hook_kept) && !e.reason) todo.push(`${epTag(e.n)} 结尾钩子标了没保留，却没写原因`);
  }

  // ---- 二b、集与集的接缝：每个相邻两集都要核对（分批写最容易断在这里） ----
  const seams = new Map((r.seams || []).map((x) => [Number(x.from), x]));
  const nums = episodes.map((e) => e.n).sort((a, b) => a - b);
  let seamOk = 0;
  for (let i = 0; i + 1 < nums.length; i++) {
    if (nums[i + 1] !== nums[i] + 1) continue;
    const x = seams.get(nums[i]);
    if (!x) { todo.push(`接缝：${epTag(nums[i])}结尾 → ${epTag(nums[i + 1])}开头没核对——看上一集结尾钩子下一集有没有接上、日夜/地点/在场人物/形象是否连续，登记 seams {"from":${nums[i]},"ok":true,"note":"怎么接的"}`); continue; }
    if (!truthy(x.ok)) { todo.push(`接缝：${epTag(nums[i])} → ${epTag(nums[i + 1])} 标了没接上：${x.note || ''}——改稿接上后改成 ok`); continue; }
    seamOk++;
  }
  report.push(`集与集接缝 ${Math.max(0, nums.length - 1)} 处，已核对 ${seamOk} 处`);

  // ---- 二c、通读：最后一轮改稿之后，按观众视角从头读到尾（结构检查全过也可能读着不顺） ----
  const readSet = new Set();
  for (const x of r.readthrough || []) {
    const a = Number(x.from), b = Number(x.to ?? x.from);
    if (truthy(x.done) && a && b) for (let k = a; k <= b; k++) readSet.add(k);
  }
  const unread = nums.filter((n) => !readSet.has(n));
  if (unread.length) todo.push(`通读：${unread.length > 12 ? `${unread.length} 集` : unread.map(epTag).join('、')}没登记通读——最后一轮改稿后按观众视角从头读到尾（动作和台词对不对得上、语气顺不顺、指代清不清、有没有重复或跳得太突然），改完登记 readthrough {"from":1,"to":15,"done":true}`);
  report.push(`通读覆盖 ${nums.length - unread.length} / ${nums.length} 集`);

  // ---- 二d、形象外观：剧本里用到的每个「角色=形象」都要有外观描述（年龄段/发型/样貌/服装），否则下游建参考图会画错人 ----
  const pairs = new Map();
  for (const { n, text } of episodes) {
    for (const line of String(text).split(/\r?\n/)) {
      if (!line.startsWith('【形象】')) continue;
      for (const kv of line.slice(4).split(/[；;]/)) {
        const m = kv.match(/^\s*([^=＝]+)[=＝]\s*([^（(]+)/);
        if (!m) continue;
        const key = `${m[1].trim()}=${m[2].trim()}`;
        if (!pairs.has(key)) pairs.set(key, n);
      }
    }
  }
  const looks = new Map((r.looks || []).map((x) => [`${String(x.role || '').trim()}=${String(x.variant || '').trim()}`, x]));
  let lookOk = 0;
  for (const [key, first] of pairs) {
    const x = looks.get(key);
    const desc = String(x?.appearance || '');
    if (desc.replace(/\s/g, '').length < 8) { todo.push(`形象外观：「${key}」（${epTag(first)}起）没写外观——在审核结论 looks 里写 {"role","variant","appearance":"年龄段、发型、样貌、服装"}，按原片人物外观，别让下游把老人画成年轻人`); continue; }
    lookOk++;
  }
  report.push(`形象 ${pairs.size} 个，已写外观 ${lookOk} 个`);

  // ---- 三、对话称呼：每个称呼都有归属和理由 ----
  const usage = addressUsage(episodes, map, dossierText);
  const entries = r.address || [];
  let covered = 0;
  for (const u of usage) {
    const hit = entries.find((a) => a.from === u.from && (a.terms || []).includes(u.term));
    if (!hit) { todo.push(`称呼：${u.from} 在 ${[...u.episodes].sort((a, b) => a - b).map(epTag).join('、')} 说了「${u.term}」，审核结论 address 里没有登记——写明叫的是谁、为什么这么叫`); continue; }
    if (!hit.to || !hit.reason) { todo.push(`称呼：${u.from}→「${u.term}」登记了但缺 to（叫的是谁）或 reason（关系/场合/态度）`); continue; }
    covered++;
  }
  report.push(`主要角色称呼 ${usage.length} 种用法，已登记 ${covered} 种`);

  // ---- 四、剧情逻辑 ----
  const issues = r.issues || [];
  const openUnderstanding = issues.filter((i) => /理解/.test(i.level || '') && !/已改|已定|已处理|已解决|已修|不改|无需改|无需处理|只读/.test(i.status || ''));
  for (const i of openUnderstanding) todo.push(`逻辑（影响理解）未解决：${i.where || ''} ${i.desc || ''}——必须改掉`);
  for (const i of issues.filter((x) => /观感/.test(x.level || '') && !/已改|已定|已处理|已解决|已修|不改|无需改|无需处理|只读/.test(x.status || '') && !x.reason)) todo.push(`逻辑（影响观感）：${i.where || ''} ${i.desc || ''}——改掉或写不改的理由`);
  if (!(r.timeline || []).length) todo.push('逻辑：审核结论缺 timeline（统一时间线：每个"X 年前/当年"事件一行，并核对正文台词口径一致）');
  if (!(r.knowledge || []).length) todo.push('逻辑：审核结论缺 knowledge（谁知道什么：每个秘密谁在第几集、怎么知道的）');
  const fs = r.foreshadow || [];
  if (!fs.length) todo.push('逻辑：审核结论缺 foreshadow（伏笔回收表：埋在哪集、回收在哪集）');
  for (const f of fs) if (!f.paid) todo.push(`逻辑：伏笔「${f.item}」（第 ${f.planted} 集埋）没有回收——补回收，或删掉这个伏笔`);
  for (const d of r.speaker_decisions || []) if (!d.decided || /待核|人工|不确定/.test(d.decided) || !d.basis) todo.push(`说话人/身份判定没定下来：${d.where}——按剧情定，写明依据，不推给用户`);
  report.push(`逻辑问题 ${issues.length} 条（影响理解未解决 ${openUnderstanding.length} 条）；伏笔 ${fs.length} 条；时间线 ${(r.timeline || []).length} 行；知情表 ${(r.knowledge || []).length} 行`);

  return { pass: todo.length === 0, todo, report, events, usage };
}
