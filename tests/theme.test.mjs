import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { JSDOM } from 'jsdom';

const html = fs.readFileSync('public/assessment/index.html', 'utf8');
const shared = fs.readFileSync('public/shared.js', 'utf8');

async function setup(t, { saved, dark = false, blocked = false } = {}) {
  const dom = new JSDOM(html, {
    url: 'https://thefutureissolo.com/assessment/',
    runScripts: 'outside-only',
  });
  t.after(() => dom.window.close());
  await new Promise(resolve => dom.window.addEventListener('load', resolve, { once: true }));
  const { window } = dom;
  window.matchMedia = () => ({ matches: dark });
  if (saved !== undefined) window.localStorage.setItem('tfis-theme', saved);
  if (blocked) {
    Object.defineProperty(window, 'localStorage', {
      get() { throw new window.DOMException('Storage disabled', 'SecurityError'); },
    });
  }
  const errors = [];
  window.addEventListener('error', event => { errors.push(event.error); event.preventDefault(); });
  window.eval(shared);
  window.document.dispatchEvent(new window.Event('DOMContentLoaded'));
  return {
    window,
    button: window.document.querySelector('.theme-toggle'),
    theme: () => window.document.documentElement.dataset.theme,
    errors,
  };
}

test('assessment theme button switches both ways and persists the selection on reload', async t => {
  const page = await setup(t);
  assert.equal(page.theme(), 'light');
  page.button.click();
  assert.equal(page.theme(), 'dark');
  const reloaded = await setup(t, { saved: page.window.localStorage.getItem('tfis-theme') });
  assert.equal(reloaded.theme(), 'dark');
  reloaded.button.click();
  assert.equal(reloaded.theme(), 'light');
  assert.equal(reloaded.window.localStorage.getItem('tfis-theme'), 'light');
  assert.deepEqual(page.errors, []);
  assert.deepEqual(reloaded.errors, []);
});

test('theme follows the system preference until a valid explicit choice is saved', async t => {
  assert.equal((await setup(t, { dark: true })).theme(), 'dark');
  assert.equal((await setup(t, { dark: true, saved: 'light' })).theme(), 'light');
  assert.equal((await setup(t, { dark: true, saved: 'invalid' })).theme(), 'dark');
});

test('theme remains usable when browser storage is unavailable', async t => {
  const page = await setup(t, { dark: true, blocked: true });
  assert.equal(page.theme(), 'dark');
  page.button.click();
  assert.equal(page.theme(), 'light');
  page.button.click();
  assert.equal(page.theme(), 'dark');
  assert.deepEqual(page.errors, []);
});

test('theme button announces its action and shows the matching current-theme icon', async t => {
  const page = await setup(t);
  const sun = page.button.querySelector('.theme-icon--sun');
  const moon = page.button.querySelector('.theme-icon--moon');
  assert.equal(page.button.getAttribute('aria-label'), 'Switch to dark mode');
  assert.notEqual(sun.style.display, 'none');
  assert.equal(moon.style.display, 'none');
  page.button.click();
  assert.equal(page.button.getAttribute('aria-label'), 'Switch to light mode');
  assert.equal(sun.style.display, 'none');
  assert.notEqual(moon.style.display, 'none');
});
