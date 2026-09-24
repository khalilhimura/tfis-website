# SSA-CMM Assessment — Product Spec

**Spec version:** v0.2  
**Target URL:** https://thefutureissolo.com/assessment  
**Source instrument:** `~/Projects/ssa-cmm` (MBA) — Field Manual Nº 01 (baseline staircase + 500 bank = implicit v0.1)  
**Mount pattern:** `tfis-site/public/assessment/` (same as `/sovmem-grok/`, `/nous-jev/`)  
**Status:** v0.2 ship — TFIS mount, post-session Jev gate, optional deep-confirm probes + rubric. v0.3 reserved for post-ship learnings (third probe, SovMem write-back hardening, auth).

---

## 1. Purpose

Solo Systems Architect Capability Maturity Model (SSA-CMM) self-assessment for solo technical professionals. Measures **practice, not identity** across five sovereignty pillars. Levels are positions, not verdicts.

Organizing question: *after you spend judgment — a decision, a correction, a taste call — where does it go?*

| Band | Name |
|------|------|
| L0 | Manual Operator |
| L1 | Tool User |
| L2 | Workflow Builder |
| L3 | Agent Supervisor |
| L4 | Loop Engineer |
| L5 | Sovereign Architect |

**Pillars:** Agency · Clarity · Competence · Accountability · Security

---

## 2. Non-goals (v1)

- No account required for dry run.
- No per-question LLM / Jev calls.
- Jev does **not** grade essays or replace the staircase.
- No tracking cookies / server-side answer storage required for dry run.
- Third open probe deferred; deep confirm optional and off by default.

---

## 3. End-to-end UX

### 3.1 Intro
- What SSA-CMM is, five pillars, ~10–15 min dry run.
- Braun / TE card language; TFIS nav + theme via `shared.css` where mounted on TFIS.
- CTA: Start assessment. Secondary: optional "Add deep confirm (2 open probes)" toggle — **off by default**.

### 3.2 Staircase (core)
- **15 items** total: 3 per pillar, drawn adaptively from `public/bank.json` (**500 items**: 5 pillars × 5 bands × 20 variants).
- One item at a time. Progress UI = **15 slots**, never "question N of 500."
- Each answer steps the difficulty **band** up or down (staircase hone).
- **Skip** replaces with another item at the **same band**; skip does not count against the operator.
- Plain-language toggle: every item has a jargon-free restatement.
- Soft live read: quiet `claimed_level` + pillar bars after each pillar block and/or at end — **not locked**.

### 3.3 Optional deep confirm (flag)
- After the 15, if toggle on: **2** open probes (~150–250 words target, **hard cap 500** each).
- Prose extractor (LLM) applies `probe_rubric.json` → integers 0–4 + claim fields (see §5–6).
- If extraction is thin → `judgment_ready` stays 0 → soft-save only later.

### 3.4 Jev gate (one call)
- Build `AssessmentState` (+ probe claim fields if deep confirm ran).
- **Single** `POST` to TypeSafe System One (prefer same-origin `/api/jev`, mirror `nous-jev`).
- Show under/on/over + confidence.
- **Gate:** if `review_status ≠ ok`, or confidence on `level_read` / `review_status` / `level_confidence_band` **< 0.75** → needs-revision modal (revise or re-run); do not lock.
- If `level_read` is `over`/`under` at high confidence → suggest ±1 with operator confirm.
- If `judgment_ready = 0` → local soft-save only; no SovMem write-back.

### 3.5 Result
- Locked level (or soft level if not locked).
- Weakest pillar as next practice focus (`pillar_focus`).
- Optional soft-save / SovMem write-back only when `judgment_ready = 1` and gate passed.

**Retake / revise:** a second Jev call is allowed after modal revise; day-to-day path is still one gate call.

---

## 4. Data shapes

### 4.1 AssessmentState (staircase output)

```ts
type AssessmentState = {
  claimed_level: 0 | 1 | 2 | 3 | 4 | 5;
  pillar_scores: {
    agency: number;
    clarity: number;
    competence: number;
    accountability: number;
    security: number;
  };
  weakest_pillar:
    | 'agency' | 'clarity' | 'competence'
    | 'accountability' | 'security';
  strongest_pillar:
    | 'agency' | 'clarity' | 'competence'
    | 'accountability' | 'security';
  items_answered: number;   // usually 15
  items_skipped: number;
  band_trajectory: string;  // e.g. "b2→b3→b4→b3"
  session_notes?: string;
};
```

### 4.2 Probe claims (deep confirm only; extractor output)

```ts
type ProbeClaims = {
  probe_scores: [number, number]; // 0–4 each; use weaker toward soft-check
  has_stop_rule: 0 | 1;           // Noul-shaped
  provenance_strength: 'weak' | 'moderate' | 'strong';
  practice_loop_present: 0 | 1;   // capture → verify → write-back named
  extract_thin: boolean;          // if true, force judgment_ready soft path
};
```

### 4.3 Jev payload
Send **only** structured fields: `AssessmentState` + `ProbeClaims` (if any).  
**Do not** send: full essay text, full rubric markdown, or bank items.

---

## 5. Jev battery (post-session)

Atomic System One questions (Choice / Score / Noul):

| id | type | options / meaning |
|----|------|-------------------|
| `level_read` | Choice | `under` \| `on` \| `over` |
| `level_confidence_band` | Score | `weak` \| `moderate` \| `strong` |
| `pillar_focus` | Choice | five pillar ids |
| `review_status` | Choice | `ok` \| `needs_revision` \| `escalate` |
| `judgment_ready` | Noul | 0 \| 1 |

### Gate pseudocode

```ts
if (answers.review_status.choice !== 'ok'
    || (answers.review_status.confidence ?? 0) < 0.75) {
  showValidationModal({ reason: 'needs_revision' });
} else if ((answers.level_confidence_band.confidence ?? 0) < 0.75
    || (answers.level_read.confidence ?? 0) < 0.75) {
  showValidationModal({ reason: 'low_confidence' });
} else {
  lockResult({
    focus: answers.pillar_focus.choice,
    level_adj: answers.level_read.choice,
  });
}
```

Reuse `nous-jev` client patterns: TypeSafe `https://api.typesafe.ai/v1/systemone`, CORS locked to `thefutureissolo.com` (+ localhost), rate limit, no secret leakage.

---

## 6. Open-probe rubric (HOTS / critical thinking)

File: `public/probe_rubric.json` (versioned next to `bank.json`).

Score **higher-order thinking as practice**, not eloquence. Each probe **0–4**; weaker of the two informs soft level check.

| Score | Label | Signal |
|------:|-------|--------|
| 0 | Absent | Assertion only; no why / tradeoff / stop |
| 1 | Recall | Names a tool or step; judgment evaporates |
| 2 | Apply | Concrete situation + action; weak on failure modes / write-back |
| 3 | Analyze / evaluate | Tradeoffs, stop-rule, provenance ("how I'd know I was wrong"); judgment applied then lost |
| 4 | Create / compound | Designs a loop: capture → verify → write back to memory they own; next practice named |

**Soft-check vs staircase (does not override claimed_level alone):**
- avg ≤ 1 → challenge claimed_level down in Jev context
- ~2 → on-band for L1–L2 signal
- ~3 → L3 signal
- 4 → L4–L5 signal **only if** staircase already agrees

Extractor fills `ProbeClaims`; staircase still owns `claimed_level`.

---

## 7. Design language

- **Instrument core:** Dieter Rams / Braun — greige casing, ink, one orange (`ssa-cmm` existing palette).
- **TFIS mount:** SovMemGrok TE chassis chrome + `shared.css` (nav, theme toggle, mono labels, cream panel).
- Keep Field Manual Nº 01 voice: *Weniger, aber besser.*

---

## 8. Bank & validation

- `public/bank.json` — 500 items; validate with `node scripts/validate-bank.mjs` (and `--strict`).
- Coverage target: 20 variants per pillar×band cell.

---

## 9. Ship checklist

1. Land UI + bank under `tfis-site/public/assessment/` (or Worker assets equivalent) so `/assessment` resolves.
2. Wire staircase from existing `index.html` / bank.
3. Optional deep-confirm flag + 2 probes + extractor using `probe_rubric.json`.
4. Same-origin `/api/jev` (or shared nous-jev binding) + gate UI.
5. Verify live: https://thefutureissolo.com/assessment (intro → 15 → optional probes → gate → result).
6. Secrets: `TYPESAFE_API_KEY` (and extractor LLM key if used) via wrangler secrets — never in repo.

---

## 10. Ownership

| Seat | Owns |
|------|------|
| Linus | Build, mount, deploy, API wiring |
| Audy | Spec, rubric, battery, ops recap |
| Khalil | Product go / flag defaults |

---

*Spec distilled from SSA-CMM lounge design thread, 2026-09-24.*
