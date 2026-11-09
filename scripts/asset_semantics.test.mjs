import test from 'node:test';
import assert from 'node:assert/strict';
import { collectAssets, lookTableJson, lookStylingTemplate, mergeLookStylings } from './asset_export.mjs';
import { semanticReviewTemplate, applyAssetSemanticReview, unionEpisodeSpans, assetImageSemantics } from './asset_semantics.mjs';

const episodes = [{ n: 1, text: '1-1 日 外 青云宗·高台前\n人物：内门弟子、陈众\n【形象】内门弟子=弟子；陈众=常态\n△众弟子站在高台前，陈众面向高台。' }];
const fresh = () => ({ characters: [{ name: '内门弟子', kind: 'human', looks: [] }],
  places: [{ name: '青云宗·高台前', episodes: '1–3、8', description: '高台前区域' }, { name: '青云宗·高台', episodes: '4–7、10', description: '同一高台空间' }],
  scenePlaces: { '1-1': '青云宗·高台前', '10-1': '青云宗·高台' }, scenes: {} });
const reviewed = table => {
  const review = semanticReviewTemplate(table, episodes);
  review.characters[0] = { name: '内门弟子', kind: 'group', memberScope: '同宗门多位不同弟子', reason: '原文为众弟子', sourceQuote: '众弟子站在高台前' };
  review.places = table.places.map(p => ({ name: p.name, canonicalName: '青云宗·高台', masterScene: '青云宗·高台', physicalSpace: 'space-1', region: p.name.endsWith('前') ? '台前' : '高台', reason: '同一高台空间的区域', sourceQuote: '陈众面向高台' }));
  return review;
};

test('explicit Agent kind survives export; names never classify a role locally', () => {
  const table = lookTableJson(collectAssets(episodes, { looks: [{ role: '内门弟子', variant: '弟子', kind: 'group' }] }));
  assert.equal(table.characters.find(c => c.name === '内门弟子').kind, 'group');
  assert.equal(table.characters.find(c => c.name === '陈众').kindSource, 'unreviewed');
  assert.equal(lookStylingTemplate(table).find(c => c.role === '陈众').kind, null);
  assert.equal(table.scenePlaces['1-1'], '青云宗·高台前');
  mergeLookStylings(table, [{ role: '陈众', variant: '常态', kind: 'human' }]);
  assert.equal(table.characters.find(c => c.name === '陈众').kindSource, 'agent');
});
test('explicit AI alias review applies exact mapping and full cross-episode union', () => {
  const table = fresh();
  assert.equal(applyAssetSemanticReview(table, reviewed(table), episodes).applied, true);
  assert.equal(table.characters[0].kind, 'group');
  assert.equal(table.places.length, 1);
  assert.equal(table.places[0].episodes, '1–8、10');
  assert.deepEqual(table.places[0].aliases, ['青云宗·高台前']);
  assert.equal(table.places[0].views.length, 2);
  assert.equal(table.scenePlaces['1-1'], '青云宗·高台');
  assert.equal(table.assetSemantics.status, 'ai_confirmed');
});
for (const [label, mutate] of [
  ['missing', () => undefined],
  ['stale source', r => ({ ...r, sourceHash: 'stale' })],
  ['unknown exact key', r => { r.places[0].name = '别处'; return r; }],
  ['invented quote', r => { r.characters[0].sourceQuote = '根本不存在的文本'; return r; }],
  ['cyclic alias', r => { r.places[1].canonicalName = r.places[0].name; return r; }],
  ['foreign master space', r => { r.places[1].physicalSpace = 'different'; return r; }],
]) test(`${label}: flagged for AI repair without rejecting or changing usable assets`, () => {
  const table = fresh(), before = structuredClone(table), result = applyAssetSemanticReview(table, mutate(reviewed(table)), episodes);
  assert.equal(result.applied, false);
  assert.equal(table.assetSemantics.status, 'needs_ai_review');
  delete table.assetSemantics;
  assert.deepEqual(table, before);
});
test('group image request avoids both single-person platform templates', () => {
  const body = assetImageSemantics({ type: 'look', kind: 'group', prompt: '门派弟子', memberScope: '男女混合的多位不同弟子' });
  assert.equal(body.kind, '群像'); assert.notEqual(body.prompt_template, 'client');
  assert.match(body.prompt, /普通人群各穿各的/);
  assert.deepEqual(assetImageSemantics({ type: 'look', kind: 'human' }), {});
});
test('EpisodeSpan supports string ranges, arrays and explicit union', () => {
  assert.equal(unionEpisodeSpans(['1–3、8', [4, 5], '6至7、10']), '1–8、10');
  assert.deepEqual(unionEpisodeSpans(['1–3', [5]], true), [1, 2, 3, 5]);
});
test('scene regions inherit the exact master image and space, never a style group guess', () => {
  const body = assetImageSemantics({ type: 'place', name: '台前', prompt: '地面局部', ref: { physicalSpace: 's1', region: '台前' }, masterRef: { name: '高台', description: '入口在左，台阶在右', image: { artifact_id: 'master-id' } } });
  assert.deepEqual(body.reference_artifact_ids, ['master-id']);
  assert.equal(body.physical_space, 's1'); assert.equal(body.master_scene, '高台');
  assert.match(body.prompt, /入口在左，台阶在右/);
  assert.deepEqual(assetImageSemantics({ type: 'place', name: '独立场景', prompt: '另一个房间' }), {});
});
