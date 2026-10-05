// 文字输入的「分析」：把现成剧本或小说整理成和视频分析稿同一种格式（video_reverse_全剧合集.md 的逐集分析表），
// 这样资产合并（assets-prepare / assets-apply）、洗稿建议、写作、检查这条链路就和视频反推完全一样。
// 剧本有固定格式，程序直接转；小说没有格式，程序只负责分章和出任务书，逐章的提取由 Agent 读了填。
export const TEXT_UNITS_DIR = '文字提取';
export const HEADER = '| time | dialogue_or_audio | speaker | visible_action | scene | camera | lighting | color_tone | effects_ocr_subtitle | props | appearance | confidence |';
const DIVIDER = '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |';
const cell = (value) => String(value ?? '').replace(/\|/g, '｜').replace(/\s*\n\s*/g, ' ').trim() || 'none';
const clock = (seconds) => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
const episodeId = (n) => 'EP' + String(n).padStart(3, '0');
const isSceneHead = (line) => /^\d+-\d+\s+\S/.test(line);
const isDialogue = (line) => !/^(△|▲|【|（画面|人物：|第\s*\d+\s*集)/.test(line) && !isSceneHead(line) && /^[^：:]{1,30}[：:]/.test(line);

/** 这段文字像不像分集剧本（有场次头和动作行/台词行）。 */
export function looksLikeScript(text) {
  const lines = String(text || '').split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const heads = lines.filter(isSceneHead).length;
  const beats = lines.filter((l) => l.startsWith('△') || isDialogue(l)).length;
  return heads >= 1 && beats >= lines.length * 0.4;
}

/** 一集剧本 -> 镜头行。一句台词一行；台词前面的那句动作并进同一行，后面没有台词的动作单独成行。 */
export function scriptEpisodeRows(text) {
  const rows = [];
  let scene = '', looks = new Map(), props = '', pending = '', camera = '', firstOfScene = false, title = '';
  const flush = () => { if (pending) { push({ action: pending, camera }); pending = ''; camera = ''; } };
  const push = ({ dialogue = '', speaker = '', action = '', camera: cam = '' }) => {
    const who = [...looks.keys()].filter((name) => name === speaker || action.includes(name));
    rows.push({
      dialogue, speaker, action, scene, camera: cam,
      props: firstOfScene ? props : '',
      appearance: (firstOfScene ? [...looks.keys()] : who).map((name) => `${name}=${looks.get(name)}`).join('；'),
    });
    firstOfScene = false;
  };
  for (const raw of String(text || '').split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;
    if (/^第\s*\d+\s*集/.test(line) && !title) { title = line; continue; }
    if (isSceneHead(line)) { flush(); scene = line.split(/\s+/).slice(1).filter((t) => !/^(日|夜|晨|昏|黄昏|清晨|傍晚|白天|夜晚|深夜|凌晨|内|外|内外|内\/外)$/.test(t)).join(' ') || line.replace(/^\d+-\d+\s+/, ''); looks = new Map(); props = ''; firstOfScene = true; continue; }
    if (line.startsWith('【形象】')) { for (const part of line.slice(4).split(/[；;]/)) { const at = part.indexOf('='); if (at > 0) looks.set(part.slice(0, at).trim(), part.slice(at + 1).replace(/[（(].*$/, '').trim()); } continue; }
    if (line.startsWith('【道具】')) { props = line.slice(4).replace(/[（(][^）)]*[）)]/g, '').split(/[；;、]/).map((p) => p.trim()).filter(Boolean).join('、'); continue; }
    if (/^【/.test(line) || line.startsWith('人物：')) continue;
    if (line.startsWith('△') || line.startsWith('▲')) {
      flush();
      const m = line.slice(1).match(/^[（(]([^）)]{1,20})[）)](.*)$/);
      pending = (m ? m[2] : line.slice(1)).trim(); camera = m ? m[1] : '';
      continue;
    }
    if (isDialogue(line)) {
      const at = line.search(/[：:]/);
      const speaker = line.slice(0, at).replace(/[（(].*$/, '').trim();
      const said = line.slice(at + 1).replace(/^[（(][^）)]*[）)]/, '').trim();
      push({ dialogue: said, speaker, action: pending, camera });
      pending = ''; camera = '';
      continue;
    }
    // 场景环境行、（画面：…）块：算作一段画面描述
    flush(); pending = line.replace(/^[（(]画面[：:]/, '').replace(/[）)]$/, '');
  }
  flush();
  return { title, rows };
}

const renderRows = (rows, secondsPerRow = 3) => rows.map((r, i) => `| ${clock(i * secondsPerRow)}-${clock((i + 1) * secondsPerRow)} | ${cell(r.dialogue)} | ${cell(r.speaker)} | ${cell(r.action)} | ${cell(r.scene)} | ${cell(r.camera)} | none | none | none | ${cell(r.props)} | ${r.appearance ? cell(r.appearance) : ''} | 1 |`);

/** 多集镜头行 -> 合集（parseDossier 认的格式）。episodes: [{ n, file, title, rows }] */
export function buildDossier(episodes, { sourceKind = '剧本', title = '' } = {}) {
  const out = [
    `# 全剧文字分析合集 · ${episodes.length} 集${title ? ` · ${title}` : ''}`, '',
    `- 来源：${sourceKind}（不是视频分析；时间码是按顺序编的序号，不代表真实时长；没有画面信息，镜头列只在原文写了运镜时才有）。`,
    '- 人物、场景、道具是【未合并的原始清单】：同一个人、同一个地点、同一件东西在不同集可能有不同写法。',
    '- 动笔前必做：按剧情和对白把人物、场景、道具合并归类成资产合并表（同一角色全剧一个名字、同一地点一个场景、只留推动剧情的关键道具），再按表统一全稿。', '',
    '## 一、剧集索引', '', '| 集号 | 源文件 | 时长(秒) | 剧情摘要 |', '| --- | --- | --- | --- |',
    ...episodes.map((e) => `| ${episodeId(e.n)} | ${cell(e.file)} | ${e.rows.length * 3} | ${cell(e.summary || e.title || '')} |`), '',
    '## 六、逐集分析表', '',
  ];
  for (const e of episodes) out.push(`### ${episodeId(e.n)} ${e.file}`, '', HEADER, DIVIDER, ...renderRows(e.rows), '');
  return out.join('\n');
}

/** 小说按章切开。认「第X章 / 第X回 / 第X节 / Chapter N」；一个标题都没有就按字数切。 */
export function splitNovel(text, { size = 6000 } = {}) {
  const source = String(text || '').replace(/\r\n/g, '\n');
  const marks = [...source.matchAll(/^[ \t　]*(第\s*[0-9零〇一二三四五六七八九十百千两]+\s*[章回节卷][^\n]{0,30}|Chapter\s+\d+[^\n]{0,30})$/gmi)];
  const chapters = [];
  if (marks.length >= 2) {
    marks.forEach((m, i) => {
      const body = source.slice(m.index + m[0].length, i + 1 < marks.length ? marks[i + 1].index : source.length).trim();
      if (body) chapters.push({ title: m[1].trim(), text: body });
    });
  } else {
    const paragraphs = source.split(/\n+/).map((p) => p.trim()).filter(Boolean);
    let buffer = [];
    let length = 0;
    for (const p of paragraphs) {
      buffer.push(p); length += p.length;
      if (length >= size) { chapters.push({ title: `第${chapters.length + 1}段`, text: buffer.join('\n') }); buffer = []; length = 0; }
    }
    if (buffer.length) chapters.push({ title: `第${chapters.length + 1}段`, text: buffer.join('\n') });
  }
  return chapters;
}

/** 小说提取任务书：Agent 逐章读原文，按同一张表填。 */
export function novelTaskText(count) {
  return [
    '# 小说提取任务（相当于视频分析那一步，由你来做；零积分）', '',
    `原文已切成 ${count} 段，放在本目录的 原文/ 下。逐段读，把每一段写成一张提取表，存到 提取/EP001.md、提取/EP002.md……（和原文文件同号）。`,
    '填完跑 `chenyu-pro text-analyze --build --out <分析稿目录>`，会合成 video_reverse_全剧合集.md；之后和视频反推完全一样：assets-prepare → 填资产合并表 → assets-apply → 洗稿/改编建议 → 用户确认 → 写剧本。', '',
    '## 每张表的格式（第一行写一句本段剧情摘要，然后是表）', '',
    '摘要：本段发生了什么（一句话）', '', HEADER, DIVIDER,
    '| 1 | 你怎么来了？ | 沈青禾 | 沈青禾推开院门，看见站在槐树下的人，脚步一顿 | 沈家老宅·前院 | none | none | none | none | 竹篮、院门铜锁 | 沈青禾=二十出头，蓝布褂，长辫；陆明远=三十岁上下，灰长衫，戴圆框眼镜 | 1 |', '',
    '## 填法',
    '- **一行一个节拍**：一句台词一行（台词照原文，一字不改）；没有台词的关键动作、事件也单独成行，台词列写 none。',
    '- time 列写本段内的序号（1、2、3…）。',
    '- speaker：说话的人，用原文里的名字或称呼，原文怎么叫就怎么写，**不要在这一步合并或改名**（合并是下一步资产整理的事）。旁白、心声写 旁白 / 名字（内心）。',
    '- visible_action：这一拍里看得见的动作或事件，谁做了什么。心理描写转成看得见的表现，转不了的略过。',
    '- scene：发生的地点，照原文写法。',
    '- props：这一拍里被拿、被用、被提到的东西，顿号分隔。',
    '- appearance：这一段里原文写到的外貌、穿着，写成「名字=描述」，分号分隔；原文没写就留空，不要自己编。',
    '- camera、lighting、color_tone、effects 四列写 none；confidence 写 1。',
    '- 不概括、不删减有戏的内容：对话、冲突、转折、信息揭示都要有行；大段环境和心理描写可以并成一行。',
  ].join('\n');
}

/** 读 Agent 填好的一张提取表。 */
export function parseUnitTable(text) {
  const lines = String(text || '').replace(/\r\n/g, '\n').split('\n');
  const summary = (lines.find((l) => /^摘要[：:]/.test(l.trim())) || '').replace(/^\s*摘要[：:]/, '').trim();
  const rows = [];
  for (const line of lines) {
    if (!line.trim().startsWith('|')) continue;
    const cells = line.trim().replace(/^\|/, '').replace(/\|$/, '').split(/(?<!\\)\|/).map((c) => c.trim());
    if (cells.length < 12 || /^(time|---)/.test(cells[0])) continue;
    const empty = (v) => !v || /^(none|无|-)$/i.test(v);
    rows.push({ dialogue: empty(cells[1]) ? '' : cells[1], speaker: empty(cells[2]) ? '' : cells[2], action: empty(cells[3]) ? '' : cells[3], scene: empty(cells[4]) ? '' : cells[4], camera: empty(cells[5]) ? '' : cells[5], props: empty(cells[cells.length - 3]) ? '' : cells[cells.length - 3], appearance: empty(cells[cells.length - 2]) ? '' : cells[cells.length - 2] });
  }
  return { summary, rows };
}
