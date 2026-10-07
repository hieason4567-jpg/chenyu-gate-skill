// 【共用模块】洗稿检查：平台和 Skill 用同一份，两个仓库里必须逐字节一致：
//   E:/chenyu-pro-skill/scripts/wash_check.mjs
//   E:/chenyu-agent-platform/packages/video-reverse/src/wash_check.mjs
// Skill 由客户的 Agent 按检查结果迭代修稿；平台由辰屿导演按同一份结果迭代修稿。
// 洗稿检查（纯本地、零积分）：拿洗稿正文逐集对照平台分析稿，查照抄、台词量、旧名残留、说话人在场、
// 非人角色被外人接话、年份口径。名字对照表 洗稿映射.json 同时供 rename 命令做一字不差的换名。
import { DESCRIPTOR_ALIAS_RE, GENERIC_ROLE_RE, parseDossier } from './asset_workbook.mjs';

export const WASH_MAP_FILE = '洗稿映射.json';
export const COPY_ERROR = 0.8;
export const COPY_WARN = 0.7;
const MIN_COPY_CHARS = 6;

const bare = (s) => String(s || '').replace(/[^一-龥A-Za-z0-9]/g, '');
const isNone = (s) => /^(none|\[none\]|无|-)?$/i.test(String(s || '').trim());

// 字符级相似度：2*LCS/(|a|+|b|)，和 difflib ratio 口径接近。
export function similarity(a, b) {
  const x = bare(a), y = bare(b);
  if (!x.length || !y.length) return 0;
  let prev = new Array(y.length + 1).fill(0);
  for (let i = 1; i <= x.length; i++) {
    const cur = new Array(y.length + 1).fill(0);
    for (let j = 1; j <= y.length; j++) cur[j] = x[i - 1] === y[j - 1] ? prev[j - 1] + 1 : Math.max(prev[j], cur[j - 1]);
    prev = cur;
  }
  return (2 * prev[y.length]) / (x.length + y.length);
}

export function normalizeWashMap(raw = {}) {
  const renames = {};
  const list = (v) => (Array.isArray(v) ? v.map((s) => String(s).trim()).filter(Boolean) : []);
  // keep：分析稿人物表里有、但按用户要求不换名的（只改名模式下的设定词/物种名，如「母蛊」）；写成 源名=源名 也算 keep
  const keep = new Set(list(raw.keep));
  for (const [from, to] of Object.entries(raw.renames || {})) {
    const f = String(from).trim(), t = String(to).trim();
    if (f && t && f !== t) renames[f] = t;
    else if (f && f === t) keep.add(f);
  }
  return { renames, keep: [...keep], creatures: list(raw.creatures), insiders: list(raw.insiders), dialogue: raw.dialogue === 'rewrite' ? 'rewrite' : 'keep' };
}

// 映射表自检：一个源名只能对应一个新名（JSON 天然保证）；两个源名不能换成同一个新名（除非是同一人的别写，允许但提示）；
// 新名不能包含别的源名（换完会被当成残留）。
export function checkWashMap(map) {
  const problems = [], warnings = [];
  const byTarget = new Map();
  for (const [from, to] of Object.entries(map.renames)) {
    if (!byTarget.has(to)) byTarget.set(to, []);
    byTarget.get(to).push(from);
  }
  for (const [to, froms] of byTarget) if (froms.length > 1) warnings.push(`「${froms.join('」「')}」都换成「${to}」——确认它们是同一个人/地点/物件的不同写法`);
  const sources = Object.keys(map.renames);
  for (const [from, to] of Object.entries(map.renames)) {
    const hit = sources.find((s) => s !== from && s.length >= 2 && to.includes(s) && !from.includes(s));
    if (hit) problems.push(`新名「${to}」里含有源名「${hit}」，换完后会被当成残留——换一个新名`);
  }
  return { problems, warnings };
}

// 一次扫描、长名优先的整词替换（不会链式替换：A→B 之后 B 不会再被别的规则改）。
export function applyRenames(text, renames) {
  const keys = Object.keys(renames).sort((a, b) => b.length - a.length);
  if (!keys.length) return { text, count: 0 };
  const re = new RegExp(keys.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'g');
  let count = 0;
  const out = String(text).replace(re, (m) => { count++; return renames[m]; });
  return { text: out, count };
}

const SPEAKER_RE = /^([^△（(【\s#|][^：:（(]{0,14})(?:[（(][^）)]*[）)])?[：:](.*)$/;
const OFFSCREEN_RE = /电话|视频|录音|画外|广播|对讲|屏幕里|OS|V\.?O/;
const YEAR_RE = /([一二三四五六七八九十两百\d]+)\s*年(前|了|来|后)?/g;

export function parseScript(text) {
  const lines = String(text || '').replace(/\r\n/g, '\n').split('\n');
  const dialogue = [];
  let scene = { people: new Set() };
  lines.forEach((line, i) => {
    if (/^\d+-\d+\s/.test(line)) { scene = { people: new Set(), head: line }; return; }
    if (line.startsWith('人物：') || line.startsWith('人物:')) { for (const p of line.slice(3).split(/[、，,]/)) if (p.trim()) scene.people.add(p.trim()); return; }
    if (line.startsWith('【形象】')) { for (const kv of line.slice(4).split(/[；;]/)) { const k = kv.split(/[=＝]/)[0].trim(); if (k) scene.people.add(k); } return; }
    if (/^第[0-9一二三四五六七八九十百]+集/.test(line)) return;
    const m = line.match(SPEAKER_RE);
    if (!m) return;
    const who = m[1].trim();
    if (/^(人物|形象|画面|场景|环境)$/.test(who)) return;
    const said = m[2].replace(/^[（(][^）)]*[）)]/, '').trim();
    dialogue.push({ line: i + 1, who, text: said, raw: line, scene, offscreen: OFFSCREEN_RE.test(line) });
  });
  return { lines, dialogue };
}

// 原片逐集台词。认两种格式：全剧合集（有「六、逐集分析表」）和平台反推稿 replay script（## EP001 分节的同款表格）。
// 镜头数：按「、，/」切开后，含景别词（远景/全景/中景/近景/特写）的片段才算一个镜头；「中景，平视，固定」是一个镜头的三个属性
const shotCount = (camera) => Math.max(1, String(camera || '').split(/[、,，/；;]/).filter((x) => /远景|全景|中景|近景|特写|大全景/.test(x)).length);

export function sourceDialogueByEpisode(dossierText) {
  if (!String(dossierText || '').includes('## 六、逐集分析表')) return replayDialogueByEpisode(dossierText);
  const dossier = parseDossier(dossierText);
  const byEp = new Map();
  const shots = new Map();
  for (const row of dossier.rows) {
    const n = Number(row.episode.replace(/\D/g, ''));
    shots.set(n, (shots.get(n) || 0) + shotCount(row.cells[5]));
    const said = row.cells[1];
    if (isNone(said) || !/[一-龥]{2,}/.test(said)) continue;
    if (!byEp.has(n)) byEp.set(n, []);
    byEp.get(n).push(said);
  }
  const names = [];
  const table = dossier.head.split('## 二、')[1]?.split('\n## ')[0] || '';
  for (const line of table.split('\n')) {
    const cells = line.startsWith('|') ? line.split('|').map((s) => s.trim()) : [];
    if (cells.length > 3 && /^C\d+$/.test(cells[1])) names.push(cells[2]);
  }
  return { byEp, shots, characters: names.filter((n) => n.length >= 2) };
}

export function replayDialogueByEpisode(text) {
  const byEp = new Map();
  const shots = new Map();
  let n = 0;
  for (const line of String(text || '').replace(/\r\n/g, '\n').split('\n')) {
    const head = line.match(/^#{1,4}\s*EP\s*0*(\d{1,4})\b/i);
    if (head) { n = Number(head[1]); continue; }
    if (!n || !/^\|\s*\d{1,2}:\d{2}/.test(line)) continue;
    const cells = line.split('|').map((s) => s.trim());
    shots.set(n, (shots.get(n) || 0) + shotCount(cells[6]));
    const said = cells[2];
    if (isNone(said) || !/[一-龥]{2,}/.test(said)) continue;
    if (!byEp.has(n)) byEp.set(n, []);
    byEp.get(n).push(said);
  }
  if (!byEp.size) throw new Error('原片台词表读不出来：既不是全剧合集，也不是按 EP 分节的反推稿');
  return { byEp, shots, characters: [] };
}

// 群体角色漏登：△/画面里写了「刺客们/保镖们/记者们」，本场「人物：」行却没有这个群体（客户端按人物行建角色卡，
// 漏了就只会建出一个头领）。群体写法按客户端规则：「黑衣刺客数人」「记者若干」「保镖四名」。
export function groupCastGaps(text) {
  const out = [];
  let scene = null;
  String(text || '').replace(/\r\n/g, '\n').split('\n').forEach((line, i) => {
    const l = line.trim();
    if (/^\d+-\d+\s/.test(l)) { scene = { head: l, cast: '' }; return; }
    if (!scene) return;
    if (/^人物[:：]/.test(l)) { scene.cast = l.slice(3); return; }
    if (!/^[△▲（(]/.test(l)) return;
    const words = [
      ...[...l.matchAll(/([一-龥]{1,4}?)们/g)].map((m) => ({ word: m[0], base: m[1] })),
      // 「四五名黑衣保镖」「两名守卫」「几个黑衣人」：数量 + 群体
      ...[...l.matchAll(/(?:[二两三四五六七八九十几数多][一二两三四五六七八九十]*|\d+)(?:名|个|位)((?:[^，。；、\s]{0,12}?)(?:保镖|保安|守卫|刺客|打手|手下|记者|董事|工人|护士|医生|警察|宾客|谷民|村民|黑衣人|蒙面人|随从|侍卫|杀手))/g)].map((m) => ({ word: m[0], base: m[1] }))
    ];
    for (const w of words) {
      if (/[他她它你我]/.test(w.base)) continue;
      const base = w.base.replace(/^(黑衣|蒙面|几名|众|一众|全体|其他|其余|那些|这些|几个)/, '');
      if (!base || /^(人|孩子|老人|大家|大伙|姑娘|小伙子|兄弟|姐妹|朋友|同学|女人|男人|婴儿)$/.test(base) || base.length < 2 && !/[客卫镖者民工兵士员]/.test(base)) continue;
      const core = base.slice(-2);
      const hit = scene.cast.includes(base) || scene.cast.includes(core) || scene.cast.includes(base.slice(-1) + '们');
      if (!hit) out.push({ line: i + 1, scene: scene.head, word: w.word, base });
    }
  });
  const seen = new Set();
  return out.filter((x) => { const k = `${x.scene}|${x.base}`; if (seen.has(k)) return false; seen.add(k); return true; });
}

// 称呼对照：每个说话人在台词里用到的新名字/称谓（出现在哪些集）。同一人对同一对象叫法突然变了，人工看一眼。
const KIN_TERMS = ['爸爸', '妈妈', '爸', '妈', '爷爷', '奶奶', '外婆', '外公', '婆婆', '叔叔', '二叔', '叔', '阿姨', '伯父', '伯母',
  '哥', '姐姐', '姐', '妹妹', '弟弟', '老公', '老婆', '夫人', '少爷', '小姐', '先生', '太太', '董事长', '前辈', '师父', '丫头', '小姑娘', '老东西', '未婚夫', '未婚妻'];
export function addressTable(episodes, map) {
  const terms = [...new Set([...Object.values(map.renames), ...KIN_TERMS])].filter((t) => t.length >= 1).sort((a, b) => b.length - a.length);
  const table = new Map();
  for (const { n, text } of episodes) {
    for (const d of parseScript(text).dialogue) {
      let rest = d.text;
      for (const t of terms) {
        if (!rest.includes(t)) continue;
        rest = rest.split(t).join('□');
        if (!table.has(d.who)) table.set(d.who, new Map());
        const m = table.get(d.who);
        if (!m.has(t)) m.set(t, new Set());
        m.get(t).add(n);
      }
    }
  }
  const span = (s) => { const a = [...s].sort((x, y) => x - y); return a.length === 1 ? `${a[0]}` : `${a[0]}–${a[a.length - 1]}(${a.length}集)`; };
  return [...table].sort((a, b) => b[1].size - a[1].size)
    .map(([who, m]) => `${who}：${[...m].sort((a, b) => Math.min(...a[1]) - Math.min(...b[1])).map(([t, s]) => `${t} ${span(s)}`).join('；')}`);
}

// 台词策略（洗稿映射.json 的 dialogue 字段）：
//   keep（默认）——保留原台词：原句只按对照表换名/换设定词，爆款台词原样留住；没保留的每一句都要放回或写明理由。
//   rewrite ——用户明确要求降重/去重、或出海翻译时才用：台词整句换说法，查照抄。
export const KEEP_MATCH = 0.85;
// episodes: [{ n, text }]；返回 { errors, warnings, info, stats }
export function washCheck({ episodes, dossierText, map }) {
  const keepMode = (map.dialogue || 'keep') !== 'rewrite';
  const missing = [];
  let retained = 0;
  const { byEp, shots, characters } = sourceDialogueByEpisode(dossierText);
  const errors = [], warnings = [], info = [];
  const renames = map.renames;
  const sourceNames = Object.keys(renames).filter((k) => k.length >= 2 || /[一-龥]/.test(k));
  // 能被对照表（含「X家」这类短规则）换掉的正式名就算有新名
  // 功能称呼（刺客首领/仓库主管/查账随从/山道鸵鸟）不是专名，不要求换名
  const isRole = (c) => GENERIC_ROLE_RE.test(c) || DESCRIPTOR_ALIAS_RE.test(c) || /(首领|头目|主管|管理员|随从|工人|下属|律师|医生|老者|老人|男子|女子|青年|鸵鸟|黄鸭|大鹅|实验体)/.test(c);
  const kept = new Set(map.keep || []);
  const unmapped = characters.filter((c) => !applyRenames(c, renames).count && !isRole(c) && !kept.has(c));
  const creatures = new Set(map.creatures), insiders = new Set([...map.insiders, ...map.creatures]);
  const years = new Map();
  let totalLines = 0, copied = 0, srcTotal = 0, nearCopied = 0;
  const perEpisode = [];
  const tag = (n, line) => `第${String(n).padStart(3, '0')}集:${line}`;
  for (const { n, text } of episodes) {
    const { lines, dialogue } = parseScript(text);
    const src = (byEp.get(n) || []).map((s) => applyRenames(s, renames).text);
    srcTotal += src.length; totalLines += dialogue.length;
    const actions = lines.filter((l) => /^\s*(△|（画面)/.test(l)).length;
    const shotN = shots?.get(n) || 0;
    perEpisode.push({ n, lines: dialogue.length, source: src.length, actions, shots: shotN });
    // 动作密度：原片镜头栏列了几个镜头，剧本至少要有九成动作行（一个镜头一拍；打斗、快切、走位不能一句带过）
    if (shotN && actions < Math.ceil(shotN * 0.9)) warnings.push(`第${String(n).padStart(3, '0')}集 动作行 ${actions} 行，原片镜头 ${shotN} 个——按分析表「镜头」栏一个镜头至少写一行 △，打斗拆成出手/命中/反应，过渡走位写出来`);
    // 1 旧名残留（映射表里的源名 + 分析稿人物表里没映射的正式名）
    lines.forEach((l, i) => {
      for (const s of sourceNames) if (l.includes(s) && !Object.values(renames).some((t) => t.includes(s) && l.includes(t))) errors.push(`${tag(n, i + 1)} 残留源名「${s}」→ 应为「${renames[s]}」`);
      for (const c of unmapped) if (l.includes(c)) errors.push(`${tag(n, i + 1)} 残留源剧人物名「${c}」（洗稿映射.json 里没给它新名）`);
    });
    // 2a 保留原台词（keep）：原句按映射换名后，洗稿里要找得到
    if (keepMode) {
      for (const s of src) {
        let best = 0, at = null;
        for (const d of dialogue) { const r = similarity(d.text, s); if (r > best) { best = r; at = d; } }
        // 原句还在、只是分行不同，也算保留——否则会和格式门互相打架：格式门嫌一句台词超过 40 字要拆成两句，
        // 拆了这里又说「原台词没保留」；改回一整句格式门又报超长，Agent 在两个检查之间来回改、永远交不了。
        // ① 一句原台词被拆成同一个人连着说的两三句（中间可以隔动作行）；② 原片被字幕切开的两句并成了一句。
        if (best < KEEP_MATCH) {
          const want = bare(s);
          if (want.length >= 4 && dialogue.some((d) => bare(d.text).includes(want))) best = 1;
          for (let i = 0; i < dialogue.length && best < KEEP_MATCH; i += 1) {
            let joined = dialogue[i].text;
            for (let j = i + 1; j < Math.min(dialogue.length, i + 4) && dialogue[j].who === dialogue[i].who; j += 1) {
              joined += dialogue[j].text;
              // 原片字幕的断句和剧本的断句不在同一处（原句是「…九重震拳！我居然在一瞬间」，剧本断成「…九重震拳！」「我居然在一瞬间…」）：
              // 这几句连起来包含原句，就是原话还在
              const r = want.length >= 4 && bare(joined).includes(want) ? 1 : similarity(joined, s);
              if (r > best) { best = r; at = dialogue[i]; }
            }
          }
        }
        if (best >= KEEP_MATCH) retained++;
        else missing.push({ n, source: s, best, now: at ? at.text : '', line: at ? at.line : 0 });
      }
    }
    // 2b 照抄（rewrite：先把源句按映射换名再比，换了名字不算改写）
    if (!keepMode) for (const d of dialogue) {
      if (bare(d.text).length < MIN_COPY_CHARS) continue;
      let best = 0, bs = '';
      for (const s of src) { const r = similarity(d.text, s); if (r > best) { best = r; bs = s; } }
      if (best >= COPY_ERROR) { copied++; errors.push(`${tag(n, d.line)} 台词和原片几乎一样(${best.toFixed(2)})：「${d.text.slice(0, 28)}」≈原「${bs.slice(0, 28)}」——换说法，功能不变`); }
      else if (best >= COPY_WARN) nearCopied++, warnings.push(`${tag(n, d.line)} 台词和原片偏像(${best.toFixed(2)})：「${d.text.slice(0, 28)}」≈原「${bs.slice(0, 28)}」`);
    }
    // 2c 群体角色漏登（刺客们/四五名保镖 没进本场人物行，客户端只会建出一个头领）
    for (const g of groupCastGaps(text)) warnings.push(`${tag(n, g.line)} 「${g.word.slice(0, 20)}」没进本场「人物：」行——群体按「黑衣刺客数人」「记者若干」「保镖四名」写进人物行和【形象】`);
    // 3 台词量
    if (src.length && Math.abs(dialogue.length - src.length) >= 3 && Math.abs(dialogue.length - src.length) / src.length > 0.4) {
      warnings.push(`第${String(n).padStart(3, '0')}集 台词 ${dialogue.length} 句，原片 ${src.length} 句——核对是不是加戏/删戏过多`);
    }
    // 4 说话人在场 / 5 非人角色被外人接话
    let lastCreature = null, lastScene = null;
    for (const d of dialogue) {
      if (d.scene !== lastScene) { lastCreature = null; lastScene = d.scene; }
      if (!d.offscreen && d.scene.people.size && !d.scene.people.has(d.who)) warnings.push(`${tag(n, d.line)} ${d.who} 说话但不在本场「人物：」/【形象】里`);
      if (creatures.size) {
        if (lastCreature && !insiders.has(d.who)) warnings.push(`${tag(n, d.line)} ${lastCreature}刚说完话，${d.who} 就接话——按设定外人听不懂非人角色，确认不是在回应它的台词`);
        lastCreature = creatures.has(d.who) ? d.who : (insiders.has(d.who) ? null : lastCreature);
      }
      for (const y of d.text.matchAll(YEAR_RE)) {
        const k = y[0].replace(/\s/g, '');
        if (!years.has(k)) years.set(k, new Set());
        years.get(k).add(n);
      }
    }
  }
  if (unmapped.length) warnings.push(`分析稿人物表里这些人没在 洗稿映射.json 里给新名：${unmapped.join('、')}`);
  for (const [k, eps] of [...years].sort()) info.push(`${k}：第 ${[...eps].sort((a, b) => a - b).join('、')} 集`);
  if (keepMode) for (const m of missing) warnings.push(`第${String(m.n).padStart(3, '0')}集${m.line ? ':' + m.line : ''} 原台词没保留(${m.best.toFixed(2)})：应为「${m.source.slice(0, 40)}」${m.now ? `，现在是「${m.now.slice(0, 30)}」` : ''}`);
  return { errors, warnings, info, missing, stats: { mode: keepMode ? 'keep' : 'rewrite', episodes: episodes.length, lines: totalLines, sourceLines: srcTotal, retained, retainRate: srcTotal ? retained / srcTotal : 0, copied, nearCopied, copyRate: totalLines ? copied / totalLines : 0, perEpisode } };
}
