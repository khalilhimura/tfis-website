# Assessment release and verification

The assessment is mounted at `/assessment/`, with its same-origin Pages Function at `/api/jev`.

```sh
npm ci
npm test
npm run build
npx wrangler pages functions build --outdir /tmp/tfis-assessment-functions
```

Deploy a review preview from its feature branch:

```sh
npx wrangler pages deploy dist --project-name=tfis --branch=codex/assessment-review-isolated --commit-dirty=true
```

The environment needs `TYPESAFE_API_KEY` (or `JEV_API_KEY`) in Pages secrets. Configure the preview environment too when testing the real API. Never put the key in client assets or command output.

Deploy to production only from the agreed release commit on `main`:

```sh
npm run build
npx wrangler pages deploy dist --project-name=tfis --branch=main --commit-dirty=true
```

Browser checks:

1. Hard refresh. Begin → select → Next advances to 2 of 15.
2. Skip replaces the question, keeping the current slot. Back restores an answer; changing it reroutes later questions. Plain/technical toggle preserves selection.
3. Complete 15 actual answers. Verify provisional result → one pending Jev request → explicit gate outcome. Retake during a request must ignore its later response.
4. Review/revise an answer, finish the new sequence, and confirm a fresh evaluation.
5. Open “Jev API payload & response metadata.” Verify actual request body, provider payload/rubric, typed response, probabilities/legend, latency, status, model/usage, and gate reasons. No authentication fields.
6. Failed, low-confidence or adverse evaluations must stay unlocked with review/retry available. A passing gate permits explicit acceptance or a bounded suggested adjustment. Low Noul remains local-only.
7. Export JSON, check saved/exported metadata and original/adjusted level. Check narrow-screen layout and keyboard operation.

`npm test` covers staircase boundaries, skip/revise/exhaustion, bank validation, gate failure cases, Noul, stale requests, transport errors, metadata escaping/export, proxy validation and secret-safe failure handling. Browser checks and real provider calls are separate evidence from those controlled tests.

Current behavior and planned extensions: [ASSESSMENT-SPEC.md](ASSESSMENT-SPEC.md). Bank shape: [BANK.md](BANK.md).
