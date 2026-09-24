import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { onRequestPost, onRequestOptions } from '../functions/api/jev.js';
import { createSession, nextItem, submitAnswer, buildAssessmentState, QUESTION_IDS } from '../public/assessment/core.js';
const bank=JSON.parse(fs.readFileSync('public/assessment/bank.json'));
function payload(){const s=createSession();for(let i=0;i<15;i++)submitAnswer(s,nextItem(bank,s,()=>0),3);return {state:buildAssessmentState(s,bank.schema),battery:'ssa-cmm-v1',questions:QUESTION_IDS};}
const answers={level_read:{type:'choice',choice:'on',confidence:.9},level_confidence_band:{type:'score',score:1.8,confidence:.9},pillar_focus:{type:'choice',choice:'agency',confidence:.9},review_status:{type:'choice',choice:'ok',confidence:.9},judgment_ready:{type:'noul',noul:.9}};
let ip=0;
function ctx(body=payload(),origin='https://thefutureissolo.com') {return {request:new Request('https://thefutureissolo.com/api/jev',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json','CF-Connecting-IP':`test-${++ip}`},body:typeof body==='string'?body:JSON.stringify(body)}),env:{TYPESAFE_API_KEY:'test-secret-never-return'}};}
test('proxy rejects malformed payloads before making provider requests',async t=>{
  let calls=0;t.mock.method(globalThis,'fetch',async()=>{calls++;return Response.json({answers});});
  for(const body of ['{',{}, {...payload(),battery:'unknown'}, {...payload(),questions:['unknown']}, {...payload(),state:{}}]) {
    const r=await onRequestPost(ctx(body));assert.equal(r.status,400);
  }
  assert.equal(calls,0);
});
test('proxy bounds request size and rejects foreign origins',async t=>{
  let calls=0;t.mock.method(globalThis,'fetch',async()=>{calls++;return Response.json({answers});});
  assert.equal((await onRequestPost(ctx(' '.repeat(70000)))).status,413);
  assert.equal((await onRequestPost(ctx(payload(),'https://example.net'))).status,403);assert.equal(calls,0);
  const options=await onRequestOptions(ctx(payload(),'https://example.net'));assert.equal(options.status,403);
});
test('proxy only sends structured evidence and returns useful non-secret metadata',async t=>{
  let upstream;t.mock.method(globalThis,'fetch',async(url,opts)=>{
    upstream={url,...opts};return Response.json({model:'jev-1.13.0',answers,usage:{input_tokens:100,output_tokens:50}});
  });
  const input=payload();input.state.essay='private text';input.headers={Authorization:'never-forward'};
  const response=await onRequestPost(ctx(input));assert.equal(response.status,200);const body=await response.json();
  const p=JSON.parse(upstream.body);assert.equal(p.model,'jev-latest');assert.equal(Object.keys(p.questions).length,5);
  assert.ok(!upstream.body.includes('private text'));assert.equal(upstream.redirect,'manual');assert.ok(upstream.signal);
  assert.equal(body.model,'jev-1.13.0');assert.deepEqual(body.answers,answers);assert.equal(body.usage.input_tokens,100);
  assert.deepEqual(body.metadata.upstream_payload,p);assert.equal(body.metadata.upstream_status,200);
  assert.equal(typeof body.metadata.request_id,'string');assert.equal(typeof body.latency_ms,'number');
  assert.ok(!JSON.stringify(body).includes('test-secret'));assert.equal(response.headers.get('Cache-Control'),'no-store');
});
test('proxy rejects inconsistent scores and incomplete evidence',async t=>{
  t.mock.method(globalThis,'fetch',async()=>{throw new Error('must not call provider');});
  const input=payload();input.state.pillar_scores.agency=0;assert.equal((await onRequestPost(ctx(input))).status,400);
  const incomplete=payload();incomplete.state.response_evidence.pop();assert.equal((await onRequestPost(ctx(incomplete))).status,400);
});
test('upstream redirects, malformed answers, and errors never become a successful validation or leak body',async t=>{
  for(const response of [new Response('secret provider body',{status:302,headers:{Location:'https://other.example'}}),Response.json({answers:{}}),new Response('test-secret-never-return',{status:500})]) {
    t.mock.method(globalThis,'fetch',async()=>response);
    const r=await onRequestPost(ctx());assert.equal(r.status,502);assert.ok(!(await r.text()).includes('test-secret'));
    t.mock.restoreAll();
  }
});
test('upstream timeout has a structured retryable failure',async t=>{
  t.mock.method(globalThis,'fetch',async()=>{throw new DOMException('timeout','TimeoutError');});
  const r=await onRequestPost(ctx());assert.equal(r.status,504);assert.equal((await r.json()).metadata.upstream_status,null);
});
test('bare answer responses remain compatible',async t=>{
  t.mock.method(globalThis,'fetch',async()=>Response.json(answers));
  const r=await onRequestPost(ctx());assert.equal(r.status,200);assert.deepEqual((await r.json()).answers,answers);
});
