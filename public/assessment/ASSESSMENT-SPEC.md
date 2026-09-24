# SSA-CMM assessment contract

Updated 2026-09-24. This describes the implemented assessment under `/assessment/`.
The instrument measures self-reported practice, not identity or externally certified capability.

## Instrument and scoring

- 15 **answered** readings, round-robin across Agency, Clarity, Competence, Accountability, Security (three per pillar).
- The 500-item bank has 20 variants per pillar × difficulty band. Bands are **1–5**, discriminating L(band−1)/L(band); result levels are **L0–L5**.
- Start every pillar at band 3. A response score of 3 or 5 raises its next band by one; 0 or 1 lowers it. Clamp bands to 1–5.
- Final pillar reading follows the source SSA-CMM instrument: last band for score ≥3; band−1 for score <3. At band 5, score 3 reads L4; at band 1, score 1 reads L1.
- Overall level is the rounded mean of measured pillar readings. Unanswered pillars remain `null`, never a default L3. An incomplete mean is explicitly provisional and cannot enter the Jev gate.
- Level names: Manual Operator, Tool User, Workflow Builder, Agent Supervisor, Loop Engineer, Sovereign Architect.
- Coverage (answers out of three) is shown separately from model confidence. Three responses are not “100% confidence.”

## Flow

1. Load and validate the production bank. Failure shows a retryable error; no placeholder bank is scored.
2. Begin → select an option → Next. Plain-language switching retains the selected answer. Buttons use module-scoped handlers independent of the homepage quiz.
3. Skip selects an unseen question from the **same pillar and band** without advancing progress or adding scoring evidence. Exhaustion shows an explicit message with Back / Finish options; it does not invent a reading or change bands.
4. Back or “Revise answer” replays prior responses and drops the revised answer plus all later evidence. This invalidates the old gate. The revised item and selected option are shown again.
5. Finish with current answers is available. Incomplete sessions stay unlocked/local and do not call Jev.
6. The fifteenth answer produces a provisional summary and one Jev request. Pending state is visible. Duplicate completion is ignored; retake/revision aborts the old request and invalidates late responses.
7. Review responses, retry Jev, export, or retake. An explicit retry or completed revision may make another request; no automatic retry loop.

## Jev request

The browser posts `{ state, battery: 'ssa-cmm-v1', questions }` to same-origin `/api/jev`.
The five question IDs are `level_read`, `level_confidence_band`, `pillar_focus`, `review_status`, `judgment_ready`.

State contains:

- `claimed_level`, `pillar_scores`, `pillar_answer_counts`, weakest/strongest pillar.
- `items_answered`, `items_skipped`, real ordered `band_trajectory`.
- `response_evidence`: slot, item ID, pillar, presented band, numeric score or null, skipped boolean.
- Bank schema, scoring method, and a clear self-report/evidence limitation.

No bank question text, option wording, essays, user identity, or credentials are sent by the browser.
The proxy replays evidence against its bundled bank and rejects inconsistent/incomplete scores.
It forwards a canonical structured state plus the five server-owned rubric definitions to TypeSafe's `jev-latest` model.

## Gate and interpretation

The current [TypeSafe API contract](https://docs.typesafe.ai/api) specifies Choice and Score confidence in [0,1], a probability-weighted numeric Score, and Noul as a probability in [0,1]. Noul has no separate confidence field.

All five typed answers must be present and valid. The gate passes only when:

- All 15 readings are complete.
- `review_status.choice` is `ok`.
- `review_status`, `level_read`, and `level_confidence_band` confidence are each ≥0.75.
- The 0–2 confidence-band score is ≥1 (at least moderate). High confidence in **weak** evidence cannot pass.

Missing/invalid responses, low confidence, adverse review status, unavailable service, and timeouts leave results unlocked. These conditions cannot be bypassed by an Accept button.

On a passing gate, `under`/`over` may suggest ±1, clamped to L0–L5. The operator explicitly accepts the current or suggested level. Pillar readings and original claimed level remain intact.

`judgment_ready.noul >= 0.75` is a readiness signal, not permission to write. Low Noul can accompany a passed local review. **All saves are local-only in this implementation; no SovMem write-back exists.** A low-confidence focus suggestion falls back to the locally weakest measured pillar.

## Inspectable metadata and storage

“Jev API payload & response metadata” is a native, keyboard-operable expandable section showing:

1. Exact browser request body.
2. Start time, browser duration, HTTP status/error, proxy request ID/latency/status, and the actual provider payload with rubric definitions.
3. Proxy response, model/version, usage, typed answers, probabilities and score legend where supplied.
4. Gate thresholds, reasons, readiness, and suggested adjustment.

JSON is rendered as text, never HTML. Authentication headers are never returned. Provider error bodies are not reflected to users. Exports and local snapshots include the same request, response, gate, and session evidence. Storage failures visibly offer export; they do not interrupt assessment.

## Proxy limits

- 64 KiB inbound JSON, 128 KiB provider response; no arbitrary client questions.
- Server-only `TYPESAFE_API_KEY` (fallback `JEV_API_KEY`).
- Provider timeout 45 seconds; browser timeout 55 seconds, leaving time for the proxy response.
- Request JSON error responses explicitly. If an edge still returns HTML or malformed JSON, preserve the HTTP status and show a retryable error; never accept that response as an evaluation. Metadata includes response content type, Cloudflare Ray ID, and Retry-After when supplied.
- Explicit `redirect: 'manual'` and rejection of non-success responses; no credential forwarding through redirects.
- Same-origin production/preview requests and listed local development origins. Foreign Origins rejected.
- No-store responses; a bounded best-effort per-isolate 10/minute limit. This is **not distributed rate limiting**; use Cloudflare WAF for an account-wide abuse policy.

## Deferred extensions

The previous v0.2 planning document described optional deep-confirm probes and an extractor. Those are **not implemented** and are not presented as evidence in this release. `probe_rubric.json` remains a reference for that future feature. Accounts, resume across reload, remote write-back, and external verification are also outside the current instrument.
