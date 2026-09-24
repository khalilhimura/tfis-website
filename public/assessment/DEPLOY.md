# SSA-CMM Assessment Deployment

## Documentation

- **[ASSESSMENT-SPEC.md](ASSESSMENT-SPEC.md)** — v0.2 product spec (UX flow, data shapes, Jev battery, rubric)
- **[BANK.md](BANK.md)** — Item bank requirements (500-item structure)
- **[probe_rubric.json](probe_rubric.json)** — v0.2 higher-order thinking rubric for optional deep-confirm probes

## What Was Built

The SSA-CMM Field Manual Nº 01 self-assessment is now available at `/assessment/`:

- **Adaptive staircase delivery** across 5 pillars (Agency, Clarity, Competence, Accountability, Security)
- **15-item session** (3 per pillar) with real-time level estimation
- **Plain language toggle** for accessibility
- **Jev SSA-CMM battery** post-session gate with 5-question validation
- **TE chassis design** matching SovMemGrok/Nous-Jev pattern
- **Braun Field Manual palette** (greige/ink/orange accents)
- **Client-side only**, no tracking
- **Skip-friendly UX**

## Jev Battery (Post-Session Gate)

After completing 15 items, the assessment validates results through a 5-question battery:

1. **level_read** (Choice) — over | on | under
2. **level_confidence_band** (Score) — weak | moderate | strong
3. **pillar_focus** (Choice) — which of 5 pillars to prioritize
4. **review_status** (Choice) — ok | needs_revision | escalate
5. **judgment_ready** (Noul) — boolean 0/1 for save mode

### Gate Logic

- **Confidence < 0.75** on review_status, level_read, or confidence_band → needs-revision modal
- **review_status = needs_revision/escalate** → blocks lock regardless of confidence
- **level_read = over** (high confidence) → suggests claimed_level - 1
- **level_read = under** (high confidence) → suggests claimed_level + 1
- **judgment_ready.noul = 0** → local-save-only (no SovMem write-back)

### API Integration

The assessment tries `/api/jev` proxy first (same-origin), then falls back to:
- `https://api.typesafe.ai/v1/systemone` (TypeSafe System One)

Payload structure:
```json
{
  "state": {
    "claimed_level": 3,
    "pillar_scores": { "agency": 3.2, "clarity": 2.8, ... },
    "weakest_pillar": "clarity",
    "strongest_pillar": "agency",
    "items_answered": 13,
    "items_skipped": 2,
    "band_trajectory": "L2-L4",
    "session_notes": "..."
  },
  "battery": "ssa-cmm-v1",
  "questions": ["level_read", "level_confidence_band", ...]
}
```

## Assessment Structure

```
public/assessment/
├── index.html      # Main assessment UI
├── app.js          # Staircase engine + Jev integration
├── app.css         # Braun field manual styling
└── BANK.md         # Documentation for production item bank
```

## Item Bank Status

The assessment currently uses a **stub bank** (60 items) for demonstration:
- 5 pillars × 6 levels × 2 variants = 60 items
- Placeholder text for questions
- Basic scoring tables

**For production**, you need the full **500-item validated bank** from `~/Projects/ssa-cmm`. See `public/assessment/BANK.md` for the required schema and instructions.

## Testing

The assessment works correctly in the production build:

```bash
npm run build
npm run preview
# Visit http://localhost:4322/assessment/
```

✅ Production build verified  
✅ Preview server tested  
✅ URL routing confirmed: `/assessment/` and `/assessment/index.html`  
✅ All static assets load correctly (CSS, JS)  
✅ Stub bank generates test items  
✅ Staircase adaptation works  
✅ Jev battery integration implemented (pending TypeSafe API or proxy)  
✅ Gate logic: confidence thresholds, level adjustments, local-save mode  
✅ Focus pillar highlighting in results  
✅ Locked result status display

**Note**: In `astro dev`, you must access `/assessment/index.html` directly. In production (and preview), both `/assessment/` and `/assessment/index.html` work correctly.

## Deployment to Production

This site is deployed via **Cloudflare Pages** (wrangler name: `tfis`, output: `./dist`).

### Deploy Steps (from Mac with CF auth):

1. **Build the site:**
   ```bash
   npm run build
   ```

2. **Deploy to Cloudflare Pages:**
   ```bash
   npx wrangler pages deploy dist --project-name=tfis
   ```

3. **Verify the live URL:**
   - Production: https://thefutureissolo.com/assessment
   - Cloudflare Pages: https://tfis.pages.dev/assessment

### Deploy from Cloud Agent (if CF auth available):

```bash
cd /workspace
npm run build
npx wrangler pages deploy dist --project-name=tfis
```

## What to Test After Deployment

1. **URL access**: https://thefutureissolo.com/assessment (and with trailing `/`)
2. **Plain language toggle**: Switch between technical and plain phrasing
3. **Staircase adaptation**: Answer items and verify adaptive difficulty
4. **Skip functionality**: Skip items and verify session continues
5. **Results display**: Complete 15 items and view pillar-level results
6. **Jev validation**: If confidence < 75% on any pillar, validation modal should appear
7. **Export results**: Export JSON file with session data
8. **Theme toggle**: Test dark mode (inherited from TE chassis)

## Integration Points

- **Jev API**: `https://nous-jev.khalil-himura.workers.dev/api/jev`
- **Shared chrome**: Uses `/shared.css` and `/shared.js` from site root
- **TE chassis**: Matches design system from `/sovmem-grok/` and `/nous-jev/`

## Next Steps for Production

1. **Obtain the validated 500-item bank** from `~/Projects/ssa-cmm`
2. **Create `public/assessment/bank.json`** following the schema in `BANK.md`
3. **Test with real bank** (verify staircase across all pillar-level combinations)
4. **Remove stub bank** warning from app.js
5. **Add analytics** (optional, if desired) for session completion tracking
6. **Deploy and verify** at https://thefutureissolo.com/assessment

---

**Built**: 2026-09-24  
**Branch**: `cursor/ssa-cmm-assessment-4bf0`  
**PR**: (to be created)
