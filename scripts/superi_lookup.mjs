#!/usr/bin/env node
// SUPER-I 运镜/画面方法论检索（chenyu-gate 可选配件）。
// 从本机 SUPER-I 知识库中按剧本文本/关键词检索最相关的方法论摘要，
// 供 Agent 在写【画面】【运镜】【转场】分镜层之前参考。
//
// 知识库文件不随本 Skill 分发（属私有资产）。查找顺序：
//   1. env SUPERI_PROMPT_KNOWLEDGE_PATH
//   2. E:\pump2.0\relay-api-server\data\superi-prompt-knowledge.json
// 找不到文件时静默提示并退出 0（不阻塞写作流程）。
//
// 用法：
//   node superi_lookup.mjs --file 剧本.txt [--top 6] [--cat 运镜]
//   node superi_lookup.mjs --query "夜戏 追逐 运镜 光影" [--top 6]
const args = process.argv.slice(2);
const arg = (name, fallback = '') => {
  const i = args.indexOf('--' + name);
  return i >= 0 && args[i + 1] !== undefined ? args[i + 1] : fallback;
};

import fs from 'node:fs';
import path from 'node:path';

const candidates = [
  process.env.SUPERI_PROMPT_KNOWLEDGE_PATH,
  'E:/pump2.0/relay-api-server/data/superi-prompt-knowledge.json'
].filter(Boolean);
const knowledgePath = candidates.find((p) => { try { return fs.existsSync(p); } catch { return false; } });
if (!knowledgePath) {
  console.log('SUPER-I 知识库未找到（设 SUPERI_PROMPT_KNOWLEDGE_PATH 指向 superi-prompt-knowledge.json），跳过检索。');
  process.exit(0);
}

let bundle;
try { bundle = JSON.parse(fs.readFileSync(knowledgePath, 'utf8')); }
catch (e) { console.error('知识库读取失败: ' + e.message); process.exit(1); }
const articles = Array.isArray(bundle) ? bundle : (bundle.articles || []);
if (!articles.length) { console.log('知识库为空，跳过。'); process.exit(0); }

// 维度词表：剧本里出现左侧任一触发词，就为该维度加检索权重
const DIMENSIONS = {
  运镜: ['运镜', '镜头', '推', '拉远', '摇', '横移', '跟拍', '甩', '长镜头', '景别', '特写', '中景', '全景', '近景', '机位', '俯拍', '仰拍'],
  转场: ['转场', '衔接', '硬切', '切换', '声音先入', '匹配'],
  光影: ['光影', '逆光', '剪影', '灯光', '明暗', '光源', '布光', '暗处', '阴影'],
  构图: ['构图', '前景', '透视', '框', '对称', '遮挡'],
  表演: ['表演', '神态', '反应', '动作设计', '时间线'],
  一致性: ['一致性', '场景一致', '角色一致', '接戏']
};

const query = arg('query', '');
const file = arg('file', '');
const top = Math.max(1, Number(arg('top', '6')) || 6);
const catFilter = arg('cat', '');

let sourceText = query;
if (file) {
  try { sourceText += '\n' + fs.readFileSync(path.resolve(file), 'utf8'); }
  catch (e) { console.error('剧本读取失败: ' + e.message); process.exit(1); }
}
if (!sourceText.trim()) {
  console.log('用法: node superi_lookup.mjs --file 剧本.txt | --query "关键词"  [--top N] [--cat 类别]');
  process.exit(0);
}

// 命中的维度 -> 该维度全部触发词都参与文章打分
const activeTerms = new Set();
for (const [dim, terms] of Object.entries(DIMENSIONS)) {
  if (terms.some((t) => sourceText.includes(t))) terms.forEach((t) => activeTerms.add(t));
}
// query 的显式分词（空格/逗号切）权重更高
const queryTerms = query.split(/[\s,，、]+/).filter((t) => t.length >= 2);

const fieldWeights = [['title', 3], ['use_when', 2], ['what_it_teaches', 2], ['agent_takeaway', 2], ['category', 2], ['core_workflow', 1], ['content_digest', 1]];
const scored = articles.map((a) => {
  if (catFilter && !String(a.category || '').includes(catFilter)) return { a, score: -1 };
  let score = 0;
  for (const [field, w] of fieldWeights) {
    const text = String(a[field] || '');
    if (!text) continue;
    for (const t of queryTerms) if (text.includes(t)) score += w * 3;
    for (const t of activeTerms) if (text.includes(t)) score += w;
  }
  return { a, score };
}).filter((x) => x.score > 0).sort((x, y) => y.score - x.score).slice(0, top);

if (!scored.length) { console.log('没有命中的方法论条目（换 --query 关键词试试）。'); process.exit(0); }

console.log(`# SUPER-I 检索结果（${scored.length}/${articles.length} 条，供分镜层设计参考）`);
for (const { a, score } of scored) {
  console.log(`\n── [${a.category}] ${a.title}  (score ${score})`);
  if (a.use_when) console.log('  何时用: ' + String(a.use_when).slice(0, 120));
  if (a.agent_takeaway) console.log('  要点: ' + String(a.agent_takeaway).slice(0, 160));
  if (a.what_it_teaches) console.log('  教什么: ' + String(a.what_it_teaches).slice(0, 120));
}
console.log('\n提示：以上是方法论摘要；落笔时仍以剧本格式标准与词条预算（每集≤3次高光词条、长镜头≤1次）为准。');
