# AL Swatch Configurator

You're picking up a project to build an American Leather fabric/leather configurator for Trig Modern, a mid-century furniture store in Raleigh, NC. Trig is an authorized AL dealer.

The goal: a configurator on Trig's website where a customer picks an AL frame (e.g. Sulley Comfort Sleeper Queen Plus), then clicks through fabric and leather options to see live price updates. AL has 1,200+ fabrics and 200+ leathers — the configurator surfaces them in a way that's browsable, not paralyzing.

## Status

**Done:**
- AL Brandfolder swatch images parsed → 664 unique swatches across 134 covers
- All swatches grouped by `(cover, color)` with multiple shots collapsed to a single hero
- Type classification: 423 fabric · 141 leather · 100 microfiber
- Static MVP demo (`demo/AL_configurator_demo.html`) — single-file HTML proves the UX direction
- AL wholesale pricing for all 137 frame models structured in `data/al_pricebook.json` (2,624 SKUs)

**Pending:**
- Grade lookup (Fabric I/II/III/V · Leather C/D/F/G/H/J) — `data/covers_grade_lookup.csv` has all 134 covers with empty grade column. Either Trig fills manually or we get AL's Materials Guide PDF and parse it.
- Production configurator (this is what you'd build)

## What you're being asked to build

A web configurator. Stack open — could be:
- **Embedded Square Online block** (Square Online supports custom HTML/JS embeds)
- **Static site** (Next.js / Astro / plain HTML) deployed to a subdomain like `configure.trigmodern.com`
- **Square API integration** so the selected swatch + frame ends up in Square as a configured cart line

Pick whatever stack fits. Bias toward whatever ships fastest with the cleanest UX. The data is already in `data/swatches.json` and `data/al_pricebook.json` — your job is the UI/UX and pricing logic.

## Critical constraints

1. **Trig brand voice**: editorial, mid-century, restrained. No corporate ecommerce defaults. Look at `demo/AL_configurator_demo.html` — that's the visual direction. Helvetica, lots of white space, considered grid, accent walnut color (#8b5e3c).

2. **Pricing rule**: Trig retail = AL wholesale × 2.5. This is the multiplier across the entire AL line. Every variation in `al_pricebook.json` is wholesale; multiply ×2.5 for retail.

3. **Grades and tiers** — there are TWO models. **READ `docs/grades_and_tiers.md`** before touching pricing logic.
   - **AL grades (real)**: Fabric I/II/III/V (4 grades) · Leather C/D/F/G/H/J (5 grades) · plus C.O.M./C.O.L.
   - **Trig display tiers (5)**: Fabric Standard/Premium · Leather Entry/Classic/Premium — the customer-facing dropdown collapses 9 grades into 5 tiers
   - The configurator shows **tiers** to customers, looks up **grades** internally for pricing

4. **No Square dependency** for v1. Customer selects → "Add to Quote" or "Visit Showroom" CTA. We can wire Square Cart later.

5. **Phase-2 fabric/leather grades** aren't in the data yet. The configurator should be designed so adding the grade column later is mechanical — UI shows "Grade — pending" until populated, then auto-filters.

## Data files

### `data/swatches.json` — primary source

Schema:
```json
{
  "generated_at": "2026-05-03",
  "total_images": 894,
  "unique_swatches": 664,
  "swatches": [
    {
      "id": "brae-cinnamon",            // stable slug
      "cover": "Brae",                  // cover/material name
      "color": "Cinnamon",              // color variant
      "type": "fabric",                 // fabric | leather | microfiber
      "n_shots": 5,                     // how many photos exist
      "hero": "<absolute path>",        // best image for grid display
      "shots": ["<path>", ...],         // all images, hero first
      "asset_ids": ["RR0321", ...]      // Brandfolder asset IDs
    }
  ]
}
```

**Note on image paths**: the `hero` and `shots` fields are absolute paths to where the swatch images live on Zach's machine (`~/Desktop/Artisant Lane-selected-assets (2)/...`). For deployment you'll want to:
1. Resize to 800×800 or 1200×1200 max
2. Optimize as JPEG ~85 quality
3. Upload to a CDN (Cloudflare R2, AWS S3, Vercel Blob, whatever)
4. Update `swatches.json` paths to public URLs

### `data/swatches.csv` — same data, spreadsheet view
For human review / quick eyeballing.

### `data/swatches.sqlite` — same data, relational
Two tables: `swatches` (one row per unique swatch) and `swatch_shots` (multiple rows per swatch). Use this if you want SQL-based queries.

### `data/covers_grade_lookup.csv` — Phase-2 input
134 rows, one per cover. Columns:
- `cover` — name like "Brae", "Mont Blanc"
- `type` — fabric/leather/microfiber
- `n_colors` — how many color variants
- `grade` — empty, to be filled
- `notes` — empty, free-form

Once filled, run a merge script that updates `swatches.json` and `swatches.sqlite` with the grade column populated.

### `data/al_pricebook.json` — frame pricing

Schema:
```json
{
  "models": {
    "SULLEY": [
      {
        "sku": "SLY-SO2-QP",
        "description": "TWO SEAT SOFA - QUEEN PLUS SIZE",
        "com_usage_yards": 17,
        "wholesale": {
          "Leather C": 4300,
          "Leather D/F": 4500,
          "Leather G": 4675,
          "Leather H": 4825,
          "Leather J": 5075,
          "Fabric I": 3050,
          "Fabric II": 3325,
          "Fabric III": 3550,
          "Fabric V": 3800
        }
      }
    ]
  }
}
```

To compute Trig retail price for a configured product:
```python
retail = al_pricebook[model][sku]["wholesale"][f"{type} {grade}"] * 2.5
```

## Configurator UX direction

From the MVP demo (`demo/AL_configurator_demo.html`), the working pattern is:

1. **Top-level filter**: All / Fabric / Leather / Microfiber (later: filter by grade tier)
2. **Grid**: square swatches with cover name, color name, type label
3. **Selection**: click → highlight + bottom drawer with full details + CTA
4. **Bottom drawer CTA**: in v1, "Add to Quote" or "Visit Showroom"; v2 wires to Square Cart

For the production version:
- Persistent product context at top ("Configuring: Sulley Comfort Sleeper · Queen Plus")
- Live price update as customer changes grade tier
- Filter by grade once that data lands
- Mobile-first (most showroom interactions are phone-tap-NFC → land on configurator)
- Keep the editorial typography — this is mid-century furniture, not Walmart

## How to start

```bash
cd "Trig Build/AL_swatch_configurator"
# Inspect data
cat data/swatches.json | jq '.swatches[0]'
sqlite3 data/swatches.sqlite "SELECT type, COUNT(*) FROM swatches GROUP BY type;"

# Open the demo to see the UX target
open demo/AL_configurator_demo.html
```

Pick a stack, scaffold, point it at `data/swatches.json`. The data layer is done.

## Existing scripts (reference, not required)

- `scripts/build_swatch_manifest.py` — re-parses Brandfolder filenames into `swatches.json` if Zach drops in new exports
- `scripts/build_configurator_demo.py` — regenerates the static demo HTML

## Questions worth asking Zach before you go deep

- Stack preference (Square Online embed vs standalone subdomain)?
- Does the configurator need cart integration in v1, or is "Visit Showroom" enough?
- Trade portal needed (designers see different pricing)?
- Mobile-only or desktop+mobile?

## Project glossary

- **Cover**: the fabric or leather material name (e.g. "Brae", "Mont Blanc")
- **Color**: variant within a cover (e.g. "Cinnamon", "Caramel")
- **Grade**: AL's pricing tier (Fabric I/II/III/V or Leather C/D/F/G/H/J)
- **Frame**: the structural piece (e.g. Sulley Comfort Sleeper Queen Plus = `SLY-SO2-QP`)
- **C.O.M.**: Customer's Own Material — customer ships their own fabric to AL
- **C.O.L.**: Customer's Own Leather

## Trig brand notes

- Trig Modern, 213 South Boylan Avenue, Raleigh NC
- ~50 vendor lines, AL is a flagship
- Ryan is the owner / Zach is the operator
- Showroom-first, ecommerce-secondary — most sales close via showroom visit. The configurator's job is to qualify the customer before they walk in, not replace the consultative sale.
