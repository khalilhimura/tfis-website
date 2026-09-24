import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createSession, nextItem, submitAnswer, reviseAnswer, summarize, buildAssessmentState, evaluateGate, validateBank, normalizeAnswers } from '../public/assessment/core.js';
const bank = JSON.parse(fs.readFileSync('public/assessment/bank.json'));
const valid = () => ({
  level_read: { type: 'choice', choice: 'on', confidence: .9 },
  level_confidence_band: { type: 'score', score: 1.7, confidence: .9 },
  pillar_focus: { type: 'choice', choice: 'agency', confidence: .9 },
  review_status: { type: 'choice', choice: 'ok', confidence: .9 },
  judgment_ready: { type: 'noul', noul: .9 }
});
function complete(score) {
  const session = createSession();
  for(let n=0;n<15;n++) { const item=nextItem(bank,session,()=>0); submitAnswer(session,item,item.opts.findIndex(o=>o.s===score)); }
  return session;
}
test('production bank validates; malformed or incomplete banks cannot silently use demo items', () => {
  assert.equal(validateBank(bank), bank);
  assert.throws(()=>validateBank({items:bank.items.slice(0,2)}));
  assert.throws(()=>validateBank({...bank,items:[...bank.items,bank.items[0]]}));
  const bad=structuredClone(bank); bad.items[0].opts[0].s=NaN;
  assert.throws(()=>validateBank(bad));
});
test('skip redraws unseen item at same band and keeps progress and reading unchanged', () => {
  const s=createSession(); const first=nextItem(bank,s,()=>0);
  submitAnswer(s,first,null);
  const second=nextItem(bank,s,()=>0);
  assert.notEqual(first.id,second.id); assert.equal(second.band,3); assert.equal(second.pillar,'Agency');
  assert.equal(s.answered,0); assert.equal(s.bands.Agency,3); assert.equal(summarize(s).overallLevel,null);
});
test('bank exhaustion does not create fake evidence or change the skip band', () => {
  const s=createSession(); const small={items:bank.items.filter(x=>x.pillar==='Agency'&&x.band===3).slice(0,1)};
  submitAnswer(s,nextItem(small,s),null);
  assert.equal(nextItem(small,s),null); assert.equal(summarize(s).answered,0);
});
test('zero scores move the staircase down and top scores up, 3 readings per pillar', () => {
  const low=complete(0), high=complete(5);
  assert.deepEqual(low.responses.filter(r=>r.pillar==='Agency').map(r=>r.band),[3,2,1]);
  assert.deepEqual(high.responses.filter(r=>r.pillar==='Agency').map(r=>r.band),[3,4,5]);
  assert.equal(summarize(low).overallLevel,0); assert.equal(summarize(high).overallLevel,5);
  assert.ok(summarize(high).pillars.every(p=>p.answered===3));
  assert.equal(nextItem(bank,high),null);
});
test('score grain preserves L1 and L4 at the boundary bands', () => {
  assert.equal(summarize(complete(1)).overallLevel,1);
  assert.equal(summarize(complete(3)).overallLevel,4);
});
test('revision discards downstream answers and replays bands instead of retaining stale results', () => {
  const s=complete(5); const original=s.responses[5];
  reviseAnswer(s,5);
  assert.equal(s.answered,5); assert.equal(s.responses.length,5); assert.equal(s.bands.Agency,4);
  submitAnswer(s,bank.items.find(i=>i.id===original.itemId),0);
  assert.equal(s.answered,6); assert.equal(s.bands.Agency,3);
});
test('payload reports real trace, unanswered pillars as null, bounded scores, no question or answer text', () => {
  const s=createSession(); submitAnswer(s,nextItem(bank,s,()=>0),null);
  submitAnswer(s,nextItem(bank,s,()=>0),3);
  const p=buildAssessmentState(s,bank.schema);
  assert.equal(p.items_answered,1); assert.equal(p.items_skipped,1); assert.equal(p.pillar_scores.agency,3);
  assert.equal(p.pillar_scores.clarity,null); assert.match(p.band_trajectory,/agency:b3/);
  assert.equal(p.response_evidence[0].skipped,true); assert.equal(p.response_evidence[1].score,5);
  assert.ok(!JSON.stringify(p).includes(bank.items[0].q));
});
test('gate rejects missing, malformed, low-confidence and adverse answers', () => {
  assert.equal(evaluateGate({},3,true).passed,false);
  for (const id of ['review_status','level_read','level_confidence_band']) {
    for(const confidence of [undefined,null,NaN,-1,1.1,.74,'0.9']) {
      const a=valid(); a[id].confidence=confidence; assert.equal(evaluateGate(a,3,true).passed,false);
    }
  }
  for(const choice of ['needs_revision','escalate','bogus']) {
    const a=valid(); a.review_status.choice=choice; assert.equal(evaluateGate(a,3,true).passed,false);
  }
  const a=valid();a.level_confidence_band.score=.2;assert.equal(evaluateGate(a,3,true).passed,false);
  assert.equal(evaluateGate(valid(),3,false).passed,false);
});
test('Noul is a probability; readiness threshold is independent of a passed review', () => {
  const a=valid();a.judgment_ready.noul=.15;
  assert.equal(evaluateGate(a,3,true).passed,true);assert.equal(evaluateGate(a,3,true).judgmentReady,false);
  a.judgment_ready.noul=.75;assert.equal(evaluateGate(a,3,true).judgmentReady,true);
  a.judgment_ready.noul='1';assert.equal(evaluateGate(a,3,true).passed,false);
});
test('adjustments are clamped and offered only for a passing gate', () => {
  const a=valid();a.level_read.choice='over';assert.equal(evaluateGate(a,0,true).suggestedLevel,0);
  a.level_read.choice='under';assert.equal(evaluateGate(a,5,true).suggestedLevel,5);
  a.review_status.choice='needs_revision';assert.equal(evaluateGate(a,3,true).suggestedLevel,null);
});
test('response normalization accepts wrapped and bare answers but rejects invalid types and omissions',()=>{
  assert.deepEqual(normalizeAnswers({answers:valid()}),valid());
  assert.deepEqual(normalizeAnswers(valid()),valid());
  assert.throws(()=>normalizeAnswers({answers:{}}));
  const a=valid();a.level_confidence_band.type='choice';assert.throws(()=>normalizeAnswers({answers:a}));
});
test('production coverage is 20 variants per cell and payload preserves bank schema version',()=>{
  assert.equal(bank.items.length,500);
  for(const pillar of bank.pillars)for(let band=1;band<=5;band++)assert.equal(bank.items.filter(i=>i.pillar===pillar&&i.band===band).length,20);
  assert.equal(buildAssessmentState(createSession(),1).bank_schema,1);
});
