// 资产整理共用模块（零依赖、纯函数、不联网、不读写文件）。
//
// 平台和 Skill 用的是同一份：同一份证据、同一张资产合并表、同一套校验和落地、同一份规则。
// 两边唯一的区别是谁来填表——Skill 由客户的 Agent 填，平台由辰屿导演填。
// 本文件在两个仓库里必须逐字节一致：
//   E:\chenyu-pro-skill\scripts\asset_workbook.mjs
//   E:\chenyu-agent-platform\packages\video-reverse\src\assetWorkbook.mjs
//
// 本地代码只按编号/写法一字不差地匹配和替换，不按相似度合并，不改写内容。
// 台词列、字幕列、镜头列是原片证据，落地后逐行核对必须一字不差。

export const ASSET_WORKBOOK_VERSION = '1.2.0';
export const DOSSIER_FILE = 'video_reverse_全剧合集.md';

// ───────── 规则（唯一来源：Skill 的整理规则.md、平台的提示词都从这里生成）─────────
export const ASSET_RULES = Object.freeze({
  background: [
    '分析稿是平台一集一集、一个镜头一个镜头看画面写下的，它不知道前后剧情。所以同一个人、同一个地点、同一件东西在不同集会有不同写法。',
    '你的任务是通读证据后按剧情把它们合并归类：同一个角色全剧一个名字，同一个地点一个场景，只留推动剧情的关键道具。',
    '拿不准就不要硬合并：留空并写明原因。合错比没合更糟。'
  ],
  persons: [
    '每个标签都要判断归属。OBS_ 开头的是还没对上号的观察编号；同一个人几乎每一集都有一个新编号，把它们归到同一个正式名。',
    '名字写法不一是同一个人：字幕识别会把一个名字写成好几种（同音字、形近字的几种写法），简称和全名（名 / 姓+名）、姓氏加称谓（X医生 / 姓名）也是同一个人。统一成一个正式名，其余写进 aliases。正式名优先用名牌、字幕里最早出现的完整写法。',
    '称呼的对象不是说话人自己的名字：一句台词里喊出来的名字，是被喊的那个人的名字。台词「X，快回去」里的 X 是听话的那个人，不是说话的人。已有名字的标签如果名字其实是它喊别人的称呼，要改成它自己的名字或一个看得懂的称呼。',
    '称谓不是名字：二叔、婆婆、X少、X叔是别人对他的叫法，写进 aliases，不另立人物。分析稿按关系推出来的称呼（「X父」）要还原成剧里的真名；剧里始终没有出现真名的，就用最常用的称谓当正式名。',
    '描述词不是别名：少女、中年男子、黑衣青年、民族风女子这类谁都可以是的描述，不要写进 aliases（写了也会被忽略）。aliases 只写剧里对这个人的专属叫法和名字的其他写法，整理时描述文字里的这些叫法会统一换成正式名。',
    '判断依据按可靠程度：名牌和字幕 > 对白里的称呼和自称 > 剧情位置（这一集谁在场、在办什么事）> 外观。外观只能作旁证，很多人都穿黑西装。',
    '名牌（画面上指向某个人的名字小字，常是竖排、带定位图标，或「名字-身份」花字）最硬：出现过名牌的人一定要进人物表或单集角色表，用名牌上的名字，不要用「老者乙」「路人甲」代替。同场几个相似的人按名牌和各自的外观分开，不要把名牌上的名字给错人。名牌有形近字识别错误时，按全剧其他地方的写法统一。',
    '剧情里成组出现、身份相近的几个人要一个一个分清是谁、属于哪一方：后面的剧情常常靠这层关系展开。',
    '名牌上的家族名、人名，如果全剧对白和字幕里从没出现，而有一个字形相近的出现过（手写体名牌常被认错字），按对白里的写法改正并写进 review。',
    '配角属于哪一方，看他做的事对谁有利，不要按他站在谁家、穿什么判断。',
    '单集角色在相邻几集里外观一致（同一身衣服、同样的发型）并且做的是同一类事，就是同一个人：用同一个称呼，不要拆成两个。',
    '别名只写剧里真出现过的叫法（台词、字幕、名牌里能找到原文的），剧里没人这么叫过的不要自己拼。别人经常怎么喊他（昵称、尊称），一定要写进别名。',
    '会说话、会自己行动的动物和非人生物是角色，归人物。',
    '会说话的动物、非人生物：全剧只有它一只的，它的物种叫法也写进 aliases，描述文字里写的物种才能对上它。',
    '紧挨着的两集是同一场戏（上一集结尾和下一集开头在同一地点接着演）时，场上同一批群演（保安、保镖、宾客）用同一个称呼。',
    '只在单集出现的路人（保安、记者、刺客）不跨集合并，归属填一个看得懂的称呼（刺客头目、X家保安）。出现 3 集以上的是正式人物，要进 characters。',
    '一个标签下混了两个人的台词（同一集两个穿西装的男人被记成一个人）：标签按主要的那个人归属，不属于他的那几句用 line_overrides 按「集号 + 时间码」逐句指定说话人。',
    '地名不是人名：不要把人名当地名、把地名当人名（由人名拼出来的地名是识别错误）。'
  ],
  scenes: [
    '同一个地点一个场景名，写成「归属 + 房间」（X家客厅、Y集团会议室、Z村·村口）。',
    '位置不是新场景：门口、窗边、桌前、地面、走廊一角，都属于它所在的那个场景。同一建筑里功能不同的房间（客厅、书房、卧室、会议室）是不同场景。',
    '只写「书房」「客厅」「室内」「暗室」的，按这一集的剧情和对白判断是谁家的、哪个机构的，补上归属。同一个写法在不同集可能是不同地点。',
    '同一处地方在不同集被写成不同名字（具体名 / 泛称 / 功能名）时，看是不是同一个主人、同一件事在那里接着发生；是就合并。',
    '地名的多种写法（同音字、形近字、简称）统一成画面名牌、字幕里的写法（出现最多的那一个），不要按剧名或自己的理解改字；人物身份、场景名、道具名里的同一个地名，全表只用这一种写法。',
    '画面差别很大的封闭空间（地下室、密室、车厢、电梯）即使在同一栋建筑里也单独成场景：它们要单独出图。',
    '屏幕里、视频通话里、回忆里的画面单独成场景并写明（回忆·药厂走廊、视频画面）。',
    '归属确实看不出来的，起一个中性的名字并写明原因，不要猜是谁家。'
  ],
  props: [
    '只留推动剧情的关键道具：信物、身份证明、证据文书、药物、武器、机关钥匙、人物标志物、反复出现的随身物。function 写它在戏里的作用（身份证明 / 证据 / 线索 / 情感信物 / 威胁 / 救援 / 筹码 / 羞辱 / 人物标志物）。',
    '门窗桌椅、墙和地面、普通陈设、一次性的普通物件不进资产表，不用处理。',
    '同一件东西的多种写法合并（手机 / 智能手机；拐杖 / 竹杖 / 木拐杖）。道具名具体到是谁的、是什么（X的拐杖）。',
    '作用不同的东西不要并在一起：同是纸面文书，记账的、欠款凭据、出入货单据、合同协议各是一件。',
    '同一类东西属于不同的人或不同的一方，就是不同的道具，不要合并；同一个地方一真一假的两份也是两件。',
    '道具名按剧里对它的叫法和它的内容起，不要按场面给它套一个名字。',
    '开场引出整个故事的物件、主角反复使用的工具和随身物也是关键道具。',
    '在一集里连续出现多个镜头、外形特殊、出图时要保持样子一致的物件，只出现一集也是关键道具：它需要一张固定的参考图。',
    '同一个写法在不同集可能是不同的东西（前几集的某个物件属于甲，后几集同名的物件属于乙）：指明这一组只管哪几集。',
    '会说话或自己行动的动物、非人生物是角色，不算道具。'
  ],
  speakers: [
    '分析稿是一格一格标的说话人，常见错法：把被喊的人、在场离得最近的人、画面焦点上的人标成了说话人。逐句读台词清单，按前后镜头判断每句真正是谁说的。',
    '会说话的动物、非人生物常被标错：替别人传话的（「他说……」）是转述的那一个；一句话里喊某人昵称的，多半是平时这样叫那个人的角色。',
    '同场几个年龄、衣着相近的人：看这一行动作描述里开口的是谁、名牌是谁，不要因为上一句提到了谁就归给谁。',
    '把一句台词改给别人之前，先确认那个人在这一行或前后两行的画面里（动作描述或外观列里有他）；不在场的人说不了这句话。',
    '按台词内容判断立场：一句话对哪一方有利，说这句话的多半是那一方的人。',
    '一句话出现在谁的镜头里、动作描述写的是谁，都只是线索，要和台词内容、称呼、立场一起看。反应镜头很常见：画面拍的是听的人在瞪眼、皱眉，配的却是对方的台词，所以「某某眼神变得犀利」「某某看向对方」不能证明是某某在说话。',
    '对话一来一回：上一句是 A 冲着 B 说的，紧接着反驳、回嘴、接话的通常是 B。改之前先看前后两句是不是这样轮流的，原标注符合轮流顺序的不要改。',
    '只改有把握的；拿不准的保持原样，写进 review 说明为什么拿不准。一格里混了两个人的话时，按主要那句归属，并写进 review 提醒写剧本时拆开。'
  ],
  logic: [
    '整理时发现分析稿前后矛盾的地方（同一件事两集说法不同、摘要里的人名和镜头里对不上、时间线倒置），以对白和字幕为准，把结论写进 review；不要为了自圆其说去改台词。'
  ]
});

const OBS_RE = /OBS_[A-Za-z0-9_]+/g;
// 描述词不是名字：很多人都可以是「少女」「中年男子」。它们不当别名用，描述文字里也不替换。
export const GENERIC_ALIAS_RE = /^(少女|女子|女孩|姑娘|男子|男人|女人|中年男子|中年妇人|中年女子|老妇人?|老者|老人|老头|青年|年轻男子|年轻女子|少年|民族风女子|民族服饰少女|苗族少女|黑衣青年|黑衣男子|黑衣女子|西装男子?|西装青年|保镖|保安|助理|助手|医生|护士|圣女|女主|男主|女主角|男主角|少爷|小姐|夫人|先生)$/;
// 「特征 + 男子/少女……」这种外观描述（轮椅男子、灰西装男子、白背心男子、苗疆少女）也不是别名
export const DESCRIPTOR_ALIAS_RE = /^[一-龥A-Za-z0-9]{1,8}(男子|女子|少女|少年|男人|女人|青年|老人|老者|长者|老头|妇人|中年人|男孩|女孩)$/;
const isDescriptorAlias = (alias) => GENERIC_ALIAS_RE.test(alias) || DESCRIPTOR_ALIAS_RE.test(alias);
// 头衔（X家少爷/董事长/X总）和物种/形态叫法（飞蛾/螳螂/黄鸭/蟾蜍）：可以作别名，但在描述文字里是普通词，不做全文替换
export const DESCRIPTIVE_ALIAS_RE = /(少爷|小姐|少主|家主|千金|董事长|董事|总裁|老板|先生|夫人|太太|老爷|婆婆|奶奶|爷爷|大人|主人|寨主|谷主|蛾|螳螂|蟾蜍|蟾|蛤蟆|蚕|鸭|鹅|鸵鸟|蛇|狐|猫|狗|犬|兔|雀|鸟|虫|蛙|龟|鼠|狼|熊|驴|马|蝶|蜂|蛛|形态|造型)$/;

// 身份泛称：只说身份不说是谁的称呼（刺客、保镖、手下……），前面可以带颜色/衣着/所属
export const GENERIC_ROLE_RE = /^[一-龥]{0,6}(刺客|杀手|保镖|保安|手下|打手|随从|下属|助手|助理|员工|工人|职员|记者|护士|司机|服务员|警察|侍卫|家丁|丫鬟|仆人|混混|路人|群众|宾客)(首领|头目|头领|甲|乙|丙|丁)?$/;

// 同一个地名只差一个字的几种写法（同音字/形近字：X古寨 / X蛊寨）。只找候选，是不是同一个地方交给填表的人判断。
const PLACE_SUFFIX = new Set([...'寨村镇城府宫阁谷岭观寺庄堡岛湾峰坡屯']);
const CJK = /^[一-龥]+$/;
// 地名边界看不出来（「这里是千古寨」），所以取以地名字结尾的 2~4 字每一种切法；同长度、只差一个字的归一组，
// 长的组优先，被长组包含的短组不再单列。
function placeTokens(value) {
  const out = [];
  const s = String(value || '');
  for (let i = 1; i < s.length; i += 1) {
    if (!PLACE_SUFFIX.has(s[i])) continue;
    // 两个字的切法噪声太大（客观/外观），只看 3~4 字的地名
    for (let k = 2; k <= 3 && i - k >= 0; k += 1) {
      const token = s.slice(i - k, i + 1);
      if (CJK.test(token)) out.push(token);
    }
  }
  return out;
}
export function placeSpellingGroups(dossier) {
  const counts = new Map();
  const onScreen = new Map();
  const add = (map, word) => map.set(word, (map.get(word) || 0) + 1);
  for (const word of placeTokens(dossier.head)) add(counts, word);
  for (const row of dossier.rows) {
    const c = row.cells;
    for (const word of placeTokens(`${c[3]} ${c[4]}`)) add(counts, word);
    for (const word of placeTokens(`${c[1]} ${c[c.length - 4]}`)) { add(counts, word); add(onScreen, word); }
  }
  const words = [...counts.keys()].sort((a, b) => b.length - a.length);
  const differsByOne = (a, b) => a.length === b.length && a.slice(-1) === b.slice(-1) && [...b].filter((ch, i) => ch !== a[i]).length === 1;
  const groups = [];
  const covered = (word) => groups.some((group) => group.some((item) => item.writing.includes(word)));
  const taken = new Set();
  for (const a of words) {
    if (covered(a) || taken.has(a)) continue;
    const group = [a, ...words.filter((b) => !taken.has(b) && differsByOne(a, b))];
    if (group.length < 2 || group.every((w) => covered(w))) continue;
    // 长组里的写法各自至少出现两次才算，避免「是千古寨」「起千蛊寨」这种偶然切出来的组
    if (a.length === 4 && group.some((w) => (counts.get(w) || 0) < 2)) continue;
    if (group.reduce((sum, w) => sum + (counts.get(w) || 0), 0) < 3) continue;
    group.forEach((w) => taken.add(w));
    groups.push(group.map((w) => ({ writing: w, count: counts.get(w), on_screen: onScreen.get(w) || 0 })).sort((x, y) => y.on_screen - x.on_screen || y.count - x.count));
  }
  return groups.slice(0, 20);
}
// 台词开头喊的名字：「月月，7号舱的臭味」里的「月月」
const VOCATIVE_RE = /^[「“"]?([一-龥]{1,4})[，,！!、。…]/;
const EMPTY_CELL = /^(none|无|n\/a|-)?$/i;
const isEmpty = (value) => EMPTY_CELL.test(String(value ?? '').trim());
const splitCells = (line) => line.trim().replace(/^\|/, '').replace(/\|$/, '').split(/(?<!\\)\|/).map((cell) => cell.trim());
// 括号、引号里的分隔符不拆（「蓝色线装账本（内页写有：北辰医疗、实验维护）」是一件）
const splitOutsideBrackets = (text) => {
  const parts = [];
  let depth = 0;
  let current = '';
  for (const ch of text) {
    if ('（(【[「“'.includes(ch)) depth += 1;
    else if ('）)】]」”'.includes(ch)) depth = Math.max(0, depth - 1);
    if (!depth && /[、,，/;；]/.test(ch)) { parts.push(current); current = ''; continue; }
    current += ch;
  }
  parts.push(current);
  return parts;
};
const splitPropList = (value) => splitOutsideBrackets(String(value || ''))
  .map((item) => item.trim().replace(/[（(]\s*叠加\s*[）)]\s*$/, ''))
  .filter((item) => item && !isEmpty(item));
// 场景用整格原文做写法（「豪门卧室/书房」「室内/手机屏幕」是一个写法，不拆开）
const sceneWriting = (value) => { const text = String(value || '').trim(); return isEmpty(text) ? '' : text; };
export const episodeNumber = (id) => Number(String(id || '').replace(/\D/g, '')) || 0;
export const episodeId = (n) => 'EP' + String(n).padStart(3, '0');
const byEpisode = (a, b) => episodeNumber(a) - episodeNumber(b);
const escapeRegExp = (text) => String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const cellText = (value) => String(value ?? '').replace(/\r?\n/g, '<br>').trim() || '-';

// 出现集写成连续区间：EP001–003、EP007
export function episodeSpan(ids) {
  const list = [...new Set(ids)].map((id) => ({ id: String(id), n: episodeNumber(id) })).filter((item) => item.n > 0).sort((a, b) => a.n - b.n);
  if (!list.length) return '-';
  const runs = [];
  for (const item of list) {
    const last = runs[runs.length - 1];
    if (last && item.n === last.end.n + 1) last.end = item;
    else runs.push({ start: item, end: item });
  }
  return runs.map((run) => (run.start.n === run.end.n ? run.start.id : `${run.start.id}–${run.end.id.replace(/^\D+/, '')}`)).join('、');
}

function expandEpisodes(value) {
  if (Array.isArray(value)) return value.map((item) => String(item || '').trim().toUpperCase()).filter(Boolean);
  const text = String(value || '');
  const range = text.match(/EP?0*(\d+)\s*[-–~至到]\s*(?:EP)?0*(\d+)/i);
  if (range) return Array.from({ length: Math.max(0, Number(range[2]) - Number(range[1]) + 1) }, (_, k) => episodeId(Number(range[1]) + k));
  return text.split(/[,，、\s]+/).map((item) => item.trim().toUpperCase()).filter(Boolean);
}

// 读合集的逐集分析表。列位置：左起 0时间 1台词 2说话人 3动作 4场景；右起 1置信度 2外观 3道具（字幕列里可能有转义竖线）。
export function parseDossier(text) {
  const source = String(text || '').replace(/\r\n/g, '\n');
  const mark = source.indexOf('## 六、逐集分析表');
  if (mark < 0) throw new Error('合集里没有「六、逐集分析表」，分析稿版本太旧');
  const head = source.slice(0, mark);
  const lines = source.slice(mark).split('\n');
  const rows = [];
  let episode = '';
  lines.forEach((line, index) => {
    const title = line.match(/^### (EP\d+)/);
    if (title) { episode = title[1]; return; }
    if (!episode || !line.startsWith('|')) return;
    const cells = splitCells(line);
    if (cells.length < 12 || /^(time|---)/.test(cells[0])) return;
    rows.push({ index, episode, cells });
  });
  if (!rows.length) throw new Error('逐集分析表里没有镜头行，分析稿不完整');
  const summaries = new Map();
  for (const line of head.split('\n')) {
    const cells = line.startsWith('|') ? splitCells(line) : [];
    if (cells.length >= 4 && /^EP\d+$/.test(cells[0])) summaries.set(cells[0], cells[3]);
  }
  return { head, lines, rows, summaries };
}

const parseAppearance = (cell) => String(cell || '').split(/[；;]/).map((part) => {
  const at = part.search(/[=＝]/);
  return at > 0 ? { who: part.slice(0, at).trim(), look: part.slice(at + 1).trim() } : null;
}).filter(Boolean);

export function collectAssetEvidence(dossier) {
  const labels = new Map();
  const scenes = new Map(); // 集 -> Map(写法 -> { shots, samples })
  const props = new Map(); // 写法 -> Map(集 -> 次数)
  const propSamples = new Map(); // 写法 -> 出现时的动作描述样例
  const label = (name) => {
    if (!labels.has(name)) labels.set(name, { name, episodes: new Set(), lines: [], looks: new Map(), actions: [] });
    return labels.get(name);
  };
  for (const row of dossier.rows) {
    const c = row.cells;
    const speaker = c[2];
    if (!isEmpty(speaker)) {
      const entry = label(speaker);
      entry.episodes.add(row.episode);
      if (!isEmpty(c[1])) entry.lines.push({ episode: row.episode, time: c[0], text: c[1], action: c[3] });
    }
    for (const item of parseAppearance(c[c.length - 2])) {
      if (!item.who) continue;
      const entry = label(item.who);
      entry.episodes.add(row.episode);
      entry.looks.set(item.look, (entry.looks.get(item.look) || 0) + 1);
      if (entry.actions.length < 2 && c[3].includes(item.who)) entry.actions.push({ episode: row.episode, time: c[0], action: c[3], speaker: '', text: '' });
    }
    // 动作描述里也会出现观察编号（说话人列已换成名字，但描述文字里还是编号），同样要归属
    for (const id of new Set(String(c[3]).match(OBS_RE) || [])) {
      const entry = label(id);
      entry.episodes.add(row.episode);
      if (entry.actions.length < 3) entry.actions.push({ episode: row.episode, time: c[0], action: c[3], speaker: isEmpty(speaker) ? '' : speaker, text: isEmpty(c[1]) ? '' : c[1] });
    }
    const scene = sceneWriting(c[4]);
    if (scene) {
      if (!scenes.has(row.episode)) scenes.set(row.episode, new Map());
      const bucket = scenes.get(row.episode);
      const entry = bucket.get(scene) || { shots: 0, samples: [] };
      entry.shots += 1;
      if (entry.samples.length < 2 && c[3]) entry.samples.push(`${isEmpty(c[1]) ? '' : `「${String(c[1]).slice(0, 24)}」`}${String(c[3]).slice(0, 50)}`);
      bucket.set(scene, entry);
    }
    for (const prop of new Set(splitPropList(c[c.length - 3]))) {
      if (!props.has(prop)) props.set(prop, new Map());
      props.get(prop).set(row.episode, (props.get(prop).get(row.episode) || 0) + 1);
      // 道具出现时的动作描述：判断它是不是推动剧情的关键道具，要看它在戏里被怎么用
      if (!propSamples.has(prop)) propSamples.set(prop, []);
      const samples = propSamples.get(prop);
      if (samples.length < 2 && c[3]) samples.push(`[${row.episode}] ${isEmpty(c[1]) ? '' : `「${String(c[1]).slice(0, 20)}」`}${String(c[3]).slice(0, 50)}`);
    }
  }
  // 只在人物表里出现、镜头行里已被换成名字的编号，也要归属
  for (const id of new Set(dossier.head.match(OBS_RE) || [])) label(id);
  return { labels, scenes, props, propSamples, dossier };
}

const pickSpread = (items, n) => (items.length <= n ? items : Array.from({ length: n }, (_, k) => items[Math.floor((k * items.length) / n)]));
const firstEpisode = (entry) => [...entry.episodes].sort(byEpisode)[0] || 'EP999';

// 名字证据：全剧名牌原文（分析时记在字幕列「名牌：…」），和对白、字幕里出现过的家族/机构叫法（某家、某氏）各几次。
// 手写体名牌常把字认成形近字；拿全剧对白里的写法对一下就能看出来。只提供材料，不改任何内容。
export function nameEvidence(dossier) {
  const nameCards = [];
  const families = new Map();
  for (const row of dossier.rows) {
    const c = row.cells;
    const subtitle = String(c[c.length - 4] || '');
    for (const m of subtitle.matchAll(/名牌[：:]\s*([^|；;<]{1,30})/g)) nameCards.push({ episode: row.episode, time: c[0], text: m[1].trim() });
    const heard = `${isEmpty(c[1]) ? '' : c[1]} ${subtitle.replace(/名牌[：:][^|；;<]*/g, '')}`;
    // 台词列和字幕列常是同一句话，一行只算一次
    for (const word of new Set([...heard.matchAll(/([一-龥])(家|氏)/g)].map((m) => m[0]))) families.set(word, (families.get(word) || 0) + 1);
  }
  return { nameCards, families: [...families.entries()].sort((a, b) => b[1] - a[1]) };
}

// 名牌上的家族名（某家、某氏）在全剧对白和字幕里一次都没出现：多半是手写体名牌认错了形近字，要让填表的人对一下。
export function nameCardFamilyGaps(dossier) {
  const { nameCards, families } = nameEvidence(dossier);
  const heard = new Set(families.map(([word]) => word));
  if (!heard.size) return [];
  const out = [];
  const seen = new Set();
  for (const card of nameCards) {
    const person = card.text.split(/\s*[-—－]\s*|\s+/)[0].trim();
    for (const m of person.matchAll(/([一-龥])(家|氏)/g)) {
      if (heard.has(m[0]) || seen.has(person)) continue;
      seen.add(person);
      out.push({ episode: card.episode, time: card.time, card: card.text, person, family: m[0], heard: families.map(([word, n]) => `${word}×${n}`) });
    }
  }
  return out;
}

// 道具种类：一个道具下合并的写法应当是同一种东西。账本、单据（欠条/结算单/出库单）、协议合同、契书各是一类，
// 并在一起多半是合错了（「欠条」并进了「账本」）。只按写法里的字判断种类，不改内容。
const PROP_KINDS = [
  ['账本', /账[本册簿]|旧账|账$/],
  ['单据', /欠条|借条|收据|票据|单据|结算单|出库单|清单|[单条据]$/],
  ['协议', /协议|合同/],
  ['契书', /婚契|婚书|契约|契书|契$/]
];
export function propKindOf(writing) {
  const hit = PROP_KINDS.find(([, re]) => re.test(String(writing || '')));
  return hit ? hit[0] : '';
}
export function propKindClashes(props = []) {
  const out = [];
  for (const prop of props) {
    const byKind = new Map();
    for (const w of prop.writings || []) {
      const writingText = typeof w === 'string' ? w : w?.text;
      const kind = propKindOf(writingText);
      if (!kind) continue;
      if (!byKind.has(kind)) byKind.set(kind, []);
      byKind.get(kind).push(writingText);
    }
    // 道具名本身用「与/和/及」连起两样东西（「X与Y」），也是两件被并成了一件
    const joined = /[一-龥]{2,}[与和及][一-龥]{2,}/.test(String(prop.name || ''));
    if (byKind.size >= 2 || joined) out.push({ name: prop.name, kinds: Object.fromEntries(byKind), ...(joined ? { joined_name: true } : {}) });
  }
  return out;
}

// 一个标签自己开口时喊出的称呼（台词开头的名字）
export function vocativesOf(entry) {
  const out = new Map();
  for (const line of entry.lines) {
    const called = String(line.text).match(VOCATIVE_RE)?.[1];
    if (called) out.set(called, (out.get(called) || 0) + 1);
  }
  return [...out.entries()].map(([called, n]) => `${called}×${n}`);
}

export function orderedLabels(evidence) {
  return [...evidence.labels.values()].sort((a, b) => byEpisode(firstEpisode(a), firstEpisode(b)) || a.name.localeCompare(b.name));
}

export function labelCard(entry, sampleCount = 3) {
  const out = [`### ${entry.name} ｜ 台词 ${entry.lines.length} 行 ｜ 集: ${episodeSpan([...entry.episodes])}`];
  const called = vocativesOf(entry);
  if (called.length) out.push(`- 它开口喊别人：${called.join('、')}${called.some((item) => item.startsWith(entry.name + '×')) ? '　⚠ 标签名就是它喊别人的称呼，多半名字标错了' : ''}`);
  for (const [look] of [...entry.looks.entries()].sort((a, b) => b[1] - a[1]).slice(0, 2)) out.push(`- 外观: ${look.slice(0, 80)}`);
  for (const line of pickSpread(entry.lines, sampleCount)) out.push(`- [${line.episode} ${line.time}] 「${line.text.slice(0, 50)}」 ← ${line.action.slice(0, 60)}`);
  if (!entry.lines.length) {
    for (const item of entry.actions) out.push(`- [${item.episode} ${item.time}] (${item.text ? `这一行是 ${item.speaker || '?'} 说「${item.text.slice(0, 30)}」` : '无台词'}) ${item.action.slice(0, 100)}`);
  }
  return out.join('\n');
}

export function propCatalog(evidence) {
  return [...evidence.props.entries()]
    .map(([writing, episodes]) => ({ writing, episodes: [...episodes.keys()].sort(byEpisode), counts: Object.fromEntries(episodes), count: [...episodes.values()].reduce((a, b) => a + b, 0), samples: evidence.propSamples?.get(writing) || [] }))
    .sort((a, b) => b.episodes.length - a.episodes.length || b.count - a.count || a.writing.localeCompare(b.writing));
}

// 全部镜头行按集排好（有台词的带编号），给逐句核对说话人用。前后没有台词的镜头也列上：谁在场、谁在动，是判断说话人的依据。
export function dialogueLedger(dossier, { speakerOf = (cells) => cells[2] } = {}) {
  const lines = [];
  let n = 0;
  for (const row of dossier.rows) {
    const c = row.cells;
    const spoken = !isEmpty(c[1]) && !isEmpty(c[2]);
    if (spoken) n += 1;
    lines.push({
      id: spoken ? `D${String(n).padStart(4, '0')}` : '',
      episode: row.episode,
      time: c[0],
      speaker: spoken ? speakerOf(c) : '',
      line: isEmpty(c[1]) ? '' : c[1],
      action: String(c[3] || '').slice(0, 90)
    });
  }
  return lines;
}

// 全剧称呼习惯：每个说话人开口喊别人时用的称呼（「月月，……」）各出现几次。
// 一句台词的称呼在这个说话人嘴里只出现这一次，而全剧平时这样喊的另有其人 → 可疑，附上平时这样喊的是谁。
export function vocativeHabits(ledger) {
  const habits = new Map();
  for (const item of ledger) {
    if (!item.id) continue;
    const called = String(item.line).match(VOCATIVE_RE)?.[1];
    if (!called) continue;
    if (!habits.has(item.speaker)) habits.set(item.speaker, new Map());
    const own = habits.get(item.speaker);
    own.set(called, (own.get(called) || 0) + 1);
  }
  const hints = new Map(); // id -> 提示
  for (const item of ledger) {
    if (!item.id) continue;
    const called = String(item.line).match(VOCATIVE_RE)?.[1];
    if (!called || (habits.get(item.speaker)?.get(called) || 0) > 1) continue;
    const usual = [...habits.entries()].filter(([who, own]) => who !== item.speaker && (own.get(called) || 0) >= 2).map(([who, own]) => `${who}（${own.get(called)}次）`);
    if (usual.length) hints.set(item.id, `全剧平时喊「${called}」的是 ${usual.join('、')}，${item.speaker}只在这一句这样喊`);
  }
  return { habits, hints };
}

export function renderDialogueLedger(dossier) {
  const ledger = dialogueLedger(dossier);
  const { habits, hints } = vocativeHabits(ledger);
  const out = ['# 台词清单（逐句核对说话人）', '', '有编号的是台词行；没编号的是同一场里没有台词的镜头，用来看谁在场、谁在动。说话人标错的，用 line_overrides 按「集号 + 时间码」改正。', '标 ⚠ 的是称呼习惯对不上的句子，重点看。', ''];
  const habitLines = [...habits.entries()].map(([who, own]) => `- ${who}：${[...own.entries()].sort((a, b) => b[1] - a[1]).map(([called, n]) => `${called}×${n}`).join('、')}`);
  if (habitLines.length) out.push('## 全剧称呼习惯（谁开口喊谁、喊几次）', '', ...habitLines, '');
  let episode = '';
  for (const item of ledger) {
    if (item.episode !== episode) { episode = item.episode; out.push('', `## ${episode}`, ''); }
    const hint = hints.get(item.id);
    out.push(item.id ? `- ${item.id} [${item.time}] ${item.speaker}：「${item.line}」 ｜ ${item.action}${hint ? `　⚠ ${hint}` : ''}` : `- 　　 [${item.time}] （无台词） ｜ ${item.action}`);
  }
  return out.join('\n') + '\n';
}

export function renderRules() {
  const section = (title, list) => [`## ${title}`, '', ...list.map((rule) => `- ${rule}`), ''];
  return [
    '# 资产整理规则', '',
    ...ASSET_RULES.background.map((rule) => `- ${rule}`), '',
    ...section('人物怎么合并', ASSET_RULES.persons),
    ...section('说话人逐句核对（读 台词清单.md）', ASSET_RULES.speakers),
    ...section('场景怎么合并', ASSET_RULES.scenes),
    ...section('道具怎么整理', ASSET_RULES.props),
    ...section('剧情逻辑', ASSET_RULES.logic)
  ].join('\n');
}

// 给填表的人看的四份材料 + 待填的合并表
export function renderEvidenceFiles(dossier, evidence) {
  const ordered = orderedLabels(evidence);
  const named = ordered.filter((entry) => !entry.name.startsWith('OBS_'));
  const observed = ordered.filter((entry) => entry.name.startsWith('OBS_'));
  const sceneEpisodes = [...evidence.scenes.keys()].sort(byEpisode);
  const props = propCatalog(evidence);
  // 填表前就能看出来的：台词开头喊的名字和说话人标签一样（「照月：照月，快走」）
  const selfCalled = dossier.rows.filter((row) => !isEmpty(row.cells[1]) && !isEmpty(row.cells[2]) && String(row.cells[1]).match(VOCATIVE_RE)?.[1] === row.cells[2]);
  const names = nameEvidence(dossier);
  const cards = [
    '# 人物证据卡', '',
    '每个说话人/出场标签一张卡：出场集、外观、台词样例（带时间码）。OBS_ 开头的是平台还没对上号的观察编号。', '',
    '## 剧情摘要', '', ...[...dossier.summaries.entries()].map(([ep, summary]) => `- ${ep}: ${summary}`), '',
    '## 名牌原文和对白里的家族名', '',
    '名牌是最硬的证据，但手写体名牌常被认成形近字：名牌上的家族名如果对白、字幕里从没出现，而有一个字形相近的出现过，按对白里的写法统一，并写进 review。', '',
    `- 名牌：${names.nameCards.length ? names.nameCards.map((item) => `[${item.episode} ${item.time}] ${item.text}`).join('；') : '无'}`,
    `- 对白和字幕里的家族/机构叫法：${names.families.length ? names.families.map(([word, n]) => `${word}×${n}`).join('、') : '无'}`, '',
    ...(selfCalled.length ? [
      '## 疑似标错的说话人（台词开头喊的名字就是说话人自己）', '',
      '多半是把被喊的人标成了说话人。按画面动作判断真正开口的是谁，用 line_overrides 逐句改正。填完合并表后 assets-apply 还会按别名再查一遍。', '',
      ...selfCalled.map((row) => `- [${row.episode} ${row.cells[0]}] ${row.cells[2]}：「${row.cells[1].slice(0, 40)}」 ← ${row.cells[3].slice(0, 70)}`), ''
    ] : []),
    '## 有名字的标签', '', named.map((entry) => labelCard(entry, 4)).join('\n\n'), '',
    '## 观察编号（按首次出场排序）', '', observed.map((entry) => labelCard(entry, 3)).join('\n\n'), ''
  ].join('\n');
  const placeGroups = placeSpellingGroups(dossier);
  const scenes = [
    '# 场景清单（原始写法，按集）', '',
    ...(placeGroups.length ? [
      '## 疑似同一个地名的几种写法（只差一个字）', '',
      '是同一个地方的，按画面字幕里的写法统一：在合并表 place_spellings 里写 {"原写法": "统一后的写法"}；不是同一个地方的不用管。on_screen 是在台词/字幕里出现的次数。', '',
      ...placeGroups.map((group) => `- ${group.map((item) => `${item.writing}（共 ${item.count}，字幕/台词 ${item.on_screen}）`).join(' ／ ')}`), ''
    ] : []),
    ...sceneEpisodes.map((ep) => [
      `## ${ep} ${String(dossier.summaries.get(ep) || '').slice(0, 80)}`, '',
      ...[...evidence.scenes.get(ep).entries()].map(([writing, info]) => `- ${writing} ×${info.shots}${info.samples.length ? `　例：${info.samples.join('；')}` : ''}`), ''
    ].join('\n'))
  ].join('\n');
  const propText = [
    '# 道具清单（原始写法）', '',
    '每个写法附它出现时的画面动作样例：看它在戏里被怎么用，判断是不是推动剧情的关键道具。', '',
    '## 跨集出现', '', ...props.filter((item) => item.episodes.length >= 2).map((item) => `- ${item.writing} ｜ ${item.count} 次 ｜ ${episodeSpan(item.episodes)}${item.samples.length ? `　例：${item.samples.join('；')}` : ''}`), '',
    '## 只在单集出现', '', ...sceneEpisodes.map((ep) => {
      const list = props.filter((item) => item.episodes.length === 1 && item.episodes[0] === ep).map((item) => `  - ${item.writing}×${item.count}${item.samples.length ? `　例：${item.samples[0]}` : ''}`);
      return list.length ? `- ${ep}\n${list.join('\n')}` : '';
    }).filter(Boolean), ''
  ].join('\n');
  const template = {
    说明: '按 整理规则.md 填写。labels: 每个标签归属到谁（填 characters 里的正式名；只在单集出现的路人填一个看得懂的称呼；已有名字且不用改的可以留空；观察编号判断不了就留空并在 review 里写原因）。scenes: 每集每个地点写法归到哪个场景。place_spellings: 同一个地名的几种写法统一成字幕里的那一个。props: 只列关键道具。',
    characters: [{ name: '', role: '', aliases: [], note: '' }],
    labels: Object.fromEntries(ordered.map((entry) => [entry.name, ''])),
    line_overrides: [],
    scenes: Object.fromEntries(sceneEpisodes.map((ep) => [ep, Object.fromEntries([...evidence.scenes.get(ep).keys()].map((writing) => [writing, '']))])),
    scene_notes: {},
    props: [{ name: '', function: '', writings: [] }],
    creatures: [],
    place_spellings: {},
    review: []
  };
  return {
    cards,
    scenes,
    props: propText,
    lines: renderDialogueLedger(dossier),
    rules: renderRules(),
    template,
    counts: { labels: evidence.labels.size, observed: observed.length, scenes: [...evidence.scenes.values()].reduce((n, bucket) => n + bucket.size, 0), props: evidence.props.size }
  };
}

export function normalizeAssetMap(raw = {}) {
  const map = raw && typeof raw === 'object' ? raw : {};
  const text = (value) => String(value ?? '').trim();
  const characters = [];
  for (const item of Array.isArray(map.characters) ? map.characters : []) {
    const name = text(item?.name);
    if (!name) continue;
    const existing = characters.find((c) => c.name === name);
    const aliases = (Array.isArray(item?.aliases) ? item.aliases : []).map(text).filter((alias) => alias && alias !== name && !isDescriptorAlias(alias));
    if (existing) {
      existing.aliases = [...new Set([...existing.aliases, ...aliases])];
      if (!existing.role) existing.role = text(item?.role);
      if (!existing.note) existing.note = text(item?.note);
    } else characters.push({ name, role: text(item?.role), aliases: [...new Set(aliases)], note: text(item?.note) });
  }
  const labels = new Map();
  for (const [key, value] of Object.entries(map.labels && typeof map.labels === 'object' ? map.labels : {})) {
    const to = text(value && typeof value === 'object' ? value.to : value);
    labels.set(text(key), { to, note: text(value && typeof value === 'object' ? value.note : '') });
  }
  const scenes = {};
  for (const [ep, bucket] of Object.entries(map.scenes && typeof map.scenes === 'object' ? map.scenes : {})) {
    if (!bucket || typeof bucket !== 'object') continue;
    scenes[text(ep).toUpperCase()] = Object.fromEntries(Object.entries(bucket).map(([writing, name]) => [text(writing), text(name)]));
  }
  return {
    characters,
    labels,
    lineOverrides: (Array.isArray(map.line_overrides) ? map.line_overrides : [])
      .map((item) => ({ episode: text(item?.episode).toUpperCase(), time: text(item?.time), speaker: text(item?.speaker) }))
      .filter((item) => item.episode && item.time && item.speaker),
    scenes,
    sceneNotes: Object.fromEntries(Object.entries(map.scene_notes && typeof map.scene_notes === 'object' ? map.scene_notes : {}).map(([k, v]) => [text(k), text(v)])),
    props: (Array.isArray(map.props) ? map.props : []).map((item) => ({
      name: text(item?.name),
      function: text(item?.function),
      writings: (Array.isArray(item?.writings) ? item.writings : []).map((w) => (typeof w === 'string'
        ? { text: text(w), episodes: null }
        : { text: text(w?.text), episodes: w?.episodes ? expandEpisodes(w.episodes) : null })).filter((w) => w.text)
    })).filter((item) => item.name),
    creatures: new Set((Array.isArray(map.creatures) ? map.creatures : []).map(text).filter(Boolean)),
    // 地名写法统一：{ 原写法: 统一后的写法 }，只改资产表和描述文字，台词/字幕列不动
    placeSpellings: new Map(Object.entries(map.place_spellings && typeof map.place_spellings === 'object' ? map.place_spellings : {})
      .map(([from, to]) => [text(from), text(to)]).filter(([from, to]) => from && to && from !== to)),
    review: (Array.isArray(map.review) ? map.review : []).map((item) => ({ target: text(item?.target), note: text(item?.note) })).filter((item) => item.target)
  };
}

// 校验合并表。problems = 必须补的（严格模式下不落地）；warnings = 提醒。
export function checkAssetMap(map, evidence) {
  const problems = [];
  const warnings = [];
  const names = map.characters.map((c) => c.name);
  if (!map.characters.length) problems.push('characters 是空的：先列出全剧正式人物');
  for (const c of map.characters) {
    const clash = c.aliases.filter((alias) => names.includes(alias));
    if (clash.length) problems.push(`「${c.name}」的别名和另一个人物的正式名相同: ${clash.join('、')}`);
  }
  for (const clash of propKindClashes(map.props)) {
    warnings.push(`道具「${clash.name}」${clash.joined_name ? '的名字把两样东西连在了一起' : ''}${Object.keys(clash.kinds).length >= 2 ? `把不同种类的东西并在了一起（${Object.entries(clash.kinds).map(([kind, list]) => `${kind}：${list.join('、')}`).join('；')}）` : ''}，核对后拆开`);
  }
  if (evidence.dossier) {
    for (const gap of nameCardFamilyGaps(evidence.dossier)) {
      warnings.push(`名牌「${gap.card}」（${gap.episode} ${gap.time}）里的「${gap.family}」在全剧对白和字幕里没出现过（出现过的：${gap.heard.slice(0, 8).join('、')}），手写体名牌常认错形近字，核对后统一`);
    }
  }
  const unsourcedAliases = findUnsourcedAliases(map, evidence.dossier);
  if (unsourcedAliases.length) warnings.push(`有 ${unsourcedAliases.length} 个别名在分析稿里找不到原文（台词/字幕/名牌/描述都没有），多半是自己拼的，核对后删掉：${unsourcedAliases.slice(0, 8).map((item) => `${item.name}「${item.alias}」`).join('、')}`);
  const reviewed = new Set(map.review.map((item) => item.target));
  const unresolved = [];
  for (const name of evidence.labels.keys()) {
    if (map.labels.get(name)?.to) continue;
    if (!name.startsWith('OBS_')) continue; // 已有名字的标签不填 = 保持原名
    unresolved.push(name);
    if (!reviewed.has(name)) problems.push(`观察编号没有归属: ${name}（填人物名；判断不了就留空并在 review 里写原因）`);
  }
  const unknown = [...map.labels.keys()].filter((key) => !evidence.labels.has(key) && map.labels.get(key).to);
  if (unknown.length) warnings.push(`合并表里有 ${unknown.length} 个标签在分析稿里不存在（已忽略）: ${unknown.slice(0, 5).join('、')}`);
  const target = new Map();
  for (const [key, value] of map.labels) if (value.to && evidence.labels.has(key)) target.set(key, value.to);
  // 归属到的名字不在 characters 里 = 单集功能角色；跨 3 集以上多半是正式人物没登记或名字写错了
  const localRoles = new Map();
  for (const [key, to] of target) {
    if (names.includes(to)) continue;
    if (!localRoles.has(to)) localRoles.set(to, new Set());
    for (const ep of evidence.labels.get(key).episodes) localRoles.get(to).add(ep);
  }
  for (const [role, eps] of localRoles) {
    if (eps.size >= 3) warnings.push(`「${role}」出现在 ${eps.size} 集但不在 characters 里：是正式人物就加进 characters，是名字写错了就改成和 characters 一字不差`);
  }
  const sceneOf = (ep, writing) => String(map.scenes?.[ep]?.[writing] || '').trim();
  const missingScenes = [];
  for (const [ep, bucket] of evidence.scenes) for (const writing of bucket.keys()) if (!sceneOf(ep, writing)) missingScenes.push({ episode: ep, writing });
  if (missingScenes.length) problems.push(`有 ${missingScenes.length} 个地点写法没有归到场景: ${missingScenes.slice(0, 8).map((item) => `${item.episode} ${item.writing}`).join('；')}${missingScenes.length > 8 ? ' …' : ''}`);
  const propOwner = new Map(); // `${写法}\u0000${集}` -> 道具名
  for (const prop of map.props) {
    for (const w of prop.writings) {
      const eps = evidence.props.get(w.text);
      if (!eps) { warnings.push(`道具「${prop.name}」的写法「${w.text}」在分析稿里不存在（已忽略）`); continue; }
      for (const ep of (w.episodes || [...eps.keys()])) {
        if (!eps.has(ep)) continue;
        const key = `${w.text}\u0000${ep}`;
        if (propOwner.has(key) && propOwner.get(key) !== prop.name) { problems.push(`道具写法「${w.text}」${ep} 同时归给了「${propOwner.get(key)}」和「${prop.name}」，用 episodes 分开`); continue; }
        propOwner.set(key, prop.name);
      }
    }
  }
  if (!map.props.length) warnings.push('props 是空的：没有整理关键道具');
  // 别名正好是这个人自己开口喊别人的称呼（台词开头喊「X，……」）→ 那是别人的名字，不是他的
  const selfVocativeAliases = [];
  for (const c of map.characters) {
    const called = new Set();
    for (const [label, entry] of evidence.labels) {
      if ((target.get(label) || label) !== c.name) continue;
      for (const line of entry.lines) { const word = String(line.text).match(VOCATIVE_RE)?.[1]; if (word) called.add(word); }
    }
    for (const alias of c.aliases) if (called.has(alias)) selfVocativeAliases.push({ name: c.name, alias });
  }
  if (selfVocativeAliases.length) warnings.push(`有 ${selfVocativeAliases.length} 个别名是这个人自己开口喊别人的称呼，不是他的名字，已不作别名使用：${selfVocativeAliases.map((item) => `${item.name}「${item.alias}」`).join('、')}`);
  const selfAddress = findSelfAddressRows(evidence.dossier, map, target);
  if (selfAddress.length) {
    warnings.push(`有 ${selfAddress.length} 句台词开头喊的名字正好是说话人自己，多半是把被喊的人标成了说话人；逐句核对后用 line_overrides 改正：${selfAddress.slice(0, 6).map((item) => `${item.episode} ${item.time} ${item.speaker}「${item.text.slice(0, 16)}」`).join('；')}${selfAddress.length > 6 ? ' …' : ''}`);
  }
  return { problems, warnings, names, target, localRoles, unresolved, missingScenes, propOwner, sceneOf, selfAddress, unsourcedAliases, selfVocativeAliases };
}

// 别名要有原文出处：整份分析稿（逐集表每一格 + 摘要）里一字不差找得到才算。只提示，不删。
export function findUnsourcedAliases(map, dossier) {
  if (!dossier) return [];
  const source = [...dossier.rows.map((row) => row.cells.join('|')), ...dossier.summaries.values()].join('\n');
  const out = [];
  for (const c of map.characters) for (const alias of c.aliases) if (!source.includes(alias)) out.push({ name: c.name, alias });
  return out;
}

// 台词开头喊的名字正好是（按合并表归属后的）说话人自己 → 多半把被喊的人标成了说话人
export function findSelfAddressRows(dossier, map, target) {
  if (!dossier) return [];
  const own = new Map(map.characters.map((c) => [c.name, new Set([c.name, ...c.aliases])]));
  const overridden = new Set(map.lineOverrides.map((item) => `${item.episode}\u0000${item.time}`));
  const out = [];
  for (const row of dossier.rows) {
    const c = row.cells;
    if (isEmpty(c[1]) || isEmpty(c[2]) || overridden.has(`${row.episode}\u0000${c[0]}`)) continue;
    const speaker = target.get(c[2]) || c[2];
    const called = String(c[1]).match(VOCATIVE_RE)?.[1];
    if (called && own.get(speaker)?.has(called)) out.push({ episode: row.episode, time: c[0], speaker, called, text: c[1], action: c[3] });
  }
  return out;
}

// 按合并表落地。只做精确替换；证据列逐行核对，变了就抛错、不产出任何内容。
// options.replace：只重建有整理结果的表（平台填表可能只填成一部分），默认三张都重建。
export function applyAssetMap(dossier, evidence, map, checked, { by = 'Agent', replace = {} } = {}) {
  const { names, target, localRoles, unresolved, propOwner, sceneOf } = checked;
  // 自己喊别人的称呼不算他的别名：不参与改名，也不列进别名栏（见 checkAssetMap 的 selfVocativeAliases）
  const notOwn = new Set((checked.selfVocativeAliases || []).map((item) => `${item.name}\u0000${item.alias}`));
  const ownAliases = (c) => c.aliases.filter((alias) => !notOwn.has(`${c.name}\u0000${alias}`));
  const rebuild = { characters: true, scenes: true, props: true, ...replace };
  const warnings = [];
  const relabel = (text) => String(text).replace(OBS_RE, (id) => target.get(id) || id);
  // 一个名字如果同时是别的人物的名字/别名的一部分（「乌兰」被标在鸭子上，但它也是「乌兰婆」的简称），
  // 描述文字里出现的这个词指的是谁无法确定：这种只按标签换说话人列和外观列，不在描述文字里替换。
  const ambiguousInText = (from, to) => map.characters.some((c) => c.name !== to && [c.name, ...c.aliases].some((word) => word.includes(from)));
  // 名字写法统一（照月→黎照月、何少→贺景川）：标签改名 + 人物别名，都换成正式名。
  // 描述词（少女）、和别人名字重叠的（乌兰⊂乌兰婆）、单字的，不在描述文字里替换。
  const renames = new Map([...target.entries()].filter(([from, to]) => !from.startsWith('OBS_') && from !== to && !ambiguousInText(from, to) && !DESCRIPTIVE_ALIAS_RE.test(from) && !isDescriptorAlias(from)));
  const localNames = new Set(localRoles.keys());
  for (const c of map.characters) {
    for (const alias of ownAliases(c)) {
      if (alias.length < 2 || GENERIC_ALIAS_RE.test(alias) || renames.has(alias) || localNames.has(alias) || names.includes(alias)) continue;
      // 头衔/物种/外貌式的别名（贺家少爷、董事长、飞蛾、螳螂、黄鸭、黑衣男子）在描述文字里是普通词，不替换：
      // 否则「向贺家少爷贺景川退婚」→「向贺景川贺景川退婚」、「巨型黄鸭」→「巨型乌兰」（2026-10-01 实测）。说话人列、外观列仍按标签改。
      if (DESCRIPTIVE_ALIAS_RE.test(alias) || DESCRIPTOR_ALIAS_RE.test(alias)) continue;
      if (ambiguousInText(alias, c.name) || [...target.entries()].some(([from, to]) => from === alias && to !== c.name)) continue;
      renames.set(alias, c.name);
    }
  }
  // 地名写法统一（填表的人确认过是同一个地方）：和人名改名一样只在资产表和描述文字里替换
  const placeSpellings = map.placeSpellings || new Map();
  for (const [from, to] of placeSpellings) if (!renames.has(from)) renames.set(from, to);
  const placeRename = (value) => [...placeSpellings.entries()].sort((a, b) => b[0].length - a[0].length).reduce((acc, [from, to]) => acc.split(from).join(to), String(value ?? ''));
  const nameRules = [...renames.entries()].sort((a, b) => b[0].length - a[0].length).map(([from, to]) => {
    const at = to.indexOf(from);
    const pre = at > 0 ? `(?<!${escapeRegExp(to.slice(0, at))})` : '';
    const post = at >= 0 && to.slice(at + from.length) ? `(?!${escapeRegExp(to.slice(at + from.length))})` : '';
    return { re: new RegExp(pre + escapeRegExp(from) + post, 'g'), to };
  });
  // 换完去掉紧挨着的重复（「贺家少爷贺景川」这类原文换完会变成「贺景川贺景川」）
  const dedupeNames = [...new Set([...renames.values()])].filter((name) => name.length >= 2);
  const rename = (text) => dedupeNames.reduce((acc, name) => acc.split(name + name).join(name), nameRules.reduce((acc, rule) => acc.replace(rule.re, rule.to), String(text)));
  // 出场集：说话人、外观列之外，动作描述里写到了正式名（别名已统一成正式名）也算这一集出场。
  // 例：「灵蛾“某某”飞出撞倒刺客」这一行外观列没记它，出场集就漏了。长名字先匹配，短名字不在长名字里重复算。
  // 只属于一个人的别名（婆婆、贺家少爷）写在动作描述里也算这个人出场——这些词不做全文替换，但出场要认
  const aliasOwners = new Map();
  for (const c of map.characters) for (const alias of ownAliases(c)) {
    if (alias.length < 2 || GENERIC_ALIAS_RE.test(alias)) continue;
    aliasOwners.set(alias, aliasOwners.has(alias) && aliasOwners.get(alias) !== c.name ? null : c.name);
  }
  const presenceWords = [
    ...[...names].filter((name) => name.length >= 2).map((name) => [name, name]),
    ...[...aliasOwners].filter(([alias, owner]) => owner && !names.includes(alias))
  ].sort((a, b) => b[0].length - a[0].length);
  const mentionedIn = (text) => {
    let rest = String(text);
    const found = new Set();
    for (const [word, owner] of presenceWords) if (rest.includes(word)) { found.add(owner); rest = rest.split(word).join('\u0000'); }
    return [...found];
  };
  const overrides = new Map(map.lineOverrides.map((item) => [`${item.episode}\u0000${item.time}`, item.speaker]));
  const usedOverrides = new Set();
  const stats = { rows: dossier.rows.length, speakers_changed: 0, line_overrides: 0, scene_cells_changed: 0 };
  const speakersBefore = new Set();
  const speakersAfter = new Set();
  const frozen = (cells, originalDialogue) => `${cells[0]}\u0000${originalDialogue ?? cells[1]}\u0000${cells.slice(5, cells.length - 3).join('\u0000')}`;
  const frozenBefore = dossier.rows.map((row) => frozen(row.cells));
  const charEpisodes = new Map();
  const seenIn = (name, ep) => { if (!charEpisodes.has(name)) charEpisodes.set(name, new Set()); charEpisodes.get(name).add(ep); };
  const sceneStat = new Map();
  const propStat = new Map();
  const dressing = new Map();
  const outLines = dossier.lines.slice();
  const outRows = [];
  for (const row of dossier.rows) {
    const c = row.cells.slice();
    const before = c[2];
    if (!isEmpty(before)) speakersBefore.add(before);
    const key = `${row.episode}\u0000${c[0]}`;
    if (overrides.has(key) && !isEmpty(before)) { c[2] = overrides.get(key); usedOverrides.add(key); stats.line_overrides += 1; }
    else if (before === '无') c[2] = 'none';
    else if (target.has(before)) c[2] = target.get(before);
    if (c[2] !== before) stats.speakers_changed += 1;
    const dialogueWasPlaceholder = c[1] === '无' && c[2] === 'none';
    if (dialogueWasPlaceholder) c[1] = 'none';
    if (!isEmpty(c[2])) { speakersAfter.add(c[2]); seenIn(c[2], row.episode); }
    c[3] = rename(relabel(c[3]));
    for (const name of mentionedIn(c[3])) seenIn(name, row.episode);
    const appearanceAt = c.length - 2;
    c[appearanceAt] = String(c[appearanceAt]).split(/(；|;)/).map((part) => {
      const at = part.search(/[=＝]/);
      if (at <= 0) return part;
      const who = part.slice(0, at).trim();
      const to = target.get(who) || who;
      seenIn(to, row.episode);
      return `${to}=${part.slice(at + 1)}`;
    }).join('');
    const writing = sceneWriting(c[4]);
    if (writing) {
      const canon = placeRename(sceneOf(row.episode, writing) || writing);
      const entry = sceneStat.get(canon) || { episodes: new Set(), shots: 0, writings: new Set(), merged: Boolean(sceneOf(row.episode, writing)) };
      entry.episodes.add(row.episode); entry.shots += 1; entry.writings.add(writing);
      sceneStat.set(canon, entry);
      if (canon !== writing) { c[4] = `${canon}（${c[4]}）`; stats.scene_cells_changed += 1; }
    }
    const counted = new Set();
    for (const prop of new Set(splitPropList(c[c.length - 3]))) {
      if (map.creatures.has(prop)) continue;
      const owner = propOwner.get(`${prop}\u0000${row.episode}`);
      if (!owner) { dressing.set(prop, (dressing.get(prop) || 0) + 1); continue; }
      const entry = propStat.get(owner) || { episodes: new Set(), shots: 0, writings: new Set() };
      entry.episodes.add(row.episode); entry.writings.add(prop);
      if (!counted.has(owner)) { entry.shots += 1; counted.add(owner); }
      propStat.set(owner, entry);
    }
    outRows.push({ cells: c, originalDialogue: dialogueWasPlaceholder ? '无' : null });
    outLines[row.index] = '| ' + c.join(' | ') + ' |';
  }
  const stale = [...overrides.keys()].filter((key) => !usedOverrides.has(key));
  if (stale.length) warnings.push(`line_overrides 有 ${stale.length} 条没对上镜头行（集号+时间码要和分析表一字不差）: ${stale.slice(0, 3).map((key) => key.replace('\u0000', ' ')).join('；')}`);
  const drift = frozenBefore.filter((value, i) => value !== frozen(outRows[i].cells, outRows[i].originalDialogue)).length;
  if (drift) throw new Error(`内部校验失败：有 ${drift} 行的台词/字幕/镜头列发生变化，未产出任何内容`);

  const observedCount = [...evidence.labels.keys()].filter((key) => key.startsWith('OBS_')).length;
  const sceneWritings = [...evidence.scenes.values()].reduce((n, bucket) => n + bucket.size, 0);
  // 合集里不带原标签（写作的人不需要看到观察编号）；原标签只留在资产合并表里备查。
  const characterTable = (withLabels) => [
    '## 二、人物表（资产映射用·已按剧情合并）', '',
    `> ${names.length} 个正式人物、${localRoles.size} 个单集功能角色；分析稿里的 ${observedCount} 个观察编号已按剧情归属。由${by}整理。`, '',
    '| 编号 | 正式名 | 身份 | 别名/称呼 | 出场 | 合并的标签数 | 备注 |', '| --- | --- | --- | --- | --- | --- | --- |',
    ...map.characters.map((c, i) => `| C${String(i + 1).padStart(2, '0')} | ${cellText(c.name)} | ${cellText(placeRename(c.role))} | ${cellText(placeRename(ownAliases(c).join('、')))} | ${episodeSpan([...(charEpisodes.get(c.name) || [])])} | ${[...target.values()].filter((to) => to === c.name).length} | ${cellText(placeRename(c.note))} |`),
    '', '### 单集功能角色（不跨集合并）', '', localRoles.size ? (withLabels ? '| 名称 | 出场 | 原标签 |' : '| 名称 | 出场 |') : '- 无',
    ...(localRoles.size ? [withLabels ? '| --- | --- | --- |' : '| --- | --- |', ...[...localRoles.entries()].map(([role, eps]) => `| ${cellText(role)} | ${episodeSpan([...eps])} |${withLabels ? ` ${[...target.entries()].filter(([, to]) => to === role).map(([key]) => key).join(' ')} |` : ''}`)] : []),
    ...(unresolved.length ? ['', `### 待核的观察编号（${unresolved.length} 个，原因见文末）`, '', unresolved.join(' ')] : []),
    ''
  ];
  const sceneNames = [...sceneStat.entries()].sort((a, b) => byEpisode([...a[1].episodes].sort(byEpisode)[0], [...b[1].episodes].sort(byEpisode)[0]) || b[1].shots - a[1].shots);
  const sceneTable = [
    '## 三、场景表（资产映射用·已按剧情合并）', '',
    `> ${sceneWritings} 种地点写法归并成 ${sceneNames.length} 个场景；同一地点的不同位置不再单列。`, '',
    '| 编号 | 场景 | 说明 | 出现集 | 镜头数 | 合并的原写法 |', '| --- | --- | --- | --- | --- | --- |',
    ...sceneNames.map(([name, s], i) => `| S${String(i + 1).padStart(2, '0')} | ${cellText(name)} | ${cellText(placeRename(map.sceneNotes[Object.keys(map.sceneNotes).find((key) => placeRename(key) === name) || name] || (s.merged ? '' : '未归并，保留原写法')))} | ${episodeSpan([...s.episodes])} | ${s.shots} | ${cellText([...s.writings].join('、'))} |`),
    ''
  ];
  const propTable = [
    '## 四、道具表（资产映射用·已按剧情合并）', '',
    `> 只列推动剧情的关键道具 ${propStat.size} 件；蛊虫和动物角色归人物表；其余 ${dressing.size} 种是陈设或一次性物件，镜头里需要时看逐集分析表的道具列。`, '',
    propStat.size ? '| 道具 | 剧情作用 | 出现集 | 镜头数 | 合并的原写法 |' : '- 未整理关键道具',
    ...(propStat.size ? ['| --- | --- | --- | --- | --- |', ...map.props.filter((p) => propStat.has(p.name)).map((p) => {
      const s = propStat.get(p.name);
      return `| ${cellText(placeRename(p.name))} | ${cellText(p.function)} | ${episodeSpan([...s.episodes])} | ${s.shots} | ${cellText([...s.writings].join('、'))} |`;
    })] : []),
    ''
  ];
  const reviewTable = map.review.length ? ['## 需人工复核', '', '| 对象 | 说明 |', '| --- | --- |', ...map.review.map((item) => `| ${cellText(item.target)} | ${cellText(item.note)} |`), ''] : [];
  let head = relabel(dossier.head)
    .replace(/^- 分工：[^\n]*$/m, `- 分工：逐集分析表是平台逐集看画面得到的客观记录；人物、场景、道具已由${by}按剧情合并整理，每行列出了合并进来的原写法。`)
    .replace(/^- 动笔前(必做|核对)[^\n]*$/m, '- 写作和洗稿都以本文件的资产表为准；发现合并错了的，按剧情改正后再统一全稿。')
    .replace(/^- 逐集分析表里 OBS_ 开头的[^\n]*$/m, '- 观察编号已按剧情归属到人物；拿不准的见文末「需人工复核」。')
    .replace(/^- .*仍显示 OBS_ 开头的是[^\n]*$/m, '- 观察编号已按剧情归属到人物；拿不准的见文末「需人工复核」。')
    .replace(/^- ⚠ 本次平台的人物身份审计没有完成[^\n]*\n/m, '');
  const swap = (text, startTitle, endTitle, block) => {
    const a = text.search(new RegExp(`^## ${startTitle}`, 'm'));
    const b = text.search(new RegExp(`^## ${endTitle}`, 'm'));
    return a >= 0 && b > a ? text.slice(0, a) + block.join('\n') + '\n' + text.slice(b) : text;
  };
  const variantAt = head.search(/^### 形象变体表/m);
  const variantEnd = head.search(/^## 三、/m);
  const variantBlock = variantAt >= 0 && variantEnd > variantAt ? rename(head.slice(variantAt, variantEnd)) : '';
  if (rebuild.characters) head = swap(head, '二、人物表', '三、', [...characterTable(false), ...(variantBlock ? [variantBlock.trimEnd(), ''] : [])]);
  if (rebuild.scenes) head = swap(head, '三、场景表', '四、', sceneTable);
  if (rebuild.props) head = swap(head, '四、道具表', '五、', propTable);
  // 剧集索引、事件表里的名字写法也统一（摘要是平台写的描述，不是原片台词）
  const indexAt = head.search(/^## 一、剧集索引/m);
  const tableAt = head.search(/^## 二、人物表/m);
  if (indexAt >= 0 && tableAt > indexAt) head = head.slice(0, indexAt) + rename(head.slice(indexAt, tableAt)) + head.slice(tableAt);
  const eventAt = head.search(/^## 五、主要事件表/m);
  if (eventAt >= 0) head = head.slice(0, eventAt) + rename(head.slice(eventAt));
  const body = outLines.join('\n');
  const residual = ((head + body).match(OBS_RE) || []).filter((id) => !unresolved.includes(id)).length;
  return {
    dossierText: head + body + (reviewTable.length ? '\n\n' + reviewTable.join('\n') : ''),
    mapMarkdown: [
      '# 资产合并表', '', ...characterTable(true), ...sceneTable, ...propTable,
      '## 逐标签归属明细', '', '| 原标签 | 归属 | 说明 |', '| --- | --- | --- |',
      ...[...target.entries()].map(([key, to]) => `| ${key} | ${cellText(to)} | ${cellText(map.labels.get(key)?.note)} |`), '',
      ...reviewTable
    ].join('\n'),
    relabel,
    rename,
    warnings,
    stats: {
      ...stats,
      speakers_before: speakersBefore.size,
      speakers_after: speakersAfter.size,
      characters: names.length,
      local_roles: localRoles.size,
      observed_labels: observedCount,
      unresolved_labels: unresolved.length,
      residual_observation_ids: residual,
      scene_writings: sceneWritings,
      scenes: sceneNames.length,
      unmerged_scene_writings: checked.missingScenes.length,
      key_props: propStat.size,
      set_dressing_writings: dressing.size
    }
  };
}
