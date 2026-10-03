// 成片工程改写（remake）：直接改客户端已经分好镜的工程（script.json，或客户端导出的 .xlsx），不重新分镜。
// 典型用途：爆款换皮——女频改男频、角色改名、资产改名。镜头数、每镜时长、字段结构都不动，只改文字。
// 分工：本模块只做确定性的事（精确改名、按行打补丁、结构校验、清掉旧成片）；改写措辞、换性别后的造型和音色由 Agent 想。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export const REMAKE_MAP_FILE = '改写映射.json';
export const REMAKE_SOURCE_FILE = '工程_原始.json';
export const REMAKE_RENAMED_FILE = '工程_改名.json';
export const REMAKE_UNIT_DIR = '改写';
export const REMAKE_CHAR_FILE = '角色.json';

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8').replace(/^﻿/, ''));
const sha = (text) => crypto.createHash('sha1').update(String(text)).digest('hex').slice(0, 10);
const genderOf = (value) => {
  const v = String(value || '').trim().toLowerCase();
  if (/^(男|male|man|m)$/.test(v) || v.startsWith('男')) return '男';
  if (/^(女|female|woman|f)$/.test(v) || v.startsWith('女')) return '女';
  return '';
};
const baseOf = (c) => String(c.baseCharacterName || String(c.name || '').replace(/^\[|\]$/g, '').split('-')[0]).trim();

// ---------- 读入 ----------
/** 客户端工程：script.json 直接读；.xlsx 用客户端自己的导入代码（excel_import.mjs，打包自 excelService.ts）转成同样的工程对象 */
export async function loadProject(src) {
  const ext = path.extname(src).toLowerCase();
  if (ext === '.xlsx') {
    const { excelToProject } = await import('./excel_import.mjs');
    const project = await excelToProject(fs.readFileSync(src), path.basename(src));
    return { project, from: 'xlsx' };
  }
  const project = readJson(src);
  if (!project || !Array.isArray(project.data) || !Array.isArray(project.novelChapters)) throw new Error('不是客户端工程 JSON（缺 data / novelChapters 数组）');
  return { project, from: 'json' };
}

/** 输入是哪一类，决定走哪条路（边界见 SKILL.md「输入类型与边界」） */
export function detectInput(file) {
  const ext = path.extname(file).toLowerCase();
  if (ext === '.xlsx') return { kind: 'project-xlsx', label: '客户端工程 Excel（已分镜）', route: 'remake-prepare --src <xlsx>' };
  if (ext === '.json') {
    try {
      const j = readJson(file);
      if (Array.isArray(j?.data) && Array.isArray(j?.novelChapters)) return { kind: 'project-json', label: '客户端工程 JSON（已分镜）', route: 'remake-prepare --src <json>' };
      if (j?.schema === 'chenyu.look-table/v1') return { kind: 'look-table', label: '形象表（随剧本上传客户端）', route: '不是改写对象' };
    } catch { /* 不是 JSON */ }
    return { kind: 'unknown', label: '未知 JSON', route: '' };
  }
  if (fs.statSync(file).isDirectory()) return { kind: 'dir', label: '目录', route: '' };
  const text = fs.readFileSync(file, 'utf8');
  const episodes = (text.match(/^\s*(?:#+\s*)?第\s*[0-9一二三四五六七八九十百]+\s*集/gm) || []).length;
  const sceneHeads = (text.match(/^\s*(?:\d+\s*[-–—]\s*\d+\s|分镜\d+｜)/gm) || []).length;
  if (episodes >= 1 && sceneHeads >= 1) return { kind: 'script', label: `分集剧本（${episodes} 集）`, route: '洗稿：wash-check / rename / gate / deliver-check' };
  return { kind: 'novel', label: '小说/原文', route: '改编：Agent 写剧本 → gate → deliver-check' };
}

// ---------- 盘点与映射 ----------
const CN_NUM = { 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9, 十: 10 };
const cnToInt = (s) => {
  if (/^\d+$/.test(s)) return Number(s);
  if (s === '十') return 10;
  const m = s.match(/^([一二三四五六七八九])?十([一二三四五六七八九])?$/);
  if (m) return (m[1] ? CN_NUM[m[1]] : 1) * 10 + (m[2] ? CN_NUM[m[2]] : 0);
  return CN_NUM[s] || 0;
};
/** 每个任务属于第几集：优先「第N集」标签（Excel 导入只有每集第一个任务带标签，往后沿用），没有再看 episodeIndex */
export function taskEpisodes(tasks) {
  let current = 0;
  return (tasks || []).map((t) => {
    const m = String(t.episodeLabel || '').match(/第\s*([0-9一二三四五六七八九十]+)\s*集/);
    if (m) current = cnToInt(m[1]) || current;
    else if (Number.isFinite(Number(t.episodeIndex)) && t.episodeIndex !== '' && t.episodeIndex != null) current = Number(t.episodeIndex) + 1;
    return current || 1;
  });
}
export function inventory(project) {
  const chars = new Map();
  for (const c of project.characters || []) {
    const base = baseOf(c);
    if (!base) continue;
    if (!chars.has(base)) chars.set(base, { base, gender: '', looks: [] });
    const e = chars.get(base);
    e.gender ||= genderOf(c.gender || c.initialSettings?.gender);
    e.looks.push(String(c.name));
  }
  const tagCount = new Map();
  for (const t of project.data || []) for (const m of String(t.script || '').matchAll(/\[([^\]\n]{1,40})\]/g)) tagCount.set(m[1], (tagCount.get(m[1]) || 0) + 1);
  const shotsOf = (base) => [...tagCount].filter(([tag]) => tag.split('-')[0] === base).reduce((s, [, n]) => s + n, 0);
  return {
    title: project.title || '',
    characters: [...chars.values()].map((c) => ({ ...c, mentions: shotsOf(c.base) })).sort((a, b) => b.mentions - a.mentions),
    // Excel 导入的工程场景和道具在同一个 props 列表里（subtype 区分）
    scenes: [...(project.scenes || []), ...(project.props || []).filter((p) => p.subtype === 'scene')].map((s) => String(s.name)),
    props: (project.props || []).filter((p) => p.subtype !== 'scene').map((p) => String(p.name)),
    tasks: (project.data || []).length,
    episodes: new Set(taskEpisodes(project.data)).size,
  };
}

export function mapTemplate(inv, existing = null) {
  const old = new Map((existing?.characters || []).map((c) => [c.base, c]));
  return {
    说明: '只填 newBase / newGender（不改名留空、不换性别照抄 gender）；terms 写额外的精确替换（称呼、姓氏组合、片名里的词），按原词整词替换；改写方向写 direction 给自己看。',
    direction: existing?.direction || '',
    title: { old: inv.title, new: existing?.title?.new || '' },
    characters: inv.characters.map((c) => ({ base: c.base, gender: c.gender, looks: c.looks, mentions: c.mentions,
      newBase: old.get(c.base)?.newBase || '', newGender: old.get(c.base)?.newGender || c.gender })),
    terms: existing?.terms || [{ from: '', to: '' }],
    // 改写中途才发现的漏网词写这里（remake-apply 最后整工程替换），不要改 terms——改 terms 要重跑 remake-units，已写的补丁会对不上
    lateTerms: existing?.lateTerms || [],
    // 形象重做范围：all = 全部形象重新设计（洗稿避免和原片撞脸撞色，默认）；swapped = 只重做换性别的
    redesignLooks: existing?.redesignLooks || 'all',
  };
}

export function checkMap(map) {
  const issues = [];
  const seen = new Map();
  for (const c of map.characters || []) {
    if (c.newGender && !genderOf(c.newGender)) issues.push(`「${c.base}」newGender 只能写 男 / 女`);
    const nb = String(c.newBase || '').trim();
    if (!nb) continue;
    if (nb.length < 2) issues.push(`「${c.base}」新名字太短：${nb}`);
    if (seen.has(nb)) issues.push(`新名字「${nb}」同时给了「${seen.get(nb)}」和「${c.base}」`);
    seen.set(nb, c.base);
  }
  const olds = new Set((map.characters || []).map((c) => c.base));
  for (const c of map.characters || []) if (c.newBase && olds.has(c.newBase) && c.newBase !== c.base) issues.push(`新名字「${c.newBase}」和另一个旧角色重名，会串`);
  for (const t of map.terms || []) if (t.from && !String(t.to ?? '').length && t.to !== '') issues.push(`terms「${t.from}」没写 to`);
  return issues;
}

export const swappedBases = (map) => new Set((map.characters || []).filter((c) => genderOf(c.newGender) && genderOf(c.newGender) !== genderOf(c.gender)).map((c) => c.base));

// ---------- 精确改名 ----------
const PATHLIKE_RE = /^(?:data:|https?:|local-asset:|blob:|file:)|\.(?:png|jpe?g|webp|gif|mp4|mov|mp3|wav|m4a)(?:[?#]|$)/i;
export function buildRenamer(map) {
  const pairs = [];
  if (map.title?.new && map.title.old) pairs.push([map.title.old, map.title.new]);
  for (const c of map.characters || []) if (c.newBase && c.newBase !== c.base) pairs.push([c.base, c.newBase]);
  // to 和 from 相同的是「保护词」：靠长词优先挡住误换（如「照顾家里」→「照顾家里」，防止「顾家→程家」把它换成「照程家里」）
  for (const t of map.terms || []) if (t.from && t.to !== undefined) pairs.push([t.from, String(t.to)]);
  pairs.sort((a, b) => b[0].length - a[0].length);
  if (!pairs.length) return { rename: (s) => s, pairs };
  const dict = new Map(pairs);
  const re = new RegExp(pairs.map(([from]) => from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'g');
  // 一次正则同时替换（长词优先），不会出现 A→B 再 B→C 的连锁
  const rename = (s) => (typeof s === 'string' && !PATHLIKE_RE.test(s) ? s.replace(re, (m) => dict.get(m)) : s);
  return { rename, pairs };
}

/** 整个工程的字符串值和对象键都过一遍精确替换（文件路径/图片地址不动） */
export function renameDeep(value, rename) {
  if (typeof value === 'string') return rename(value);
  if (Array.isArray(value)) return value.map((v) => renameDeep(v, rename));
  if (value && typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[rename(k)] = renameDeep(v, rename);
    return out;
  }
  return value;
}

// ---------- 改写单元（按行打补丁） ----------
const TEXT_FIELDS = ['adaptationScript', 'currentAdaptationResult', 'summary', 'characterBackground'];
/** 需要 Agent 看的文字：每个任务的分镜脚本、剧本各章、改编稿、总结；同样内容只出一个单元，补丁回写到所有位置 */
export function collectUnits(project) {
  const units = new Map();
  const add = (text, where, meta) => {
    if (typeof text !== 'string' || !text.trim()) return;
    const id = (meta.kind === 'task' ? 't' : 'x') + sha(text);
    if (!units.has(id)) units.set(id, { id, text, where: [], ...meta });
    units.get(id).where.push(where);
  };
  const eps = taskEpisodes(project.data);
  (project.data || []).forEach((t, i) => add(t.script, ['data', i, 'script'], { kind: 'task', episode: eps[i], label: t.episodeLabel || `第${eps[i]}集`, task: i }));
  for (const [key, dc] of Object.entries(project.durationContainers || {})) {
    const dcEps = taskEpisodes(dc?.data);
    (dc?.data || []).forEach((t, i) => add(t.script, ['durationContainers', key, 'data', i, 'script'], { kind: 'task', episode: dcEps[i], label: t.episodeLabel || `第${dcEps[i]}集`, task: i }));
  }
  (project.novelChapters || []).forEach((c, i) => {
    add(c.content, ['novelChapters', i, 'content'], { kind: 'text', label: `剧本 ${c.title || i + 1}` });
    add(c.title, ['novelChapters', i, 'title'], { kind: 'text', label: `剧本标题 ${i + 1}` });
  });
  for (const k of TEXT_FIELDS) add(project[k], [k], { kind: 'text', label: k });
  return [...units.values()];
}

const getAt = (obj, p) => p.reduce((o, k) => (o == null ? o : o[k]), obj);
const setAt = (obj, p, v) => { const last = p[p.length - 1]; const parent = getAt(obj, p.slice(0, -1)); if (parent != null) parent[last] = v; };

/** 写给 Agent 的单元文件：分镜按集一份，带行号；剧本/改编稿/总结一份。needs = 写到了换性别的角色 */
export function writeUnitFiles(dir, units, swappedNames) {
  fs.mkdirSync(dir, { recursive: true });
  const needs = (text) => swappedNames.some((n) => text.includes(n));
  const groups = new Map();
  for (const u of units) {
    const key = u.kind === 'task' ? `第${String(u.episode).padStart(2, '0')}集` : '剧本与文字';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(u);
  }
  const index = [];
  for (const [key, list] of [...groups].sort((a, b) => a[0].localeCompare(b[0], 'zh'))) {
    const body = list.map((u) => {
      if (isDerivedUnit(u)) return `=== ${u.id}  ${u.label}  【由各章自动重拼，不用改】\n`;
      const lines = u.text.split('\n');
      return [`=== ${u.id}  ${u.label}${u.kind === 'task' ? ` 任务${u.task + 1}` : ''}  ${needs(u.text) ? '【涉及换性别角色】' : ''}`,
        ...lines.map((l, i) => `${i + 1}| ${l}`), ''].join('\n');
    }).join('\n');
    fs.writeFileSync(path.join(dir, `${key}.txt`), body, 'utf8');
    const patchFile = path.join(dir, `${key}.patch.json`);
    if (!fs.existsSync(patchFile)) fs.writeFileSync(patchFile, '{}\n', 'utf8');
    index.push({ file: `${key}.txt`, patch: `${key}.patch.json`, units: list.length, needs: list.filter((u) => needs(u.text)).length });
  }
  return index;
}

// 分镜脚本里不许改的行（结构）：镜头头、时长；字段行改写时字段名必须保持
const LOCKED_LINE_RE = /^(###\s*SHOT\b|time\s*:)/i;
const FIELD_RE = /^([A-Za-z][A-Za-z ]{0,20}|[一-鿿]{1,6})\s*[:：]/;

/** 审稿修订补丁（文件名以「审核」开头）最后生效：同一行以审稿结果为准 */
export function readPatches(dir) {
  const patches = {};
  const files = fs.readdirSync(dir).filter((n) => n.endsWith('.patch.json'))
    .sort((a, b) => (a.startsWith('审核') - b.startsWith('审核')) || a.localeCompare(b, 'zh'));
  for (const f of files) {
    const j = readJson(path.join(dir, f));
    for (const [id, lines] of Object.entries(j || {})) patches[id] = { ...(patches[id] || {}), ...lines };
  }
  return patches;
}

/** 按行打补丁；结构有问题的补丁行不落（列进 issues 交给 Agent 改） */
export function applyUnitPatches(project, units, patches) {
  const issues = [];
  let changedLines = 0, changedUnits = 0;
  const byId = new Map(units.map((u) => [u.id, u]));
  for (const [id, lines] of Object.entries(patches)) {
    const u = byId.get(id);
    if (!u) { issues.push(`补丁里的单元 ${id} 不存在（单元文件重生成过？）`); continue; }
    const src = u.text.split('\n');
    let touched = false;
    for (const [no, text] of Object.entries(lines || {})) {
      const i = Number(no) - 1;
      if (!Number.isInteger(i) || i < 0 || i >= src.length) { issues.push(`${id} 第 ${no} 行不存在`); continue; }
      const next = String(text ?? '');
      if (next.includes('\n')) { issues.push(`${id} 第 ${no} 行：补丁不能含换行（一行对一行）`); continue; }
      if (u.kind === 'task' && LOCKED_LINE_RE.test(src[i].trim()) && next.trim() !== src[i].trim()) { issues.push(`${id} 第 ${no} 行是镜头头/时长，不能改`); continue; }
      const oldField = src[i].trim().match(FIELD_RE)?.[1];
      if (u.kind === 'task' && oldField && next.trim().match(FIELD_RE)?.[1] !== oldField) { issues.push(`${id} 第 ${no} 行字段名「${oldField}:」不能改`); continue; }
      if (src[i] !== next) { src[i] = next; changedLines++; touched = true; }
    }
    if (touched) {
      changedUnits++;
      const text = src.join('\n');
      for (const where of u.where) setAt(project, where, text);
    }
  }
  return { issues, changedLines, changedUnits };
}

/**
 * 场景形象表改登记（改写映射.json 的 sceneMapEdits：[{episodeNo, sceneTag, from, to}]）：
 * 审稿按剧本判定某集某场人物该穿另一个已有形象时（如换上执行马甲），分镜改标签的同时改这里，客户端才不判「场景形象不符」
 */
export function applySceneMapEdits(project, edits) {
  let n = 0;
  const appKeyOf = new Map((project.characters || []).map((c) => [String(c.name), c.appearanceKey]));
  for (const row of project.assetBible?.sceneAppearanceMap || []) {
    for (const ed of edits || []) {
      if (ed.sceneTag !== row.sceneTag || (ed.episodeNo != null && Number(ed.episodeNo) !== Number(row.episodeNo))) continue;
      for (const c of row.characters || []) if (c.characterTag === ed.from) { c.characterTag = ed.to; if (appKeyOf.get(ed.to)) c.appearanceKey = appKeyOf.get(ed.to); n++; }
    }
  }
  return n;
}

/** 改编稿（adaptationScript / currentAdaptationResult）原本就是各章拼起来的：章节改完后按同样格式重拼，不用单独改一遍 */
export const joinChapters = (chapters) => (chapters || []).map((c) => `## ${c.title}\n${c.content}`).join('\n\n');
export function rebuildAdaptationFromChapters(original, project) {
  const before = joinChapters(original.novelChapters);
  let n = 0;
  for (const k of ['adaptationScript', 'currentAdaptationResult']) {
    if (typeof original[k] === 'string' && original[k] === before) { project[k] = joinChapters(project.novelChapters); n++; }
  }
  return n;
}
const isDerivedUnit = (u) => u.kind === 'text' && u.where.every((w) => w[0] === 'adaptationScript' || w[0] === 'currentAdaptationResult');

// ---------- 换性别形象的重设计 ----------
const SECTION_LABELS = ['性别', '年龄段', '外观特征', '脸部', '身材', '发型', '服饰类型', '发色', '主色调', '部件配色', '视觉锚点'];
const sectionOf = (text, label) => {
  const re = new RegExp(`${label}\\s*[:：]([^]*?)(?=(?:${SECTION_LABELS.join('|')})\\s*[:：]|$)`);
  return (String(text || '').match(re)?.[1] || '').replace(/[。；;\s]+$/u, '').trim();
};

export function charTemplate(project, map, existing = []) {
  const swapped = swappedBases(map);
  const newBaseOf = new Map((map.characters || []).map((c) => [c.base, c.newBase || c.base]));
  const newGenderOf = new Map((map.characters || []).map((c) => [c.base, genderOf(c.newGender) || genderOf(c.gender)]));
  const prev = new Map((existing || []).map((e) => [e.tag, e]));
  const all = (map.redesignLooks || 'all') === 'all';
  const rows = [];
  for (const c of project.characters || []) {
    const base = baseOf(c);
    if (!all && !swapped.has(base)) continue;
    // 标签按完整的改名规则换（含 terms，如「赫尔曼→维森」），和改名后的工程一致
    const tag = buildRenamer(map).rename(String(c.name));
    rows.push({
      tag, oldTag: String(c.name), base: newBaseOf.get(base), swapped: swapped.has(base), newGender: newGenderOf.get(base) || genderOf(c.gender) || '', species: c.species || c.initialSettings?.species || '', state: c.state || '',
      old: { gender: c.gender, age: c.age, styleDescription: c.initialSettings?.description || '', appearanceFeatures: c.appearanceFeatures || '', shortDescription: c.shortDescription || '', voice: c.voice || c.initialSettings?.voice || '', voiceRefDescription: c.voiceRefDescription || '', doubaoVoiceId: c.doubaoVoiceId || '' },
      new: prev.get(tag)?.new || { styleDescription: '', appearanceFeatures: '', shortDescription: '', voice: '', voiceRefDescription: '', doubaoVoiceId: '', state: '' },
    });
  }
  // 补形象（add.cloneFrom）不在工程角色卡里，重新生成时原样保留
  for (const e of existing || []) if (e?.add?.cloneFrom && !rows.some((r) => r.tag === e.tag)) rows.push(e);
  return rows;
}

/**
 * 造型卡的 description 缺 脸部/身材/发型 时，用卡片自己的 face/body/hair 字段补到描述最前面（只拼接卡上已有的文字，不改写）。
 * 原因：客户端出图（buildNormalizedCharacterAssetPrompt）只读 description；只有「发色/主色调/部件配色」的描述
 * 出图时没有发型、脸型、身材，同性别角色会画成同一个默认发型和脸。旧版客户端造型和旧版 remake 都产出过这种卡。
 */
const IDENTITY_FIELDS = [['脸部', 'face'], ['身材', 'body'], ['发型', 'hair']];
const knownText = (v) => { const t = String(v || '').replace(/\s+/g, ' ').trim(); return t && !/^(未知|unknown|无|-)$/i.test(t) ? t : ''; };
export function ensureIdentityInDescriptions(project) {
  const fixed = [];
  for (const c of project.characters || []) {
    if (c.appearancePromptSource !== 'characterStylingAgent') continue;
    const d = String(c.description || '').trim();
    if (!d || /(脸部|身材|发型)\s*[:：]/.test(d)) continue;
    const head = IDENTITY_FIELDS.map(([label, key]) => (knownText(c[key]) ? `${label}：${knownText(c[key]).replace(/[。；;]+$/u, '')}` : '')).filter(Boolean);
    if (!head.length) continue;
    c.description = `${head.join('。')}。${d}`;
    fixed.push(c.name);
  }
  return fixed;
}

/** 把 Agent 写好的新造型落到角色卡（字段按客户端造型产出的格式拆），删旧参考图让客户端重出 */
export function applyCharacters(project, entries) {
  const issues = [];
  const voiceSwaps = [];
  const byTag = new Map((project.characters || []).map((c) => [String(c.name), c]));
  // 补形象：分镜里用到、角色卡里没有的形象（原片漏建卡），以同一人的已有形象为底复制一张新卡（同一主体，新的形象编号）
  for (const e of entries || []) {
    if (byTag.has(e.tag) || !e.add?.cloneFrom) continue;
    const src = byTag.get(e.add.cloneFrom);
    if (!src) { issues.push(`补形象 ${e.tag}：cloneFrom ${e.add.cloneFrom} 找不到`); continue; }
    const suffix = sha(e.tag);
    const state = String(e.tag).replace(/^\[|\]$/g, '').split('-').slice(1).join('-');
    const card = JSON.parse(JSON.stringify(src));
    Object.assign(card, { name: e.tag, state, isPrimaryState: false, stateId: `${src.stateId || 'state'}_${suffix}`,
      appearanceKey: `${src.appearanceKey || 'APP'}-${suffix}`, assetKey: `${src.assetKey || src.appearanceKey || 'APP'}-${suffix}` });
    // add.newRole：复制的是另一个人（如补一个男顾客），给新的人物编号和名字，不并进原人物
    if (e.add.newRole) {
      const base = String(e.tag).replace(/^\[|\]$/g, '').split('-')[0];
      Object.assign(card, { roleKey: `${src.roleKey || 'CHAR'}-${suffix}`, entityId: `${src.entityId || 'char_entity'}_${suffix}`, identityKey: base,
        baseCharacterName: base, parentCharacterName: `[${base}]`, isPrimaryState: true });
      if (card.initialSettings) Object.assign(card.initialSettings, { baseCharacterName: base, entityId: card.entityId, identityKey: base, parentCharacterName: `[${base}]`, isPrimaryState: true });
      (project.assetBible.roles ||= []).push({ roleKey: card.roleKey, name: base, identityKey: base, entityId: card.entityId, aliases: [e.tag], gender: e.newGender === '男' ? 'male' : 'female', source: 'remake' });
    }
    if (card.initialSettings) Object.assign(card.initialSettings, { name: e.tag, state, stateId: card.stateId, ...(e.add.newRole ? {} : { isPrimaryState: false }) });
    project.characters.push(card);
    byTag.set(e.tag, card);
    const srcAp = (project.assetBible?.appearances || []).find((a) => a.characterTag === e.add.cloneFrom);
    if (srcAp) project.assetBible.appearances.push({ ...JSON.parse(JSON.stringify(srcAp)), characterTag: e.tag, appearanceKey: card.appearanceKey, stateId: card.stateId, stateLabel: state, isPrimary: false });
    if (!e.add.newRole) for (const r of project.assetBible?.roles || []) if ((r.aliases || []).includes(e.add.cloneFrom) && !(r.aliases || []).includes(e.tag)) r.aliases.push(e.tag);
    // 场景形象表（客户端按它判「场景形象不符」）：
    //   add.sceneTags：这些场景里该人物也可能是新形象 → 追加登记
    //   add.replaceIn：[{episodeNo, sceneTag, from}] → 那一集那个场景里该人物就是新形象，把 from 形象换成新形象
    for (const row of project.assetBible?.sceneAppearanceMap || []) {
      const chars = row.characters || [];
      const rep = (e.add.replaceIn || []).find((r) => r.sceneTag === row.sceneTag && (r.episodeNo == null || Number(r.episodeNo) === Number(row.episodeNo)));
      if (rep) {
        const hit = chars.find((x) => x.characterTag === (rep.from || e.add.cloneFrom));
        if (hit) Object.assign(hit, { characterTag: e.tag, appearanceKey: card.appearanceKey });
        continue;
      }
      if (!(e.add.sceneTags || []).includes(row.sceneTag)) continue;
      const base = chars.find((x) => x.characterTag === e.add.cloneFrom);
      if (base && !chars.some((x) => x.characterTag === e.tag)) chars.push({ ...base, characterTag: e.tag, appearanceKey: card.appearanceKey });
    }
  }
  for (const e of entries || []) {
    const c = byTag.get(e.tag);
    if (!c) { issues.push(`角色 ${e.tag} 在改名后的工程里找不到`); continue; }
    const n = e.new || {};
    if (!String(n.styleDescription || '').trim()) { issues.push(`${e.tag} 还没写 styleDescription`); continue; }
    const g = e.newGender === '男' ? 'male' : e.newGender === '女' ? 'female' : '';
    const desc = String(n.styleDescription).trim();
    const fromColor = desc.indexOf('发色');
    // description 必须是整段（含 脸部/身材/发型）：客户端出图只读 description，不读 hair/face/body 字段，
    // 截掉身份段 = 出图没有发型和脸型，同性别角色全画成同一个默认发型和脸。全局角色定义那一行仍只放配色段。
    const colorPart = fromColor >= 0 ? desc.slice(fromColor) : desc;
    const fields = {
      gender: e.swapped ? e.newGender : (c.gender || e.newGender), age: sectionOf(desc, '年龄段') || c.age, hair: sectionOf(desc, '发型') || c.hair, face: sectionOf(desc, '脸部') || c.face,
      body: sectionOf(desc, '身材') || c.body, clothing: sectionOf(desc, '服饰类型') || c.clothing,
      description: desc,
      appearanceFeatures: n.appearanceFeatures || '', shortDescription: n.shortDescription || '',
      voice: n.voice || '', voiceRefDescription: n.voiceRefDescription || '', ttsProvider: 'Doubao',
      doubaoVoiceId: n.doubaoVoiceId || '', doubaoVoiceModel: n.doubaoVoiceModel || 'seed-tts-2.0', doubaoVoiceSpeed: n.doubaoVoiceSpeed ?? 1,
      ...(n.personality ? { personality: n.personality } : {}),
      ...(n.state ? { state: n.state } : {}),
    };
    if (fields.voiceRefDescription) voiceSwaps.push({ tag: e.tag, from: c.voiceRefDescription || '\u0000', to: fields.voiceRefDescription });
    Object.assign(c, fields);
    if (c.initialSettings) Object.assign(c.initialSettings, { gender: g || c.initialSettings.gender, age: fields.age, hair: fields.hair, face: fields.face, body: fields.body, clothing: fields.clothing, voice: fields.voice, description: desc, appearanceFeatures: fields.appearanceFeatures, referenceImage: '', ...(n.state ? { state: n.state } : {}) });
    if (g) for (const k of ['assetIndex', 'sourceAssetIndex']) if (c[k]) c[k] = { ...c[k], genderClass: g };
    // 旧造型的风格编号、撞脸台账、旧图都属于原性别，去掉；客户端按新描述重新出图
    for (const k of ['appearanceStyleId', 'appearanceCollisionKeys', 'appearanceStyleAuditScore', 'referenceImage', 'imageUrl']) delete c[k];
    for (const bag of ['referenceImages', 'characterImageVersionTags', 'characterActiveVersions']) if (project[bag]) delete project[bag][e.tag];
    const ap = (project.assetBible?.appearances || []).find((a) => a.characterTag === e.tag);
    if (ap) Object.assign(ap, { visibleDefinition: fields.appearanceFeatures || ap.visibleDefinition, ...(g ? { assetIndex: { ...(ap.assetIndex || {}), genderClass: g } } : {}), ...(n.state ? { stateLabel: n.state } : {}) });
    // 全局角色定义：这一行换成新造型的配色段
    if (typeof project.globalRefs === 'string') project.globalRefs = project.globalRefs.split('\n').map((l) => (l.startsWith(`${e.tag}:`) ? `${e.tag}: ${colorPart}` : l)).join('\n');
  }
  for (const r of project.assetBible?.roles || []) {
    const looks = (entries || []).filter((e) => e.swapped && (r.aliases || []).includes(e.tag));
    if (looks.length) r.gender = looks[0].newGender === '男' ? 'male' : 'female';
  }
  return { issues, voiceSwaps };
}

/**
 * 台词里旧的音色括注（青年女声清冷：…）换成新形象的 voiceRefDescription。
 * 只换「说话人标签是这个形象」后面的括注：别的角色可能和它共用同一句音色描述（如男配角和原男主都是「青年男声冷峻」），不能一起换。
 */
export function swapVoiceCues(project, units, voiceSwaps) {
  if (!voiceSwaps.length) return 0;
  const byTag = new Map();
  for (const s of voiceSwaps) { if (!byTag.has(s.tag)) byTag.set(s.tag, []); byTag.get(s.tag).push(s); }
  let n = 0;
  for (const u of units) {
    const now = getAt(project, u.where[0]);
    if (typeof now !== 'string') continue;
    // 每个 [标签] 管到下一个 [ 之前的文字；只在换性别形象自己的那段里换括注
    const next = now.split('\n').map((line) => line.replace(/(\[[^\]\n]+\])([^\[]*)/g, (seg, tag, rest) => {
      const swaps = byTag.get(tag);
      if (!swaps) return seg;
      let r = rest;
      for (const s of swaps) if (r.includes(s.from)) { r = r.split(s.from).join(s.to); n++; }
      // 台词括注常和角色卡原值不完全一样（「青年男中音，质地干冷…」）：说话人标签后、「说：」前的音色括注一律换成新音色
      const to = swaps[0].to;
      const head = r.split('说：')[0];
      const fixed = head.replace(/（([^（）]*(?:[男女]声|男中音|女中音|童声|嗓音)[^（）]*)）/u, (m, inner) => (inner === to ? m : (n++, `（${to}）`)));
      if (fixed !== head) r = fixed + r.slice(head.length);
      return tag + r;
    })).join('\n');
    if (next !== now) for (const w of u.where) setAt(project, w, next);
  }
  return n;
}

// ---------- 清掉旧成片（文字变了，旧视频/配音/分镜图都对不上） ----------
const GENERATED_KEYS = ['videoVersionManifest', 'sessionTasks', 'queueStatus', 'jimengSubmitRecords', 'shotComposites', 'storyboardImages', 'storyboardGrids', 'shotAudio',
  'activeVideoVersionIndices', 'activeCompositeIndices', 'storyboardActiveVersions', 'storyboardLastFrameActiveVersions', 'storyboardVideoActiveVersions', 'transitionVideoActiveVersions'];
export function clearGenerated(project) {
  const emptyOf = (v) => (Array.isArray(v) ? [] : v && typeof v === 'object' ? {} : undefined);
  for (const k of GENERATED_KEYS) if (k in project) project[k] = emptyOf(project[k]);
  // 封面是旧图（常是别人电脑上的路径）；模板选择的质检历史存的是旧文本快照，都不再对应新工程
  if ('thumbnail' in project) project.thumbnail = null;
  for (const ep of project.templateSelectionSummary?.episodes || []) delete ep.qaReport;
  const cleanTasks = (list) => (list || []).forEach((t) => { delete t.videoUrls; delete t.originalVideoUrls; });
  cleanTasks(project.data);
  for (const dc of Object.values(project.durationContainers || {})) {
    for (const k of GENERATED_KEYS) if (k in dc) dc[k] = emptyOf(dc[k]);
    cleanTasks(dc.data);
  }
}

/** 本机打不开的参考图（别人电脑上的相对路径）用同一工程导出的 .xlsx 里内嵌的图补上（按标签精确对应） */
export function fillImagesFrom(project, imageProject, storageRoot = '') {
  let filled = 0, missing = 0;
  for (const [tag, ref] of Object.entries(project.referenceImages || {})) {
    const url = String(ref?.url || '');
    const resolvable = /^(data:|https?:)/.test(url) || (storageRoot && url && fs.existsSync(path.join(storageRoot, url)));
    if (resolvable) continue;
    const alt = imageProject?.referenceImages?.[tag]?.url;
    if (alt && /^data:/.test(alt)) { project.referenceImages[tag] = { ...ref, url: alt, imageVersions: [alt] }; filled++; } else missing++;
  }
  return { filled, missing };
}

// ---------- 分镜标签体检（客户端同一套检查，storyboard_audit.mjs） ----------
const FIELD_LINE = { charactersInShot: '镜头角色', scene: 'scene', action: 'action', prompt: 'prompt', dialogue: 'dialogue', FirstFrame: 'FirstFrame', LastFrame: 'LastFrame', propsInShot: '道具' };
/** 在任务脚本里定位 SHOT n 的某个字段行（1 起），找不到字段就返回 SHOT 头行 */
export function locateShotLine(text, shotNo, field) {
  const lines = String(text || '').split('\n');
  const n = String(shotNo).replace(/^SHOT\s*/i, '').trim();
  const start = lines.findIndex((l) => new RegExp(`^###\\s*SHOT\\s*${n}\\s*$`, 'i').test(l.trim()));
  if (start < 0) return 0;
  let end = lines.findIndex((l, i) => i > start && /^###\s*SHOT\b/i.test(l.trim()));
  if (end < 0) end = lines.length;
  const key = FIELD_LINE[field] || field;
  for (let i = start + 1; i < end; i++) if (lines[i].trim().toLowerCase().startsWith(key.toLowerCase())) return i + 1;
  return start + 1;
}
/** 体检结果 → 单元 id + 行号；和原工程比，标出是原片就有还是改写新增 */
export async function storyboardFindings(project, original, units) {
  let sa;
  try { sa = await import('./storyboard_audit.mjs'); } catch { return null; } // 没装分镜体检模块：跳过（调用方提示）
  const norm = (r) => `${r.task}|${r.detail.replace(/\[[^\]]+\]/g, '[]')}`;
  const before = new Set(original ? sa.auditProjectStoryboard(original).map(norm) : []);
  const taskUnit = new Map();
  for (const u of units) if (u.kind === 'task') for (const w of u.where) if (w[0] === 'data') taskUnit.set(w[1], u);
  return sa.auditProjectStoryboard(project).map((r) => {
    const u = taskUnit.get(r.task);
    const field = (r.detail.match(/field (\w+)/) || [])[1] || (/character tag/.test(r.detail) ? 'charactersInShot' : '');
    const text = String(u?.where[0].reduce((o, k) => o?.[k], project) || '');
    // 客户端的镜头号本身带「SHOT」（问题文案是「SHOT SHOT 1 …」）
    const shot = (r.detail.match(/^SHOT\s+(?:SHOT\s+)?(\S+)/) || [])[1] || String(r.shot || '').replace(/^SHOT\s*/i, '');
    return { ...r, shot, unit: u?.id || '', episode: u?.episode || 0, line: locateShotLine(text, shot, field), preexisting: before.has(norm(r)) };
  });
}

// ---------- 校验 ----------
export function remakeChecks(original, project, map) {
  const issues = [], warnings = [];
  const shots = (s) => String(s || '').match(/^###\s*SHOT\b.*$/gm) || [];
  const times = (s) => String(s || '').match(/^time\s*:.*$/gm) || [];
  (original.data || []).forEach((t, i) => {
    const now = project.data?.[i]?.script;
    if (shots(t.script).length !== shots(now).length) issues.push(`任务 ${i + 1}：镜头数 ${shots(t.script).length} → ${shots(now).length}`);
    else if (times(t.script).join('|') !== times(now).join('|')) issues.push(`任务 ${i + 1}：镜头时长被改了`);
  });
  // 标签都要在新的资产目录里；原工程里本来就不在目录的（如系统提示音）只提示，改写新冒出来的才算问题
  const unknownTags = (proj) => {
    const catalog = new Set([...(proj.characters || []), ...(proj.props || []), ...(proj.scenes || [])].map((x) => String(x.name).replace(/^\[|\]$/g, '')));
    const unknown = new Map();
    for (const t of proj.data || []) for (const line of String(t.script || '').split('\n')) {
      if (!/^(镜头角色|scene|道具|dialogue)\s*[:：]/.test(line.trim())) continue;
      for (const m of line.matchAll(/\[([^\]\n]{1,40})\]/g)) if (!catalog.has(m[1])) unknown.set(m[1], (unknown.get(m[1]) || 0) + 1);
    }
    return unknown;
  };
  const before = new Set([...unknownTags(renameDeep(original, buildRenamer(map).rename)).keys()]);
  for (const [tag, n] of unknownTags(project)) (before.has(tag) ? warnings : issues).push(`标签 [${tag}] 不在资产目录里（${n} 处${before.has(tag) ? '，原工程就是这样' : ''}）`);
  // 旧名字残留（文件路径里的不算）
  const olds = (map.characters || []).filter((c) => c.newBase && c.newBase !== c.base).map((c) => c.base);
  const residue = new Map();
  const walk = (v, where) => {
    if (typeof v === 'string') { if (!PATHLIKE_RE.test(v)) for (const o of olds) if (v.includes(o)) residue.set(o, (residue.get(o) || 0) + 1); return; }
    if (Array.isArray(v)) return v.forEach((x) => walk(x, where));
    if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) { if (!/^(jimengSubmitRecords|templateSelectionSummary)$/.test(k)) walk(x, k); }
  };
  walk(project, '');
  for (const [o, n] of residue) issues.push(`旧名字「${o}」还剩 ${n} 处`);
  // 换性别角色：同一行里还挂着原性别的词（只提示，交 Agent 判断）
  const swapped = (map.characters || []).filter((c) => genderOf(c.newGender) && genderOf(c.newGender) !== genderOf(c.gender));
  // 音色括注必须跟着说话人：换性别的人说话时括注还是原性别 → 问题
  let cueWrong = 0;
  for (const t of project.data || []) for (const line of String(t.script || '').split('\n')) {
    for (const seg of line.matchAll(/\[([^\]\n]+)\]([^\[]*)/g)) {
      const c = swapped.find((x) => seg[1].startsWith(`${x.newBase || x.base}-`));
      if (!c) continue;
      const wrongCue = genderOf(c.newGender) === '男' ? /（[^（）]*女声/ : /（[^（）]*男声/;
      if (wrongCue.test(seg[2].split('说：')[0])) cueWrong++;
    }
  }
  if (cueWrong) issues.push(`换性别角色的台词里还有 ${cueWrong} 处原性别音色括注（角色.json 的 voiceRefDescription 没填，或括注和角色卡原值对不上）`);
  for (const c of swapped) {
    const name = c.newBase || c.base;
    const wrong = genderOf(c.newGender) === '男' ? /她|女士|女人|女性|姑娘|小姐|女声|夫人|太太|妻子|老婆|嫂子|长发|裙/ : /他(?!们)|先生|男人|男性|男声|丈夫|老公|小伙/;
    let hits = 0; const samples = [];
    for (const u of collectUnits(project)) for (const line of u.text.split('\n')) if (line.includes(name) && wrong.test(line)) { hits++; if (samples.length < 3) samples.push(`${u.id}: ${line.slice(0, 60)}`); }
    if (hits) warnings.push(`「${name}」改成${genderOf(c.newGender)}后，仍有 ${hits} 行同时出现原性别的词（可能是别人，逐条确认）：${samples.join(' ｜ ')}`);
  }
  return { issues, warnings };
}
