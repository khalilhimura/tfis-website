# SSA-CMM question bank

`bank.json` contains **500 production items**: five pillars × five difficulty bands (1–5) × 20 variants. Bands discriminate adjacent levels; output levels span L0–L5.

```json
{
  "schema": 1,
  "pillars": ["Agency", "Clarity", "Competence", "Accountability", "Security"],
  "items": [{
    "id": "agency-b3-01",
    "pillar": "Agency",
    "band": 3,
    "q": "Technical question wording",
    "layman": "Plain-language wording",
    "opts": [
      { "t": "Manual practice", "s": 0 },
      { "t": "Assisted practice", "s": 1 },
      { "t": "Supervised agent practice", "s": 3 },
      { "t": "Verified loop practice", "s": 5 }
    ]
  }]
}
```

IDs must be unique. `q`, `layman` and option wording must be nonempty. Scores are 0, 1, 3 or 5. The browser validates at least three items in every pillar/band cell before starting. The production coverage test expects exactly 20 items per cell.

A skip draws another unseen item at the same band. Bank exhaustion produces an explicit incomplete path. There is no demo fallback.

The proxy bundles this bank to verify response IDs, presented bands and scores. **Deploy bank, browser engine and proxy together.** Updating the bank during an active session may require the user to reload before evaluation.

Run `npm test` from the repository root. See [ASSESSMENT-SPEC.md](ASSESSMENT-SPEC.md) for scoring and payload rules.
