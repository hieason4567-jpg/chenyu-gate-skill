#!/usr/bin/env node
// 辰屿剧本格式门（免费版）—— 纯本地确定性剧本质量校验。
// 零鉴权、零联网、零依赖，Node 18+。只解决一件事：剧本写成能直接进
// 转分镜/出片流水线的辰屿标准格式（对白之间有动作、无连发、无心理活动）。
//
// v1.1.0 2026-09-25  同步 Pro：形象变体校验（每场【形象】、跨集延续、变体名核对、variants 汇总）+ 制片级格式
//                    放行（人物行/（画面：）块/环境描述行/台词情绪括注）+ 占位话/时间码/重复△检测。
// v1.0.0 2026-08-31  首发：gate --file/--dir。校验逻辑与辰屿 Pro 完整版 gate 同源。
const VERSION = '1.1.0';

import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const cmd = args[0] || 'help';
const arg = (name, fallback = '') => {
  const i = args.indexOf('--' + name);
  return i >= 0 && args[i + 1] !== undefined ? args[i + 1] : fallback;
};
const die = (msg) => { console.error('✗ ' + msg); process.exit(1); };

// ---------- 校验规则（与辰屿 Pro 完整版 gate 同源；含形象变体与制片级格式）----------
const GATE_MENTAL_RE = /心想|心中[想道]|心里[想暗默]|暗想|暗自[想道]|内心[想os]|回忆起|想起了|感到|觉得/;
// 万能填充句（v2.3.2）：Agent 为凑 1:1 配比批量插的空洞△，不描述任何具体可拍动作。
const GATE_FILLER_RE = /话题继续推进|接住话头|抬眼回应|短暂停顿，另一方|对话继续|继续交谈|继续对话|气氛继续|场面继续|按画面同步|同步保留|原视频动作|原视频画面|参考原视频|见原视频|动作同上|同上动作|按原片|保留原动作/;
// △ 开头的时间码（[00:28-00:31] / 00:28-00:31）：剧本不写时间码；查重复前也要先剥掉，否则同一句占位话带不同时间码会逃过查重。
const GATE_TIMECODE_RE = /^\s*[\[【(（]?\s*\d{1,2}:\d{2}(?::\d{2})?\s*[-~–—至到]\s*\d{1,2}:\d{2}(?::\d{2})?\s*[\]】)）]?\s*/;
// 非△行的整片时间轴/源视频残留（v2.3.6）：`时长：X秒（按源视频）`、`【场景｜场景033】`流水号、行内 mm:ss-mm:ss——
// 这些是视频反推分析稿的中间态，不该出现在剧本。单SHOT时长"（时长3秒）"不含冒号时间，不误伤；场次头 1-1 也不匹配。
const GATE_TIMELEAK_RE = /\d{1,2}[:：]\d{2}\s*[-~–—至到]\s*\d{1,2}[:：]\d{2}|按源视频|场景\d{2,}/;
const isSceneHead = (l) => /^\d+-\d+\s+\S/.test(l);
const isEpTitle = (l) => /^第\d+集/.test(l);
const isActionLine = (l) => l.startsWith('△') || l.startsWith('▲');
const isMetaLine = (l) => /^【(画面|运镜|音效|字幕|转场|特效)】/.test(l);
// 场次人物行：`人物：苏燃、周母`。列出本场出场人物，不是台词。
const isCharacterListLine = (l) => /^人物\s*[:：]/.test(l);
// 画面/镜头描述块：`（画面：…）`、`（镜头：…）`、`（环境：…）`、`（转场：…）`。整行括号，给下游/读者的画面提示，不是台词。
const isPictureLine = (l) => /^[（(]\s*(画面|镜头|环境|转场|字幕|旁白)\s*[:：]/.test(l);
const matchDialogue = (l) => {
  if (isActionLine(l) || isMetaLine(l) || isSceneHead(l) || isEpTitle(l) || isCharacterListLine(l) || isPictureLine(l)) return null;
  const m = l.match(/^([^\s：:△▲【\d][^：:]{0,9})(（[^）]*）|\([^)]*\))?[：:](.+)$/);
  return m ? { speaker: m[1].trim(), note: (m[2] || '').trim(), body: m[3].trim() } : null;
};

// ---------- 形象变体（v2.6.0）----------
// 每场开头一行「【形象】角色=变体名；角色=变体名」，场内换装在换装△后再写一行；形象跟上一场不同时括号注明原因：
//   【形象】苏燃=外出便装（回房换上外套）
// 变体名必须具体（下游客户端建卡用 [角色-变体名] 标签，拒收"主形象/日常/默认"这类泛称）。
// 规则来自出片事故：瞬时状态（淋湿/衣服被扯乱）不是变体；围裙/首饰/眼镜这类叠加小件记道具不建变体；
// 同一场同一人只有一个形象，除非有可见的换装△。
const isVariantLine = (l) => /^【形象】/.test(l);
const VARIANT_PLACEHOLDER_RE = /^(?:基础形象|基本形象|默认形象|主形象|默认|主状态|基础|日常|日常装|日常服|常服|常态|常规|初始|初始形象|原样|同上|不变|default|base|basic)$/iu;
const VOICE_ONLY_NOTE_RE = /画外音|电话|OS|旁白|VO|广播|心声|内心/i;
// 场内换形象要有可见的换装/受伤类动作，且△里写到这个人
const VARIANT_CHANGE_ACTION_RE = /换|穿|脱|披|套上|系上|解开|解下|扯下|摘下|戴上|包扎|缠上|剪|剃|染|卸妆|化妆|淋湿|溅|受伤|流血|撕破|撕开|更衣|裹上/;
function parseVariantLine(l) {
  const entries = [], problems = [];
  const body = l.replace(/^【形象】\s*/, '').trim();
  if (!body) { problems.push('【形象】后面是空的'); return { entries, problems }; }
  // 多人之间用 ；分隔，也容忍 ，、——只在后面紧跟「名字=」时才当分隔符，原因括号里的逗号不受影响
  for (const raw of body.split(/[；;，,、](?=[^=＝:：（(；;，,、）)]{1,12}[=＝:：])/).map((x) => x.trim()).filter(Boolean)) {
    const m = raw.match(/^([^=＝:：（(]+?)\s*[=＝:：]\s*([^（(]+?)\s*(?:[（(]([^）)]*)[）)])?$/);
    if (!m) { problems.push(`「${raw}」写法不对，应为「角色=变体名」或「角色=变体名（变化原因）」，多人用；分隔`); continue; }
    const [, name, variant, cause] = m.map((x) => (x || '').trim());
    if (VARIANT_PLACEHOLDER_RE.test(variant)) problems.push(`「${name}=${variant}」变体名太笼统——写具体外观（如 居家睡衣/黑色厨师服/额头包扎），下游建卡拒收"主形象/日常/默认"`);
    else if (/[-－—\[\]【】]/.test(variant)) problems.push(`「${name}=${variant}」变体名里不要有 - 或括号（下游标签是 [角色-变体名]）`);
    else if (variant.length > 10) problems.push(`「${name}=${variant}」变体名超过10字——变体名要短，外观细节写进形象变体表`);
    entries.push({ name, variant, cause });
  }
  const seen = new Map();
  for (const e of entries) {
    if (seen.has(e.name) && seen.get(e.name) !== e.variant) problems.push(`同一行里「${e.name}」写了两个形象（${seen.get(e.name)} / ${e.variant}）——同一时刻一人只有一个形象`);
    seen.set(e.name, e.variant);
  }
  return { entries, problems };
}
// 形象变体表（Agent 交付的资产表之一）：markdown 表格，第一列=角色。
// 变体名列按表头「变体名」定位（合集/variants 命令的表是 角色|变体数|变体名|…，变体名在第3列；
// 手写表可能是 角色|变体名|…，在第2列）。找不到表头就默认第2列，并跳过纯数字（变体数列）。
function parseVariantTable(text) {
  const table = new Map();
  let variantCol = 1;
  for (const line of String(text || '').split(/\r?\n/)) {
    const cells = line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((x) => x.trim());
    if (cells.length < 2) continue;
    if (/^角色/.test(cells[0])) {
      const idx = cells.findIndex((c) => /变体名|形象名/.test(c) || c === '变体' || c === '形象');
      if (idx > 0) variantCol = idx;
      continue;
    }
    if (!cells[0] || /^[-:\s]+$/.test(cells[0])) continue;
    const variant = cells[variantCol] || cells[1];
    if (!variant || /^\d+$/.test(variant)) continue; // 跳过纯数字（变体数列）
    if (!table.has(cells[0])) table.set(cells[0], new Set());
    table.get(cells[0]).add(variant);
  }
  return table;
}
// 逐场检查形象标记；ctx 跨集延续（gate --dir 按集号顺序共用一个 ctx）。只在剧本用了【形象】时启用，旧剧本不受影响。
function checkVariants(rawLines, ctx, errors, warnings) {
  const used = rawLines.some((l) => isVariantLine(l.trim()));
  if (!used && !ctx.required) return 0;
  let scene = null;
  let marks = 0;
  const closeScene = () => {
    if (!scene) return;
    if (scene.speakers.size && !scene.hasMark) warnings.push(`场景「${scene.head}」（第${scene.line}行）没有【形象】行——出场人物要标当前形象`);
    else {
      const missing = [...scene.speakers].filter((n) => !scene.declared.has(n) && !ctx.aliases?.has(n));
      if (missing.length) warnings.push(`场景「${scene.head}」（第${scene.line}行）${missing.join('、')} 说了话但【形象】里没标——补上当前形象`);
    }
  };
  for (let i = 0; i < rawLines.length; i++) {
    const l = rawLines[i].trim();
    const ln = i + 1;
    if (!l) continue;
    if (isSceneHead(l)) {
      closeScene();
      scene = { head: l, line: ln, hasMark: false, declared: new Map(), speakers: new Set(), actionsSinceMark: [] };
      continue;
    }
    if (!scene) scene = { head: '（第一场之前）', line: ln, hasMark: false, declared: new Map(), speakers: new Set(), actionsSinceMark: [] };
    if (isActionLine(l)) { scene.actionsSinceMark.push(l); continue; }
    if (isVariantLine(l)) {
      marks++;
      const { entries, problems } = parseVariantLine(l);
      for (const pb of problems) errors.push(`第${ln}行 ${pb}`);
      const midScene = scene.hasMark;
      for (const e of entries) {
        const before = scene.declared.get(e.name) || ctx.last.get(e.name)?.variant;
        if (before && before !== e.variant) {
          if (midScene && scene.declared.has(e.name) && !scene.actionsSinceMark.some((a) => a.includes(e.name) && VARIANT_CHANGE_ACTION_RE.test(a))) {
            warnings.push(`第${ln}行 「${e.name}」同一场里从「${before}」变成「${e.variant}」，但前面没有换装的△——先写可见的换装动作`);
          }
          if (!e.cause) warnings.push(`第${ln}行 「${e.name}」形象从「${before}」变成「${e.variant}」没注明原因——写成「${e.name}=${e.variant}（换装/受伤/时间跳跃等原因）」；如果其实没变，沿用「${before}」`);
        }
        if (ctx.table && !(ctx.table.get(e.name)?.has(e.variant))) {
          warnings.push(`第${ln}行 「${e.name}=${e.variant}」不在形象变体表里——变体名要和表里一字不差（防止同一形象多个叫法），或把新变体补进表`);
        }
        scene.declared.set(e.name, e.variant);
        ctx.last.set(e.name, { variant: e.variant });
        ctx.usage.push({ episode: ctx.episode, scene: scene.head.split(/\s+/)[0], name: e.name, variant: e.variant, cause: e.cause, changed: Boolean(before && before !== e.variant) });
      }
      scene.hasMark = true;
      scene.actionsSinceMark = [];
      continue;
    }
    const d = matchDialogue(l);
    if (d && !VOICE_ONLY_NOTE_RE.test(`${d.speaker}${d.note}`)) scene.speakers.add(d.speaker.replace(/[（(][^）)]*[）)]/g, '').trim());
  }
  closeScene();
  return marks;
}

// 校验一份正文，返回 { errors: [], warnings: [], stats: {} }。行号从 1 开始。
function gateOneScript(text, ctx = newVariantContext()) {
  const rawLines = String(text).split(/\r?\n/);
  const errors = [], warnings = [];
  let dlgCount = 0, actCount = 0, silentBurstStart = -1;
  let run = [];                 // 当前连续台词行 [{ line, speaker }]
  const flushRun = () => {
    if (run.length >= 3) {
      const from = run[0].line, to = run[run.length - 1].line;
      const speakers = [...new Set(run.map(r => r.speaker))];
      // 补写位置：连发段中间（第 2 句台词之后）
      const insertAfter = run[1].line;
      errors.push(`第${from}-${to}行 对白连发段（连续${run.length}句台词无△动作行，说话人:${speakers.join('/')}）→ 在第${insertAfter}行后插入一行△（听者可见反应 或 说话人伴随动作）`);
    }
    run = [];
  };
  let narrativeCount = 0;   // 既非台词/△/元信息/场次头的叙述行（小说识别用）
  let inSceneIntro = false;  // 是否处在"场次头之后、首个△/台词之前"（环境描述行允许区）
  const actionSeen = new Map(); // △正文 → 出现行号（重复△检测）
  for (let i = 0; i < rawLines.length; i++) {
    const l = rawLines[i].trim();
    const ln = i + 1;
    if (!l) continue;
    if (!isActionLine(l) && GATE_TIMELEAK_RE.test(l)) errors.push(`第${ln}行 残留整片时间轴/源视频标记（${(l.match(GATE_TIMELEAK_RE) || [''])[0]}）→ 删掉"按源视频"整片时长/"场景0XX"流水号/绝对时间轴；场景写真实地名，要时长只留单SHOT（时长3秒）`);
    if (isActionLine(l)) {
      flushRun();
      inSceneIntro = false;
      actCount++;
      const body = l.slice(1).trim();
      if (GATE_MENTAL_RE.test(body)) errors.push(`第${ln}行 △写了心理活动（${(body.match(GATE_MENTAL_RE) || [''])[0]}）→ △只写可见的外部动作与神态，把心理翻译成身体反应`);
      if (GATE_TIMECODE_RE.test(body)) errors.push(`第${ln}行 △里写了时间码（${(body.match(GATE_TIMECODE_RE) || [''])[0].trim()}）→ 剧本不写时间码，删掉，直接写可见动作`);
      if (GATE_FILLER_RE.test(body)) errors.push(`第${ln}行 △是万能填充句/占位话（${(body.match(GATE_FILLER_RE) || [''])[0]}）→ 写该时刻具体谁做了什么可见动作（分析表 visible_action 那一列就是素材），不要用空话占位`);
      const key = body.replace(GATE_TIMECODE_RE, '').replace(/[。．.！!？?，,；;\s]+$/u, '');
      if (!actionSeen.has(key)) actionSeen.set(key, []);
      actionSeen.get(key).push(ln);
      if (body.length < 6) warnings.push(`第${ln}行 △太短（${body.length}字）——动作要具体可拍`);
      if (body.length > 60) warnings.push(`第${ln}行 △太长（${body.length}字）——一行一件事，拆开`);
      continue;
    }
    // 人物行、画面/镜头描述块：合法结构行，放行不计叙述。
    if (isCharacterListLine(l) || isPictureLine(l)) { flushRun(); continue; }
    if (isMetaLine(l) || isVariantLine(l) || isSceneHead(l) || isEpTitle(l)) { flushRun(); if (isSceneHead(l)) inSceneIntro = true; continue; }
    const d = matchDialogue(l);
    if (d) {
      dlgCount++;
      inSceneIntro = false;
      run.push({ line: ln, speaker: d.speaker });
      if (d.body.length > 40) warnings.push(`第${ln}行 台词超长（${d.body.length}字）——超过40字的台词转分镜会被硬拆，建议按句号拆成两句`);
      continue;
    }
    flushRun(); // 其他叙述行也算隔断
    // 场次头之后、第一个△动作/台词之前的纯文字行 = 环境/画面描述，合法（不计叙述、不触发"这是小说"）。
    if (inSceneIntro) continue;
    narrativeCount++;
  }
  flushRun();
  // 小说/散文识别：绝大部分是叙述行、几乎没有剧本结构 → 这是源材料不是剧本，
  // 逐条打补丁方向就错了，应整体改编成剧本格式后再过门。
  const structured = dlgCount + actCount;
  if (narrativeCount >= 30 && structured < narrativeCount * 0.25 && !rawLines.some(l => isSceneHead(l.trim()))) {
    return {
      errors: [`这份文本是小说/散文源材料（叙述行${narrativeCount}行，剧本结构行仅${structured}行），不是剧本——不要按下面的行号打补丁，请先把它改编成剧本格式（场次头 + △动作行 + 「角色名：台词」），改编稿再过门`],
      warnings: [],
      stats: { dialogue: dlgCount, action: actCount }
    };
  }
  // 重复△：把视频分析表同一行的 visible_action 复制到每句台词前凑配比，成片动作全是同一句。
  for (const [key, lines] of actionSeen) {
    if (lines.length < 2) continue;
    const msg = `第${lines.join('/')}行 △重复同一句（${key.slice(0, 24)}${key.length > 24 ? '…' : ''}）→ 每处△要写该时刻不同的具体动作/反应；分析表里一句概括只能用一次，拆成不同动作节拍`;
    if (key.length >= 10 || lines.length >= 3) errors.push(msg);
    else warnings.push(msg);
  }
  if (dlgCount === 0) errors.push('没有解析到任何台词行——检查格式：台词行应为「角色名：台词」');
  if (dlgCount > 0 && actCount === 0) errors.push('全篇没有一行△动作行——每句台词前后应有可见动作/反应（目标配比约1:1）');
  else if (dlgCount > 0 && dlgCount / Math.max(actCount, 1) > 2) warnings.push(`对白:动作 = ${dlgCount}:${actCount}（超过2:1）——目标约1:1，多补△（听者反应/说话人动作）`);
  const hasScene = rawLines.some(l => isSceneHead(l.trim()));
  if (!hasScene) warnings.push('没有场次头（如「1-1 面馆后厨 白天 室内」）——建议每场开头标场景/时间/内外');
  const variantMarks = checkVariants(rawLines, ctx, errors, warnings);
  return { errors, warnings, stats: { dialogue: dlgCount, action: actCount, variantMarks } };
}

function newVariantContext(table = null) {
  return { last: new Map(), usage: [], table, episode: 0, required: false };
}
const episodeNoOfFile = (name) => Number((String(name).match(/第\s*0*(\d+)\s*集/) || String(name).match(/EP\s*0*(\d+)/i) || [])[1] || 0);
// 目录里的剧本按集号排序（跨集形象延续要按顺序查）；形象变体表 / 汇总文件本身不当剧本查。
function listScriptFiles(d) {
  return fs.readdirSync(d)
    .filter((name) => /\.(txt|md)$/i.test(name) && !/形象变体|资产表/.test(name))
    .map((name) => path.join(d, name))
    .sort((a, b) => (episodeNoOfFile(path.basename(a)) - episodeNoOfFile(path.basename(b))) || a.localeCompare(b));
}
function loadVariantTable(dir) {
  const explicit = arg('variants', '');
  const candidates = explicit ? [path.resolve(explicit)] : (dir ? fs.readdirSync(dir).filter((n) => /形象变体表/.test(n) && !/汇总/.test(n)).map((n) => path.join(dir, n)) : []);
  for (const file of candidates) {
    if (!fs.existsSync(file)) die('形象变体表不存在: ' + file);
    const table = parseVariantTable(fs.readFileSync(file, 'utf8'));
    if (table.size) return { table, file };
  }
  return { table: null, file: '' };
}
// 从正文【形象】标记汇总「每个角色几个变体、分别出现在哪几集哪几场、因何而变」。
function summarizeVariantUsage(usage) {
  const byRole = new Map();
  for (const u of usage) {
    if (!byRole.has(u.name)) byRole.set(u.name, new Map());
    const variants = byRole.get(u.name);
    if (!variants.has(u.variant)) variants.set(u.variant, { places: [], episodes: new Set(), causes: [] });
    const v = variants.get(u.variant);
    const place = u.episode ? `${u.episode}集${u.scene ? ' ' + u.scene : ''}` : u.scene;
    if (!v.places.includes(place)) v.places.push(place);
    if (u.episode) v.episodes.add(u.episode);
    if (u.changed && u.cause && !v.causes.includes(u.cause)) v.causes.push(u.cause);
  }
  const lines = ['# 形象变体表（按正文【形象】标记自动汇总）', '', '| 角色 | 变体数 | 变体名 | 出现集 | 出现场次 | 变化原因 |', '| --- | --- | --- | --- | --- | --- |'];
  for (const [name, variants] of byRole) {
    for (const [variant, v] of variants) {
      const eps = [...v.episodes].sort((a, b) => a - b);
      const ranges = [];
      for (const e of eps) {
        const last = ranges[ranges.length - 1];
        if (last && e === last[1] + 1) last[1] = e; else ranges.push([e, e]);
      }
      const epText = ranges.map(([a, b]) => (a === b ? `${a}` : `${a}-${b}`)).join('、') || '-';
      lines.push(`| ${name} | ${variants.size} | ${variant} | ${epText} | ${v.places.join('、')} | ${v.causes.join('；') || '-'} |`);
    }
  }
  return { byRole, markdown: lines.join('\n') + '\n' };
}

// gate 命令：--file 单文件 / --dir 目录批量(.txt/.md)。跑门前仅做鉴权（不扣积分）。
// 输出 GATE_PASS / GATE_FAIL(exit 1)。--no-auth 供离线自查（Agent 正式交付前仍须 auth）。
// variants 命令：从正文【形象】标记汇总形象变体表（每个角色几个变体、出现在哪几集哪几场、因何而变），零积分、纯本地。
function cmdVariants() {
  const dir = arg('dir', '') || die('用法: chenyu-pro variants --dir <剧本目录> [--out 形象变体汇总.md]');
  const d = path.resolve(dir);
  if (!fs.existsSync(d)) die('目录不存在: ' + d);
  const files = listScriptFiles(d);
  if (!files.length) die('目录里没有 .txt/.md 剧本文件');
  const ctx = newVariantContext();
  for (const f of files) {
    ctx.episode = episodeNoOfFile(path.basename(f));
    checkVariants(String(fs.readFileSync(f, 'utf8')).split(/\r?\n/), ctx, [], []);
  }
  if (!ctx.usage.length) die('正文里没有【形象】标记——先按写作规范每场标出场人物形象');
  const { byRole, markdown } = summarizeVariantUsage(ctx.usage);
  const out = path.resolve(arg('out', path.join(d, '形象变体汇总.md')));
  fs.writeFileSync(out, markdown, 'utf8');
  for (const [name, variants] of byRole) console.log(`  ${name}：${variants.size} 个形象（${[...variants.keys()].join(' / ')}）`);
  console.log(`✓ 已汇总 ${byRole.size} 个角色的形象变体 -> ${out}`);
}

function cmdGate() {
  const file = arg('file', '');
  const dir = arg('dir', '');
  const targets = [];
  if (file) targets.push(path.resolve(file));
  else if (dir) {
    const d = path.resolve(dir);
    if (!fs.existsSync(d)) die('目录不存在: ' + d);
    targets.push(...listScriptFiles(d));
    if (!targets.length) die('目录里没有 .txt/.md 剧本文件');
  } else die('用法: chenyu-gate --file 剧本.txt  或  chenyu-gate --dir <目录>');
  const { table, file: tableFile } = loadVariantTable(dir ? path.resolve(dir) : '');
  if (tableFile) console.log(`（按形象变体表核对变体名：${path.basename(tableFile)}）`);
  const ctx = newVariantContext(table);
  let totalErr = 0, totalWarn = 0;
  for (const t of targets) {
    if (!fs.existsSync(t)) die('文件不存在: ' + t);
    ctx.episode = episodeNoOfFile(path.basename(t));
    const { errors, warnings, stats } = gateOneScript(fs.readFileSync(t, 'utf8'), ctx);
    const name = path.basename(t);
    console.log(`── ${name}  台词${stats.dialogue}句 / 动作${stats.action}行${stats.variantMarks ? ` / 形象标记${stats.variantMarks}行` : ''}`);
    for (const e of errors) console.log('  ✗ ' + e);
    for (const w of warnings) console.log('  ⚠ ' + w);
    if (!errors.length && !warnings.length) console.log('  ✓ 无问题');
    totalErr += errors.length; totalWarn += warnings.length;
  }
  if (totalErr > 0) { console.log(`GATE_FAIL 硬伤${totalErr}处 警告${totalWarn}处 —— 按上面逐条修改后重跑 gate`); process.exit(1); }
  console.log(`GATE_PASS${totalWarn ? ' （警告' + totalWarn + '处，建议顺手改）' : ''}`);
}

function cmdHelp() {
  console.log(`辰屿剧本格式门 v${VERSION}（免费版，纯本地，零鉴权零联网）

  chenyu-gate --file 剧本.txt        校验单个剧本
  chenyu-gate --dir <目录>           批量校验目录下全部 .txt/.md

  校验内容：
    硬伤（挡门）：对白连发段(连续>=3句台词无△) / △写心理活动 / 无台词行 / 无动作行
    警告（放行）：台词>40字 / △过短过长 / 对白:动作>2:1 / 缺场次头
    另：自动识别小说/散文源材料并提示先改编

  改到 GATE_PASS，剧本即达辰屿出片标准格式。
  需要入库归档 / 同步辰屿客户端出片 → 安装完整版：chenyu-pro`);
}

const commands = { gate: cmdGate, variants: cmdVariants, version: () => console.log(`chenyu-gate v${VERSION}`), '--version': () => console.log(`chenyu-gate v${VERSION}`), '-v': () => console.log(`chenyu-gate v${VERSION}`), help: cmdHelp };
// 无子命令但带 --file/--dir 时直接当 gate 用: chenyu-gate --file x.txt
if (cmd.startsWith('--') && (arg('file') || arg('dir'))) { args.unshift('gate'); cmdGate(); }
else (commands[cmd] || cmdHelp)();
