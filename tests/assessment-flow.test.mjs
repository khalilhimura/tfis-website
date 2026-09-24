import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { JSDOM } from 'jsdom';
import { initAssessment } from '../public/assessment/app.js';
const html=fs.readFileSync('public/assessment/index.html','utf8');
const bank=JSON.parse(fs.readFileSync('public/assessment/bank.json'));
const good=()=>({model:'jev-test',usage:{input_tokens:100,output_tokens:50},answers:{
  level_read:{type:'choice',choice:'on',confidence:.9},
  level_confidence_band:{type:'score',score:1.7,confidence:.9,legend:{'0':'weak','1':'moderate','2':'strong'}},
  pillar_focus:{type:'choice',choice:'agency',confidence:.9},
  review_status:{type:'choice',choice:'ok',confidence:.9},
  judgment_ready:{type:'noul',noul:.15}
}});
const settle=async()=>{for(let i=0;i<5;i++)await new Promise(resolve=>setImmediate(resolve));};
async function setup(t, responder=async()=>Response.json(good())) {
  const dom=new JSDOM(html,{url:'https://thefutureissolo.com/assessment/'});
  const calls=[];
  initAssessment({document:dom.window.document,window:dom.window,fetch:async(url,options)=>{
    if(url==='bank.json')return Response.json(bank);
    calls.push(JSON.parse(options.body));return responder(url,options);
  }});
  t.after(()=>dom.window.close());
  const click=id=>dom.window.document.getElementById(id).click();
  click('start-btn');await settle();
  const answer=()=>{dom.window.document.querySelectorAll('.assessment-option')[3].click();click('next-btn');};
  return {dom,doc:dom.window.document,calls,click,answer};
}
test('Begin, skip, select, Next, language toggle and Back keep the real flow coherent',async t=>{
  const a=await setup(t);const q=a.doc.querySelector('#question-text').textContent;
  a.click('skip-btn');assert.equal(a.doc.querySelector('#progress-current').textContent,'1');
  assert.notEqual(a.doc.querySelector('#question-text').textContent,q);
  a.doc.querySelector('.assessment-option').click();a.click('language-toggle');
  assert.equal(a.doc.querySelector('#next-btn').disabled,false);
  a.click('next-btn');assert.equal(a.doc.querySelector('#progress-current').textContent,'2');
  a.click('back-btn');assert.equal(a.doc.querySelector('#progress-current').textContent,'1');
  assert.equal(a.doc.querySelector('#next-btn').disabled,false);
});
test('15 real answers call Jev once; low Noul stays local; metadata and export include real response',async t=>{
  const a=await setup(t);for(let i=0;i<15;i++)a.answer();await settle();
  assert.equal(a.calls.length,1);assert.equal(a.calls[0].state.items_answered,15);
  assert.match(a.doc.querySelector('#jev-response').textContent,/jev-test/);
  assert.match(a.doc.querySelector('#jev-request').textContent,/response_evidence/);
  assert.match(a.doc.querySelector('#jev-outcome').textContent,/local/i);
  a.click('accept-result');assert.match(a.doc.querySelector('#result-status').textContent,/Accepted/);
  const saved=JSON.parse(a.dom.window.localStorage.getItem('ssa-cmm-assessment'));
  assert.equal(saved.results.locked,true);assert.equal(saved.validation.gate.judgmentReady,false);
  assert.equal(saved.metadata.response.model,'jev-test');
});
test('rejected evaluation has no accept path; Review revises and invalidates downstream results',async t=>{
  const a=await setup(t,async()=>{const r=good();r.answers.review_status.choice='needs_revision';return Response.json(r);});
  for(let i=0;i<15;i++)a.answer();await settle();
  assert.equal(a.doc.querySelector('#accept-result'),null);
  assert.match(a.doc.querySelector('#jev-outcome').textContent,/review/i);
  a.doc.querySelector('[data-revise="5"]').click();
  assert.equal(a.doc.querySelector('#progress-current').textContent,'6');
  for(let i=5;i<15;i++)a.answer();await settle();assert.equal(a.calls.length,2);
  assert.equal(a.calls[1].state.response_evidence.length,15);
});
test('late Jev response cannot overwrite a retake; repeated completion does not duplicate calls',async t=>{
  let resolve;const pending=new Promise(r=>resolve=r);const a=await setup(t,()=>pending);
  for(let i=0;i<15;i++)a.answer();assert.equal(a.calls.length,1);
  a.click('next-btn');assert.equal(a.calls.length,1);
  a.click('restart-btn');resolve(Response.json(good()));await settle();
  assert.equal(a.doc.querySelector('#intro-screen').classList.contains('hidden'),false);
  assert.equal(a.doc.querySelector('#jev-outcome').textContent,'');
  a.click('start-btn');await settle();assert.equal(a.doc.querySelector('#progress-current').textContent,'1');
});
test('network, malformed and HTTP failures remain unlocked and retain metadata for retry',async t=>{
  for(const responder of [async()=>{throw new DOMException('timed out','TimeoutError');},async()=>Response.json({answers:{}}),async()=>Response.json({error:'Service unavailable'},{status:503})]) {
    const a=await setup(t,responder);for(let i=0;i<15;i++)a.answer();await settle();
    assert.match(a.doc.querySelector('#result-status').textContent,/unvalidated/i);
    assert.equal(a.doc.querySelector('#accept-result'),null);
    assert.equal(a.doc.querySelector('#retry-jev').disabled,false);
    assert.match(a.doc.querySelector('#jev-request').textContent,/ssa-cmm-v1/);
  }
});
test('early finish does not infer levels for untouched pillars or call Jev',async t=>{
  const a=await setup(t);a.answer();a.click('finish-early-btn');await settle();
  assert.equal(a.calls.length,0);assert.match(a.doc.querySelector('#results-summary').textContent,/Not measured/);
  assert.match(a.doc.querySelector('#result-status').textContent,/Incomplete/);
});
test('storage failure is visible without blocking results or evaluation',async t=>{
  const a=await setup(t);a.dom.window.Storage.prototype.setItem=()=>{throw new Error('quota');};
  for(let i=0;i<15;i++)a.answer();await settle();
  assert.match(a.doc.querySelector('#save-status').textContent,/could not/i);
  assert.equal(a.calls.length,1);
});
test('bank failure has a retryable error and never fabricates a demo result',async t=>{
  const dom=new JSDOM(html,{url:'https://thefutureissolo.com/assessment/'});t.after(()=>dom.window.close());
  let calls=0;initAssessment({document:dom.window.document,window:dom.window,fetch:async()=>{calls++;return calls===1?new Response('missing',{status:404}):Response.json(bank);}});
  const doc=dom.window.document;doc.querySelector('#start-btn').click();await settle();
  assert.match(doc.querySelector('#bank-status').textContent,/retry/i);assert.equal(doc.querySelector('#intro-screen').classList.contains('hidden'),false);
  doc.querySelector('#start-btn').click();await settle();assert.equal(doc.querySelector('#progress-current').textContent,'1');
});
test('metadata renders hostile response strings as text; export contains exact request, response, and decision',async t=>{
  const reply=good();reply.model='<img src=x onerror=alert(1)>';
  const a=await setup(t,async()=>Response.json(reply));for(let i=0;i<15;i++)a.answer();await settle();
  assert.equal(a.doc.querySelector('#jev-metadata img'),null);assert.match(a.doc.querySelector('#jev-response').textContent,/<img/);
  let blob;a.dom.window.URL.createObjectURL=b=>{blob=b;return 'blob:assessment-test';};
  a.dom.window.URL.revokeObjectURL=()=>{};a.dom.window.HTMLAnchorElement.prototype.click=function(){};
  a.click('export-btn');const exported=JSON.parse(await blob.text());
  assert.deepEqual(exported.metadata.request,a.calls[0]);assert.deepEqual(exported.metadata.response,reply);
  assert.equal(exported.validation.gate.passed,true);assert.equal(exported.session.answered,15);
});
test('only the suggested bounded adjustment can be accepted and pillars keep their readings',async t=>{
  const a=await setup(t,async()=>{const r=good();r.answers.level_read.choice='over';return Response.json(r);});
  for(let i=0;i<15;i++)a.answer();await settle();
  a.click('accept-adjustment');const saved=JSON.parse(a.dom.window.localStorage.getItem('ssa-cmm-assessment'));
  assert.equal(saved.results.overallLevel,4);assert.equal(saved.results.claimedLevel,5);assert.ok(saved.results.pillars.every(p=>p.level===5));
});
test('revising an accepted result invalidates its persisted acceptance immediately',async t=>{
  const a=await setup(t);for(let i=0;i<15;i++)a.answer();await settle();a.click('accept-result');
  assert.equal(JSON.parse(a.dom.window.localStorage.getItem('ssa-cmm-assessment')).results.locked,true);
  a.doc.querySelector('[data-revise="5"]').click();
  const saved=JSON.parse(a.dom.window.localStorage.getItem('ssa-cmm-assessment'));
  assert.ok(!saved || !saved.results?.locked);
});
