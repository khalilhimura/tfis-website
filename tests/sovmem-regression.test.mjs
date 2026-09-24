import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { JSDOM } from 'jsdom';

const root = new URL('../public/sovmem-grok/', import.meta.url);
const key = 'sovmem-grok-records';
const input = { type: 'decision', title: 'Release plan', body: 'Release after review.', provenance: 'Review notes', stop_rule: 'Stop if checks fail', review_status: 'unreviewed' };
const response = () => ({ latency_ms: 42, answers: {
  record_type: { type: 'choice', choice: 'decision', confidence: 1, probabilities: { claim: 0, decision: 1, correction: 0, noise: 0 } },
  has_stop_rule: { type: 'noul', noul: .99 },
  provenance_strength: { type: 'score', score: 2, confidence: 1, probabilities: { 0: 0, 1: 0, 2: 1 } },
  review_status: { type: 'choice', choice: 'ok', confidence: 1, probabilities: { ok: 1, needs_revision: 0, escalate: 0 } },
  load_risk: { type: 'score', score: 0, confidence: 1, probabilities: { 0: 1, 1: 0, 2: 0 } }
} });
const storedRecord = (overrides = {}) => ({ ...input, id: 'record-1', created_at: '2026-09-24T00:00:00.000Z', updated_at: '2026-09-24T00:00:00.000Z', revisions: [], ...overrides });

async function app(t, { records = [], fetch } = {}) {
  const dom = new JSDOM(fs.readFileSync(new URL('index.html', root), 'utf8'), { url: 'http://localhost/sovmem-grok/', runScripts: 'outside-only' });
  t.after(() => dom.window.close());
  const w = dom.window;
  w.alerts = [];
  w.alert = text => w.alerts.push(text);
  w.confirm = () => true;
  w.fetch = fetch || (async () => new Response(JSON.stringify(response()), { status: 200 }));
  w.AbortSignal = AbortSignal;
  // JSZip uses setImmediate when available; jsdom does not implement MessageEvent.source.
  w.setImmediate = setImmediate;
  w.clearImmediate = clearImmediate;
  w.localStorage.setItem(key, JSON.stringify({ version: 1, records }));
  await new Promise(resolve => w.addEventListener('load', resolve));
  if (fs.existsSync(new URL('core.js', root))) w.eval(fs.readFileSync(new URL('core.js', root), 'utf8'));
  w.eval(fs.readFileSync(new URL('app.js', root), 'utf8'));
  return w;
}
function fill(w, data = input) {
  w.sovmem.newRecord();
  w.selectType(data.type);
  for (const field of ['title', 'body', 'provenance', 'stop_rule', 'review_status']) w.document.getElementById(`record-${field.replaceAll('_', '-')}`).value = data[field];
}
function saved(w) { return JSON.parse(w.localStorage.getItem(key)).records; }
function audit(raw) { return { response: raw, payload: input, status: 200, error: null }; }

test('confident adverse judgments and incomplete answers require a gate', async t => {
  const w = await app(t);
  for (const [field, value] of [['record_type', 'noise'], ['record_type', 'claim'], ['review_status', 'escalate'], ['review_status', 'needs_revision']]) {
    const r = response(); r.answers[field].choice = value;
    assert.equal(w.shouldShowValidationGate(audit(r), input), true, `${field}: ${value}`);
  }
  assert.equal(w.shouldShowValidationGate(audit({ answers: {} }), input), true);
});

test('three-level scores, Noul probability, and invalid numeric values are handled correctly', async t => {
  const w = await app(t);
  assert.equal(w.shouldShowValidationGate(audit(response()), input), false);
  for (const [field, property, value] of [['provenance_strength', 'score', 0], ['load_risk', 'score', 2], ['load_risk', 'score', '0'], ['load_risk', 'confidence', null], ['has_stop_rule', 'noul', .5], ['has_stop_rule', 'noul', 0]]) {
    const r = response(); r.answers[field][property] = value;
    assert.equal(w.shouldShowValidationGate(audit(r), input), true, `${field}: ${value}`);
  }
  const r = response(); r.answers.record_type.choice = 'claim'; r.answers.has_stop_rule.noul = 0;
  assert.equal(w.shouldShowValidationGate(audit(r), { ...input, type: 'claim', stop_rule: 'none' }), false);
});

test('a failed request remains inspectable and the next request retries', async t => {
  let count = 0;
  const w = await app(t, { fetch: async () => ++count === 1 ? new Response('{"error":"busy"}', { status: 503 }) : new Response(JSON.stringify(response())) });
  const first = await w.validateWithJev(input);
  assert.equal(first.status, 503);
  assert.equal(first.response.error, 'busy');
  assert.ok(first.error);
  const second = await w.validateWithJev(input);
  assert.equal(second.status, 200);
  assert.equal(second.response.answers.review_status.choice, 'ok');
});

test('successful save persists exact API metadata and renders an expandable safe JSON section', async t => {
  const raw = response(); raw.extra = '<img src=x onerror=alert(1)>';
  let sent;
  const w = await app(t, { fetch: async (url, options) => { sent = JSON.parse(options.body); return new Response(JSON.stringify(raw)); } });
  fill(w);
  await w.saveRecord();
  const record = saved(w)[0];
  assert.ok(record.jev_evaluation);
  assert.deepEqual(record.jev_evaluation.payload, sent);
  assert.deepEqual(record.jev_evaluation.response, raw);
  assert.equal(record.review_status, 'unreviewed');
  w.sovmem.viewRecord(record.id);
  const details = w.document.querySelector('#detail-content details');
  assert.ok(details);
  assert.match(details.textContent, /Jev API/);
  assert.match(details.textContent, /Release plan/);
  assert.match(details.textContent, /latency_ms/);
  assert.equal(details.querySelector('img'), null);
});

test('duplicate clicks and cancellation cannot save stale records', async t => {
  const releases = [];
  const w = await app(t, { fetch: () => new Promise(resolve => { releases.push(() => resolve(new Response(JSON.stringify(response())))); }) });
  fill(w);
  const pending = w.saveRecord();
  const duplicate = w.saveRecord();
  w.cancelEdit();
  releases.forEach(release => release());
  await pending; await duplicate;
  assert.equal(saved(w).length, 0);
});

test('changing type preserves new drafts and works on existing records', async t => {
  const w = await app(t, { records: [storedRecord()] });
  fill(w);
  w.document.getElementById('change-type-btn').click();
  w.selectType('claim');
  assert.equal(w.document.getElementById('record-title').value, 'Release plan');
  w.sovmem.viewRecord('record-1'); w.sovmem.editCurrentRecord();
  w.document.getElementById('change-type-btn').click();
  assert.equal(w.document.getElementById('type-picker').classList.contains('hidden'), false);
});

test('storage failure does not mutate in-memory records', async t => {
  const w = await app(t);
  w.Storage.prototype.setItem = () => { throw new Error('quota'); };
  assert.equal(w.createRecord(input), null);
  w.sovmem.backToList();
  assert.equal(w.document.querySelectorAll('#records-list li').length, 0);
});

test('exports use unique safe paths and log links point to those paths', async t => {
  const a = storedRecord({ title: 'Same title' }), b = storedRecord({ id: 'record-2', title: 'Same title' });
  const w = await app(t, { records: [a, b] });
  assert.notEqual(w.generateSlug(a.title, a.id), w.generateSlug(b.title, b.id));
  assert.match(w.generateLogMd(), new RegExp(`decisions/${w.generateSlug(a.title, a.id)}\\.md`));
  assert.match(w.generateLogMd(), new RegExp(`decisions/${w.generateSlug(b.title, b.id)}\\.md`));
});

test('YAML strings preserve backslashes and newlines without creating metadata keys', async t => {
  const w = await app(t);
  const text = w.generateOKFConcept(storedRecord({ title: 'Path C:\\notes\nstatus: stable' }));
  assert.match(text, /title: "Path C:\\\\notes\\nstatus: stable"/);
});

test('WebMCP refresh reloads persisted records instead of stale in-memory state', async t => {
  const w = await app(t);
  w.localStorage.setItem(key, JSON.stringify({ version: 1, records: [storedRecord()] }));
  w.sovmem.refresh();
  assert.equal(w.document.querySelectorAll('#records-list li').length, 1);
});

test('partial updates retain required fields', async t => {
  const w = await app(t, { records: [storedRecord()] });
  w.updateRecord('record-1', { title: 'Revised title' }, 'Clarify');
  assert.equal(saved(w)[0].body, input.body);
  assert.equal(saved(w)[0].type, 'decision');
});

test('unavailable evaluation requires explicit save and remains needs-revision', async t => {
  const w = await app(t, { fetch: async () => { throw new TypeError('offline'); } });
  fill(w, { ...input, review_status: 'reviewed' }); await w.saveRecord();
  assert.equal(saved(w).length, 0);
  assert.equal(w.document.getElementById('jev-modal').classList.contains('hidden'), false);
  w.sovmem.confirmSaveNeedsRevision();
  assert.equal(saved(w)[0].review_status, 'needs-revision');
  assert.match(saved(w)[0].jev_evaluation.error, /offline/);
});

function bridge(w) {
  const tools = new Map();
  w.WebMCP = class {
    registerTool(name, description, inputSchema, handler) { tools.set(name, { name, description, inputSchema, handler }); }
    registerResource() {}
    listTools() { return [...tools.values()]; }
  };
  w.eval(fs.readFileSync(new URL('webmcp-bridge.js', root), 'utf8'));
  return tools;
}

test('MCP capture uses the same evaluation gate and updates the visible list', async t => {
  const r = response(); r.answers.review_status.choice = 'escalate';
  const w = await app(t, { fetch: async () => new Response(JSON.stringify(r)) });
  const tools = bridge(w);
  await tools.get('sovmem_capture').handler({ ...input, review_status: 'reviewed' });
  assert.equal(saved(w)[0].review_status, 'needs-revision');
  assert.equal(saved(w)[0].jev_evaluation.response.answers.review_status.choice, 'escalate');
  assert.equal(w.document.querySelectorAll('#records-list li').length, 1);
});

test('MCP invalid input cannot create records or inject markup; deletion needs boolean true', async t => {
  const w = await app(t, { records: [storedRecord()] });
  const tools = bridge(w);
  const result = await tools.get('sovmem_capture').handler({ ...input, type: '<img src=x onerror=alert(1)>' });
  assert.equal(result.isError, true);
  assert.equal(saved(w).length, 1);
  await tools.get('sovmem_delete').handler({ id: 'record-1', confirm: 'false' });
  assert.equal(saved(w).length, 1);
});

test('MCP revision preserves fields and stores an evaluation for the new content', async t => {
  const w = await app(t, { records: [storedRecord()] });
  const tools = bridge(w);
  await tools.get('sovmem_revise').handler({ id: 'record-1', body: 'Revised body' });
  assert.equal(saved(w)[0].jev_evaluation.payload.body, 'Revised body');
  assert.equal(saved(w)[0].title, 'Release plan');
});

async function importFile(w, records) {
  w.handleImportFile({ target: { files: [new w.File([JSON.stringify({ version: 1, records })], 'records.json')], value: '' } });
  await until(() => w.alerts.length > 0);
}
async function until(condition) {
  for (let i = 0; i < 100; i++) { if (condition()) return; await new Promise(r => setTimeout(r, 5)); }
  assert.fail('Expected UI event did not occur');
}

test('import rejects malformed data atomically and deduplicates IDs within a file', async t => {
  const w = await app(t);
  await importFile(w, [storedRecord(), storedRecord({ id: 'bad', body: null })]);
  assert.equal(saved(w).length, 0);
  w.alerts.length = 0;
  await importFile(w, [storedRecord(), storedRecord()]);
  assert.equal(saved(w).length, 1);
});

test('corrupt storage is preserved and stale tabs cannot overwrite newer data', async t => {
  const w = await app(t);
  w.localStorage.setItem(key, '{broken');
  w.sovmem.refresh();
  assert.equal(w.createRecord(input), null);
  assert.equal(w.localStorage.getItem(key), '{broken');
  w.localStorage.setItem(key, JSON.stringify({ version: 1, records: [] }));
  w.sovmem.refresh();
  w.localStorage.setItem(key, JSON.stringify({ version: 1, records: [storedRecord()] }));
  assert.equal(w.createRecord(input), null);
  assert.equal(saved(w)[0].id, 'record-1');
});

test('editing a draft during evaluation cannot save a result for older text', async t => {
  let release;
  const w = await app(t, { fetch: () => new Promise(resolve => { release = () => resolve(new Response(JSON.stringify(response()))); }) });
  fill(w);
  const pending = w.saveRecord();
  w.document.getElementById('record-body').value = 'New body';
  release(); await pending;
  assert.equal(saved(w).length, 0);
  assert.match(w.alerts[0], /draft changed/i);
});

test('export gates adverse outcomes and cancellation produces no download', async t => {
  const r = response(); r.answers.has_stop_rule.noul = 0;
  const w = await app(t, { records: [storedRecord()], fetch: async () => new Response(JSON.stringify(r)) });
  w.eval(fs.readFileSync(new URL('jszip.min.js', root), 'utf8'));
  let downloads = 0;
  w.URL.createObjectURL = () => { downloads++; return 'blob:test'; };
  const pending = w.exportOKF();
  await until(() => !!w.document.getElementById('export-cancel-btn'));
  const modal = w.document.getElementById('jev-export-modal');
  assert.match(modal.textContent, /missing a clear stop rule/);
  assert.ok(modal.querySelector('details'));
  w.document.getElementById('export-cancel-btn').click();
  await pending;
  assert.equal(downloads, 0);
});

test('ZIP contains every same-title record plus matching logs and evaluation metadata', async t => {
  const w = await app(t, { records: [storedRecord({ title: 'Same title', revisions: [{ timestamp: '2026-09-24T01:00:00Z', reason: 'Edit', fields: ['body'] }] }), storedRecord({ id: 'record-2', title: 'Same title' })] });
  w.eval(fs.readFileSync(new URL('jszip.min.js', root), 'utf8'));
  let blob;
  w.URL.createObjectURL = b => { blob = b; return 'blob:test'; };
  w.URL.revokeObjectURL = () => {};
  w.HTMLAnchorElement.prototype.click = () => {};
  const pending = w.exportOKF();
  await until(() => !!blob || w.alerts.length > 0);
  await pending;
  assert.ok(blob);
  const bytes = await new Promise(resolve => { const reader = new w.FileReader(); reader.onload = () => resolve(reader.result); reader.readAsArrayBuffer(blob); });
  const zip = await w.JSZip.loadAsync(bytes);
  assert.ok(zip.file('decisions/same-title__record-1.md'));
  assert.ok(zip.file('decisions/same-title__record-2.md'));
  const log = await zip.file('log.md').async('string');
  assert.match(log, /decisions\/same-title__record-2.md/);
  const evaluations = JSON.parse(await zip.file('jev-evaluations.json').async('string'));
  assert.equal(evaluations.length, 2);
  assert.equal(evaluations[1].evaluation.payload.title, 'Same title');
});

test('vendored WebMCP exposes its browser constructor and registers the actual bridge', async t => {
  const w = await app(t);
  w.eval(fs.readFileSync(new URL('webmcp.js', root), 'utf8'));
  assert.equal(typeof w.WebMCP, 'function');
  w.eval(fs.readFileSync(new URL('webmcp-bridge.js', root), 'utf8'));
  assert.ok(w.document.querySelector('[data-webmcp-widget]'));
  assert.match(w.document.body.textContent, /sovmem_capture/);
});

test('search and filter controls do not erase a draft in progress', async t => {
  const w = await app(t);
  fill(w);
  const search = w.document.getElementById('search');
  search.value = 'term'; search.dispatchEvent(new w.Event('input'));
  assert.equal(w.document.getElementById('record-title').value, 'Release plan');
  w.document.querySelector('[data-filter="type"][data-value="claim"]').click();
  assert.equal(w.document.getElementById('record-title').value, 'Release plan');
});

test('imported IDs cannot collide with title suffixes in export paths', async t => {
  const w = await app(t);
  assert.notEqual(w.generateSlug('a-b', 'c'), w.generateSlug('a', 'b-c'));
});

test('MCP rejects a non-string revision reason without making the vault unreadable', async t => {
  const w = await app(t, { records: [storedRecord()] });
  const tools = bridge(w);
  const result = await tools.get('sovmem_revise').handler({ id: 'record-1', title: 'Changed', revision_reason: { bad: true } });
  assert.equal(result.isError, true);
  w.sovmem.refresh();
  assert.equal(saved(w)[0].title, 'Release plan');
  assert.equal(w.document.querySelectorAll('#records-list li').length, 1);
});
