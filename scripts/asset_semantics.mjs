// AI/user decisions only. Local checks cover protocol, exact keys and source binding.
import { createHash } from 'node:crypto';

export const ASSET_SEMANTIC_REVIEW_FILE = '资产关系审核.json';
export const ASSET_SEMANTIC_PENDING_FILE = '资产关系待审核.json';
const KINDS = new Set(['human', 'group', 'creature']);
export const explicitAssetKind = value => KINDS.has(value) ? value : '';
// The platform's two character templates both force a single-person turnaround.
// Its generic asset path accepts explicit kind=群像 without either single-person template.
export function assetImageSemantics(item) {
  if (item.type === 'place' && item.masterRef) {
    return { prompt: `${item.prompt}\n同一物理空间母版：${item.masterRef.name}。本卡只展示区域：${item.ref?.region || item.name}。严格继承母版门窗、固定家具、台阶、地面材质与相对位置，只改变局部取景或视角，不另造一个空间。母版描述：${item.masterRef.description || ''}`,
      ...(item.masterRef.image?.artifact_id ? { reference_artifact_ids: [item.masterRef.image.artifact_id] } : {}),
      physical_space: item.ref?.physicalSpace || '', master_scene: item.masterRef.name };
  }
  if (item.type !== 'look' || item.kind !== 'group') return {};
  return { kind: '群像', prompt_template: 'group',
    prompt: `${item.prompt}\n群像资产图：同一画面可见多个不同成员，不是单人三视图或同一人的复制。成员范围：${item.memberScope || '严格按已提供的原文身份范围'}。成员脸型、年龄、身形、发型与服装细节有自然差异；同组织只统一身份标识和视觉基调，不强制同款同色；普通人群各穿各的。禁止单人主脸拼板、文字、字幕、标题、水印。`,
    asset_kind: 'group', member_scope: item.memberScope || '',
  };
}
const sourcePacket = (table, episodes) => ({
  sourceEpisodes: (episodes || []).map(e => ({ n: e.n, text: String(e.text || '') })),
  characters: (table.characters || []).map(c => ({ name: c.name, kind: c.kind, looks: c.looks })),
  places: table.places || [], scenes: table.scenes || {}, scenePlaces: table.scenePlaces || {},
});
export const semanticBinding = (table, episodes = []) => createHash('sha256').update(JSON.stringify(sourcePacket(table, episodes))).digest('hex');

export function semanticReviewTemplate(table, episodes = []) {
  return { schema: 'chenyu.asset-semantics/v1', sourceHash: semanticBinding(table, episodes),
    input: sourcePacket(table, episodes),
    characters: (table.characters || []).map(c => ({ name: c.name, kind: null, memberScope: '', reason: '', sourceQuote: '' })),
    places: (table.places || []).map(p => ({ name: p.name, canonicalName: p.name, physicalSpace: '', masterScene: '', region: '', reason: '', sourceQuote: '' })),
  };
}

/** Episode spans are structured source data, not creative equivalence. */
export function unionEpisodeSpans(values, arrayOutput = false) {
  const episodes = new Set();
  for (const value of values) for (const part of (Array.isArray(value) ? value : String(value || '').split(/[、,，;；\s]+/))) {
    const match = String(part).match(/^(\d+)(?:[-–—~至](\d+))?$/);
    if (!match) continue;
    const a = Number(match[1]), b = Number(match[2] || match[1]);
    for (let n = Math.min(a, b); n <= Math.max(a, b) && n - Math.min(a, b) < 2000; n++) if (n > 0) episodes.add(n);
  }
  const sorted = [...episodes].sort((a, b) => a - b);
  if (arrayOutput) return sorted;
  const ranges = [];
  for (let i = 0; i < sorted.length; i++) {
    let j = i;
    while (j + 1 < sorted.length && sorted[j + 1] === sorted[j] + 1) j++;
    ranges.push(i === j ? String(sorted[i]) : `${sorted[i]}–${sorted[j]}`);
    i = j;
  }
  return ranges.join('、');
}

/** Missing, stale or invalid review preserves the usable table: flagged for AI repair. */
export function applyAssetSemanticReview(table, review, episodes = []) {
  const pending = message => {
    table.assetSemantics = { status: 'needs_ai_review', warnings: [message] };
    return { applied: false, warnings: [message] };
  };
  if (!review) return pending('资产关系待AI核对；字段齐全不等于语义已确认，保留现有资产');
  if (review.schema !== 'chenyu.asset-semantics/v1' || review.sourceHash !== semanticBinding(table, episodes)) return pending('资产关系审核协议或来源指纹不匹配，保留现有资产并交AI重核');
  const warnings = [], characters = table.characters || [], places = table.places || [];
  const sourceText = episodes.length ? episodes.map(e => String(e.text || '')).join('\n') : JSON.stringify(sourcePacket(table, []));
  const exactMap = (rows, source, label) => {
    const names = new Set(source.map(x => x.name)), map = new Map();
    if (!Array.isArray(rows) || rows.length !== source.length) { warnings.push(`${label}审核项不齐`); return map; }
    for (const row of rows) {
      if (!row || !names.has(row.name) || map.has(row.name) || !String(row.reason || '').trim()) { warnings.push(`${label}准确键、重复项或理由无效`); continue; }
      if (!String(row.sourceQuote || '').trim() || !sourceText.includes(row.sourceQuote)) warnings.push(`${label}来源引文不在本次原文中`);
      map.set(row.name, row);
    }
    return map;
  };
  const byCharacter = exactMap(review.characters, characters, '角色'), byPlace = exactMap(review.places, places, '场景');
  for (const row of byCharacter.values()) if (!explicitAssetKind(row.kind) || (row.kind === 'group' && !String(row.memberScope || '').trim())) warnings.push('角色类型或群体成员范围未由AI明确给出');
  for (const row of byPlace.values()) {
    const canonical = byPlace.get(row.canonicalName), master = byPlace.get(row.masterScene);
    if (!canonical || canonical.canonicalName !== row.canonicalName || !master || master.masterScene !== row.masterScene || !String(row.physicalSpace || '').trim() || master.physicalSpace !== row.physicalSpace || canonical.physicalSpace !== row.physicalSpace) warnings.push('场景准确目标、母版或物理空间关系无效');
  }
  if (warnings.length) return pending([...new Set(warnings)].join('；'));

  for (const c of characters) {
    const decision = byCharacter.get(c.name);
    c.kind = decision.kind;
    c.kindSource = 'agent_review';
    c.memberScope = String(decision.memberScope || '');
    c.identityEvidence = { reason: decision.reason, sourceQuote: decision.sourceQuote };
  }
  const merged = new Map();
  for (const p of places) {
    const decision = byPlace.get(p.name), key = decision.canonicalName;
    const root = places.find(p => p.name === key), rootDecision = byPlace.get(key);
    if (!merged.has(key)) merged.set(key, { ...root, aliases: Array.isArray(root.aliases) ? [...root.aliases] : [], views: [],
      physicalSpace: rootDecision.physicalSpace, masterScene: byPlace.get(rootDecision.masterScene).canonicalName, region: rootDecision.region || '' });
    const target = merged.get(key);
    if (p.name !== key) target.aliases.push(p.name);
    target.aliases.push(...(Array.isArray(p.aliases) ? p.aliases : []));
    target.views.push({ name: p.name, region: decision.region || '', description: p.description || '', sourceQuote: decision.sourceQuote, reason: decision.reason });
    target.episodes = unionEpisodeSpans([target.episodes, p.episodes], Array.isArray(root.episodes));
    target.times = [...new Set([...(target.times || []), ...(p.times || [])])];
  }
  table.places = [...merged.values()].map(p => ({ ...p, aliases: [...new Set(p.aliases)].filter(name => name !== p.name) }));
  // No script/shot rewriting: preserve the source scene name and apply only its explicit alias target.
  table.scenePlaces = Object.fromEntries(Object.entries(table.scenePlaces || {}).map(([id, name]) => {
    const decision = byPlace.get(name);
    return [id, decision ? decision.canonicalName : name];
  }));
  table.assetSemantics = { status: 'ai_confirmed', sourceHash: review.sourceHash, characters: review.characters, places: review.places };
  return { applied: true, warnings: [] };
}
