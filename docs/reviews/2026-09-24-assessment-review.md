# Assessment review and verification

Scope: `/assessment/`, its 500-item bank, shared-page interaction boundary, and `/api/jev`. Based on `main` at `b129ea7` (PR #15).

## Findings fixed

| Finding | Result |
| --- | --- |
| Skip consumed a slot and inflated confidence; all-skips produced L3 defaults | Skip replaces at the same band, coverage counts actual answers, incomplete pillars remain unmeasured |
| Score averaging diverged from the source SSA-CMM staircase | Restored round-robin band adaptation and canonical L0/L1/L4/L5 boundary readings |
| Failed bank loading silently scored placeholder questions | Validated real bank with explicit retryable failure |
| Missing confidence and adverse reviews could still be accepted | Typed gate requires complete evidence, `ok`, confidence ≥0.75 and at least moderate score |
| Fractional Noul treated as ready unless exactly zero | Readiness uses probability threshold ≥0.75; storage remains local-only |
| Review only closed a modal; revisions could retain stale acceptance | Real answer review and replay; revision clears downstream evidence, cancels evaluation and invalidates saved acceptance |
| Late responses could affect retakes; storage failures could interrupt flow | Request generation/cancellation guards; visible storage failure with export available |
| Payload altered scores by “confidence” and invented a trajectory | Actual pillar readings, counts, ordered band trace and structured response evidence |
| Proxy accepted arbitrary/unbounded requests and reflected provider errors | Canonical bank replay, fixed battery, body limits, timeouts, manual redirects, safe failure metadata |
| No way to inspect Jev transport or decision | Expandable request/provider payload/response/gate section; metadata included in local snapshot and export |

## Verification performed

- `npm test`: **30 passed, 0 failed**. Includes real JSDOM click flows, pure scoring/gate tests and controlled proxy transport tests.
- `npm run build`: static Astro build passed, 57 pages.
- Pages Functions bundle passed with Wrangler 4.137.0. The installed 4.119.0 CLI can bundle/deploy but its local runtime rejects this project's compatibility date, so local runtime verification used 4.137.0.
- Independent read-only code review found the persisted-acceptance issue; regression reproduced, fixed, and re-reviewed successfully.
- Real browser against local Pages runtime, using the actual Jev provider: Begin → Skip stayed at 1/15; selection → Next reached 2/15; 15 actual answers plus one skip yielded L4 and a single completed provider request.
- Real response: HTTP 200, model `jev-1.13.0`, proxy latency 1509 ms, browser duration 1606 ms. Gate correctly rejected low confidence and weak evidence; no acceptance action appeared. This verifies the real low-confidence path, not a passing provider judgment.
- Expanded metadata contained numeric bank schema 1, 16 evidence entries (15 answered + 1 skip), original and upstream payloads, typed answers/probabilities/legend, model/usage, timing, request ID and gate reasons.
- Browser revision of answer 15 preserved its selection, changed Security from L4 to L5, then made a new real Jev request (HTTP 200, 835 ms), which remained unlocked after an adverse/low-confidence review.
- Mobile inspection at 390×844: page width 390, no horizontal overflow; metadata JSON wraps inside bounded scroll panels. Viewport reset afterward. No browser console errors observed in the completed run.
- Passing gate acceptance, bounded adjustment, failure/timeout/retry, stale retake, export, hostile metadata text, and storage denial verified in controlled tests.

## Release limits

The feature preview is behind existing Cloudflare Access. Its deployment succeeded; an authenticated browser preview was not available. Real integration was verified with the same function code bundled into a local Pages runtime and live TypeSafe requests. Production remains the PR #15 release until this change is separately merged/deployed.

This instrument remains a self-report; there are no implemented optional prose probes, external validation or remote write-back. The proxy's rate limit is best effort per isolate, not a distributed quota.

`npm audit --omit=dev` reports four existing production-dependency advisories (Astro, js-yaml, sharp, svgo: one critical, three high). These predate this assessment change; dependency upgrades were not mixed into this release.
