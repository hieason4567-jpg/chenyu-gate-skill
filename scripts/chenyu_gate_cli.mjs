#!/usr/bin/env node
// 辰屿剧本格式门（免费版）—— 纯本地确定性剧本质量校验。
// 零鉴权、零联网、零依赖，Node 18+。只解决一件事：剧本写成能直接进
// 转分镜/出片流水线的辰屿标准格式（对白之间有动作、无连发、无心理活动）。
//
// v1.0.0 2026-08-31  首发：gate --file/--dir。校验逻辑与辰屿 Pro 完整版 gate 同源。
const VERSION = '1.0.0';

import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const cmd = args[0] || 'help';
const arg = (name, fallback = '') => {
  const i = args.indexOf('--' + name);
  return i >= 0 && args[i + 1] !== undefined ? args[i + 1] : fallback;
};
const die = (msg) => { console.error('✗ ' + msg); process.exit(1); };

// ---------- 校验规则（与辰屿 Pro 完整版 gate 同源） ----------
const GATE_MENTAL_RE = /心想|心中[想道]|心里[想暗默]|暗想|暗自[想道]|内心[想os]|回忆起|想起了|感到|觉得/;
const isSceneHead = (l) => /^\d+-\d+\s+\S/.test(l);
const isEpTitle = (l) => /^第\d+集/.test(l);
const isActionLine = (l) => l.startsWith('△') || l.startsWith('▲');
const isMetaLine = (l) => /^【(画面|运镜|音效|字幕|转场|特效)】/.test(l);
const matchDialogue = (l) => {
  if (isActionLine(l) || isMetaLine(l) || isSceneHead(l) || isEpTitle(l)) return null;
  const m = l.match(/^([^\s：:△▲【\d][^：:]{0,9})(（[^）]*）|\([^)]*\))?[：:](.+)$/);
  return m ? { speaker: m[1].trim(), body: m[3].trim() } : null;
};

function gateOneScript(text) {
  const rawLines = String(text).split(/\r?\n/);
  const errors = [], warnings = [];
  let dlgCount = 0, actCount = 0;
  let run = [];
  const flushRun = () => {
    if (run.length >= 3) {
      const from = run[0].line, to = run[run.length - 1].line;
      const speakers = [...new Set(run.map(r => r.speaker))];
      const insertAfter = run[1].line;
      errors.push(`第${from}-${to}行 对白连发段（连续${run.length}句台词无△动作行，说话人:${speakers.join('/')}）→ 在第${insertAfter}行后插入一行△（听者可见反应 或 说话人伴随动作）`);
    }
    run = [];
  };
  let narrativeCount = 0;
  for (let i = 0; i < rawLines.length; i++) {
    const l = rawLines[i].trim();
    const ln = i + 1;
    if (!l) continue;
    if (isActionLine(l)) {
      flushRun();
      actCount++;
      const body = l.slice(1).trim();
      if (GATE_MENTAL_RE.test(body)) errors.push(`第${ln}行 △写了心理活动（${(body.match(GATE_MENTAL_RE) || [''])[0]}）→ △只写可见的外部动作与神态，把心理翻译成身体反应`);
      if (body.length < 6) warnings.push(`第${ln}行 △太短（${body.length}字）——动作要具体可拍`);
      if (body.length > 60) warnings.push(`第${ln}行 △太长（${body.length}字）——一行一件事，拆开`);
      continue;
    }
    if (isMetaLine(l) || isSceneHead(l) || isEpTitle(l)) { flushRun(); continue; }
    const d = matchDialogue(l);
    if (d) {
      dlgCount++;
      run.push({ line: ln, speaker: d.speaker });
      if (d.body.length > 40) warnings.push(`第${ln}行 台词超长（${d.body.length}字）——超过40字的台词转分镜会被硬拆，建议按句号拆成两句`);
      continue;
    }
    flushRun();
    narrativeCount++;
  }
  flushRun();
  const structured = dlgCount + actCount;
  if (narrativeCount >= 30 && structured < narrativeCount * 0.25 && !rawLines.some(l => isSceneHead(l.trim()))) {
    return {
      errors: [`这份文本是小说/散文源材料（叙述行${narrativeCount}行，剧本结构行仅${structured}行），不是剧本——不要按行号打补丁，请先把它改编成剧本格式（场次头 + △动作行 + 「角色名：台词」），改编稿再过门`],
      warnings: [],
      stats: { dialogue: dlgCount, action: actCount }
    };
  }
  if (dlgCount === 0) errors.push('没有解析到任何台词行——检查格式：台词行应为「角色名：台词」');
  if (dlgCount > 0 && actCount === 0) errors.push('全篇没有一行△动作行——每句台词前后应有可见动作/反应（目标配比约1:1）');
  else if (dlgCount > 0 && dlgCount / Math.max(actCount, 1) > 2) warnings.push(`对白:动作 = ${dlgCount}:${actCount}（超过2:1）——目标约1:1，多补△（听者反应/说话人动作）`);
  const hasScene = rawLines.some(l => isSceneHead(l.trim()));
  if (!hasScene) warnings.push('没有场次头（如「1-1 面馆后厨 白天 室内」）——建议每场开头标场景/时间/内外');
  return { errors, warnings, stats: { dialogue: dlgCount, action: actCount } };
}

function cmdGate() {
  const file = arg('file', '');
  const dir = arg('dir', '');
  const targets = [];
  if (file) targets.push(path.resolve(file));
  else if (dir) {
    const d = path.resolve(dir);
    if (!fs.existsSync(d)) die('目录不存在: ' + d);
    for (const name of fs.readdirSync(d)) if (/\.(txt|md)$/i.test(name)) targets.push(path.join(d, name));
    if (!targets.length) die('目录里没有 .txt/.md 剧本文件');
  } else die('用法: chenyu-gate --file 剧本.txt  或  chenyu-gate --dir <目录>');
  let totalErr = 0, totalWarn = 0;
  for (const t of targets) {
    if (!fs.existsSync(t)) die('文件不存在: ' + t);
    const { errors, warnings, stats } = gateOneScript(fs.readFileSync(t, 'utf8'));
    console.log(`── ${path.basename(t)}  台词${stats.dialogue}句 / 动作${stats.action}行`);
    for (const e of errors) console.log('  ✗ ' + e);
    for (const w of warnings) console.log('  ⚠ ' + w);
    if (!errors.length && !warnings.length) console.log('  ✓ 无问题');
    totalErr += errors.length; totalWarn += warnings.length;
  }
  if (totalErr > 0) { console.log(`GATE_FAIL 硬伤${totalErr}处 警告${totalWarn}处 —— 按上面逐条修改后重跑`); process.exit(1); }
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

const commands = { gate: cmdGate, version: () => console.log(`chenyu-gate v${VERSION}`), '--version': () => console.log(`chenyu-gate v${VERSION}`), '-v': () => console.log(`chenyu-gate v${VERSION}`), help: cmdHelp };
// 无子命令但带 --file/--dir 时直接当 gate 用: chenyu-gate --file x.txt
if (cmd.startsWith('--') && (arg('file') || arg('dir'))) { args.unshift('gate'); cmdGate(); }
else (commands[cmd] || cmdHelp)();
