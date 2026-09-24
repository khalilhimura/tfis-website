# SSA-CMM Assessment Deployment

## What Was Built

The SSA-CMM Field Manual Nº 01 self-assessment is now available at `/assessment/`:

- **Adaptive staircase delivery** across 5 pillars (Agency, Clarity, Competence, Accountability, Security)
- **15-item session** (3 per pillar) with real-time level estimation
- **Plain language toggle** for accessibility
- **Jev validation gate** at completion (confidence threshold <0.75 triggers review modal)
- **TE chassis design** matching SovMemGrok/Nous-Jev pattern
- **Braun Field Manual palette** (greige/ink/orange accents)
- **Client-side only**, no tracking
- **Skip-friendly UX**

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
