// 原片时长标注（纯本地、零积分）：从视频分析稿读出每集原片时长和每场在原片里的起止，写进剧本，
// 让客户端转分镜按原片节奏分配镜头时长（不写时，客户端只能按通用 90-120 秒和单镜 2-2.5 秒估，1:1 还原会被压短三成）。
// 写法：集标题下一行 `【原片时长】116.9秒`；每场第一行【形象】下面一行 `【本场时长】约53秒`。已有标注会被替换，不会叠加。
import { parseDossier } from './asset_workbook.mjs';
import { applyRenames, similarity } from './wash_check.mjs';

const toSec = (t) => {
  const m = String(t || '').trim().match(/^(\d+):(\d+(?:\.\d+)?)$/);
  return m ? Number(m[1]) * 60 + Number(m[2]) : NaN;
};
const rowSpan = (time) => {
  const [a, b] = String(time || '').split('-');
  const from = toSec(a), to = toSec(b);
  return Number.isFinite(from) ? { from, to: Number.isFinite(to) ? to : from } : null;
};
const clean = (s) => String(s || '').replace(/[（(][^）)]*[）)]/g, '').replace(/[\s，。！？、…“”"'：:,.!?~—-]/g, '');
const isNone = (s) => /^(none|无|\[unclear\])?$/i.test(String(s || '').trim());

// 剧集索引表里的原片时长（秒）
export function episodeDurations(dossierText) {
  const out = new Map();
  for (const line of String(dossierText || '').split('\n')) {
    const m = line.match(/^\|\s*EP(\d+)\s*\|[^|]*\|\s*(\d+(?:\.\d+)?)\s*\|/);
    if (m) out.set(Number(m[1]), Number(m[2]));
  }
  return out;
}

// 分析表每集的台词行（带起止秒）
function dialogueRows(dossierText, renames = {}) {
  const byEp = new Map();
  for (const row of parseDossier(dossierText).rows) {
    const n = Number(row.episode.replace(/\D/g, ''));
    const span = rowSpan(row.cells[0]);
    if (!span) continue;
    if (!byEp.has(n)) byEp.set(n, { rows: [], end: 0 });
    const ep = byEp.get(n);
    ep.end = Math.max(ep.end, span.to);
    if (!isNone(row.cells[1])) ep.rows.push({ ...span, text: clean(applyRenames(row.cells[1], renames).text) });
  }
  return byEp;
}

const SCENE_HEAD = /^\d+\s*[-–—]\s*\d+\s/;
const DIALOGUE_LINE = /^([^△（【\s][^：:（]{0,14})(?:（[^）]*）)?[：:](.+)$/;

// 剧本每场的起点：按本场台词在原片台词行里找最像的那一句（只往后找，保持顺序）；没有台词的场夹在前后场之间平分。
export function annotateEpisode(text, { total = 0, rows = [] } = {}) {
  const original = String(text || '').replace(/\r\n/g, '\n').split('\n');
  const keptFrom = []; // 过滤后第 i 行 = 原文第 keptFrom[i] 行（0 起）
  const lines = original.filter((l, i) => { const keep = !/^【(原片时长|本场时长)】/.test(l.trim()); if (keep) keptFrom.push(i); return keep; });
  const scenes = [];
  lines.forEach((l, i) => { if (SCENE_HEAD.test(l.trim())) scenes.push({ at: i, dialogue: [] }); });
  if (!scenes.length || !(total > 0)) return { text: original.join('\n'), scenes: [], lineMap: null };
  scenes.forEach((s, k) => {
    const end = k + 1 < scenes.length ? scenes[k + 1].at : lines.length;
    s.head = 0; s.tail = 0;
    for (let i = s.at + 1; i < end; i += 1) {
      const l = lines[i].trim();
      const m = l.match(DIALOGUE_LINE);
      if (m && !/^(人物|场景|环境|画面)$/.test(m[1].trim())) { s.dialogue.push(clean(m[2])); s.tail = 0; continue; }
      if (/^(△|（画面)/.test(l)) { if (s.dialogue.length) s.tail += 1; else s.head += 1; }
    }
  });
  // 每场台词按顺序对到原片台词行（只往后找），得到本场第一句开口和最后一句说完的时间
  let cursor = 0;
  for (const s of scenes) {
    s.first = null; s.last = null;
    for (const d of s.dialogue) {
      if (!d) continue;
      let best = -1, bestScore = 0.55;
      for (let r = cursor; r < Math.min(rows.length, cursor + 12); r += 1) {
        const score = similarity(d, rows[r].text);
        if (score > bestScore) { best = r; bestScore = score; if (score > 0.95) break; }
      }
      if (best < 0) continue;
      if (s.first == null) s.first = rows[best].from;
      s.last = rows[best].to;
      cursor = best + 1;
    }
  }
  // 场与场的分界：上一场最后一句说完到下一场第一句开口之间的无台词段，按上一场收尾动作行数 : 下一场开场动作行数分
  scenes[0].start = 0;
  let prevLast = 0, prevTail = 0, pending = [];
  for (let k = 0; k < scenes.length; k += 1) {
    const s = scenes[k];
    if (k === 0) { if (s.last != null) { prevLast = s.last; prevTail = s.tail; } else prevTail = s.head; continue; }
    if (s.first == null) { pending.push(s); continue; }
    const gap = Math.max(0, s.first - prevLast);
    const weights = [prevTail, ...pending.map((p) => p.head + p.tail + 1), s.head];
    const sum = weights.reduce((a, b) => a + b, 0) || 1;
    let at = prevLast + gap * (weights[0] / sum);
    pending.forEach((p, i) => { p.start = at; at += gap * (weights[i + 1] / sum); });
    s.start = pending.length ? at : prevLast + gap * (prevTail / (prevTail + s.head || 1));
    if (!prevTail && !s.head && !pending.length) s.start = s.first;
    pending = [];
    prevLast = s.last; prevTail = s.tail;
  }
  // 结尾几场都没台词：在最后一句说完到片尾之间按动作行数分
  if (pending.length) {
    const gap = Math.max(0, total - prevLast);
    const weights = [prevTail, ...pending.map((p) => p.head + p.tail + 1)];
    const sum = weights.reduce((a, b) => a + b, 0) || 1;
    let at = prevLast + gap * (weights[0] / sum);
    pending.forEach((p, i) => { p.start = at; at += gap * (weights[i + 1] / sum); });
  }
  for (let k = 0; k < scenes.length; k += 1) {
    const end = k + 1 < scenes.length ? scenes[k + 1].start : total;
    scenes[k].seconds = Math.max(1, Math.round(end - scenes[k].start));
  }
  // 写回：集标题下一行原片时长；每场「人物：」行上面（没有人物行就在场次头下面）写本场时长
  const insertAfter = new Map();
  for (const s of scenes) {
    let at = s.at;
    const end = scenes[scenes.indexOf(s) + 1]?.at ?? lines.length;
    // 放在本场第一行【形象】之后（场次头 → 人物： → 【道具】 的相邻关系不动，客户端解析不受影响）；没有【形象】就放在人物/道具行之后
    const block = [];
    for (let i = s.at + 1; i < Math.min(end, s.at + 8); i += 1) block.push(i);
    const look = block.find((i) => lines[i].trim().startsWith('【形象】'));
    const castOrProps = block.filter((i) => /^(人物[:：]|【道具】)/.test(lines[i].trim()));
    at = look ?? (castOrProps.length ? castOrProps[castOrProps.length - 1] : s.at);
    insertAfter.set(at, `【本场时长】约${s.seconds}秒`);
  }
  const out = [];
  const lineMap = new Map(); // 原文行号 → 新行号（1 起），给审核结论里按行号登记的 waivers 用
  lines.forEach((l, i) => {
    out.push(l);
    lineMap.set(keptFrom[i] + 1, out.length);
    if (i === 0 && /^第\s*\d+\s*集/.test(l.trim())) out.push(`【原片时长】${Number(total.toFixed(1))}秒`);
    if (insertAfter.has(i)) out.push(insertAfter.get(i));
  });
  return { text: out.join('\n'), lineMap, scenes: scenes.map((s) => ({ head: lines[s.at].trim(), start: Math.round(s.start * 10) / 10, seconds: s.seconds })) };
}

// 审核结论里「第NNN集:行号」形式的 waivers 跟着插入的时长行挪行号（按内容定位的豁免不受影响）
export function shiftWaivers(review, results) {
  if (!review || !Array.isArray(review.waivers)) return 0;
  const maps = new Map(results.filter((r) => r.lineMap).map((r) => [r.n, r.lineMap]));
  let moved = 0;
  const shift = (where) => String(where || '').replace(/^第0*(\d+)集:(\d+)/, (m, n, line) => {
    const to = maps.get(Number(n))?.get(Number(line));
    if (!to || to === Number(line)) return m;
    moved += 1;
    return `第${String(n).padStart(3, '0')}集:${to}`;
  });
  review.waivers = review.waivers.map((w) => (typeof w === 'string' ? shift(w) : w && typeof w === 'object' && 'where' in w ? { ...w, where: shift(w.where) } : w));
  return moved;
}

export function annotateDurations(episodes, dossierText, renames = {}) {
  const totals = episodeDurations(dossierText);
  const rowsByEp = dialogueRows(dossierText, renames);
  return episodes.map(({ n, text }) => {
    const total = totals.get(n) || rowsByEp.get(n)?.end || 0;
    const res = annotateEpisode(text, { total, rows: rowsByEp.get(n)?.rows || [] });
    return { n, total, ...res };
  });
}
