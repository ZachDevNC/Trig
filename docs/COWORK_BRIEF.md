# Cowork → Showroom App Handoff Brief

This is a brief for the **cowork** Claude session that has access to:
- `data/swatches.json` (664 deduped AL swatches, hero image paths on Zach's machine)
- `data/al_pricebook.json` (137 AL frame models, 2,624 SKUs of wholesale pricing)
- `data/covers_grade_lookup.csv` (134 covers, grade column empty)
- `~7 GB` of swatch images (currently absolute paths in `swatches.json`)

The showroom Next.js app on branch `claude/nfc-showroom-cart-app-bKbkY` is **already built** with placeholder data. To replace placeholders with real data, cowork's job is to produce two TypeScript files that this app can drop in directly.

---

## What to produce

Two files committed to the same branch, replacing the existing modules:

### 1. `lib/covers.ts`

Replace the ~25 placeholders with the full library parsed from `swatches.json`. Match this exact shape:

```ts
import type { Cover } from "./types";

export const covers: Cover[] = [
  {
    id: "brae-cinnamon",       // stable slug from swatches.json
    cover: "Brae",              // from swatches.json
    color: "Cinnamon",          // from swatches.json
    type: "fabric",             // "fabric" | "leather" | "microfiber"
    grade: "I",                 // from covers_grade_lookup.csv
    imageUrl: "https://cdn.trigmodern.com/swatches/brae-cinnamon.jpg",
    // swatchHex omitted when imageUrl is present
  },
  // ...all 664
];

export function getCover(id: string): Cover | undefined {
  return covers.find((c) => c.id === id);
}
```

The `Cover` and grade types are defined in `lib/types.ts` — don't redefine them.

### 2. `lib/frames.ts`

Replace the 5 hand-keyed Parker entries with all 137 AL models parsed from `al_pricebook.json`. Each model in the pricebook may expand to multiple `Frame` entries (one per SKU variant — e.g., Sulley has Two Seat / Queen Plus / King separately). Use this shape:

```ts
import type { Frame } from "./types";

export const frames: Frame[] = [
  {
    id: "sulley-two-seat-qp",        // slug from sku, lowercase, hyphen
    brand: "American Leather",
    collection: "Sulley",             // model name from pricebook
    name: "Sulley Two Seat — Queen Plus",
    sku: "SLY-SO2-QP",                // from pricebook
    comYards: 17,                     // pricebook.com_usage_yards
    shortDescription: "...",          // best-effort short description
    features: [...],                  // standard features per model if available
    heroImage: "https://cdn.trigmodern.com/frames/sulley-two-seat-qp.jpg",
    wholesale: {                      // copy directly from pricebook.wholesale
      "Leather C":   4300,
      "Leather D/F": 4500,
      // ...
    },
    options: PARKER_OPTIONS,          // for Parker; other collections may differ
  },
  // ...all SKUs
];

export function getFrame(id: string): Frame | undefined {
  return frames.find((f) => f.id === id);
}
```

The app will compute retail = wholesale × 2.5 internally — don't pre-multiply.

---

## Tasks, in priority order

### P0 — Required for the MVP to work with real data

1. **Populate `covers_grade_lookup.csv`** — fill the `grade` column for all 134 covers using the AL Materials Guide PDF. Until this is done, covers can't be priced. If parsing the PDF is hard, do a manual pass; cowork should already have the AL spec book.

2. **Resize and upload swatch images** to a CDN. Recommendation: Cloudflare R2 with a `cdn.trigmodern.com` custom domain (~$0.015/GB/mo, no egress fees, ~$1.30/mo for 7 GB).
   - Source: hero path in each `swatches.json` entry
   - Output: 800×800 JPEG, ~85 quality
   - URL pattern: `https://cdn.trigmodern.com/swatches/{cover-slug}-{color-slug}.jpg`
   - One bulk upload script is fine — store the resulting `imageUrl` back into the swatch records so step 4 below can read them

3. **Generate `lib/covers.ts`** by joining `swatches.json` × `covers_grade_lookup.csv`, dropping covers whose grade is still empty (with a console warning listing them). Use the swatch slug (`{cover-slug}-{color-slug}`) as `id`.

4. **Generate `lib/frames.ts`** from `al_pricebook.json`. Frame hero images are not in scope for this brief — use a single placeholder URL (`https://cdn.trigmodern.com/frames/_placeholder.jpg`) until real product photography is sourced. Skip SKUs whose `wholesale` map is empty.

### P1 — Nice-to-have polish

5. Generate slug-based descriptions and feature lists per collection where possible, even if it's just `"{name} from American Leather's {collection} collection."` as a fallback.

6. If the AL Materials Guide gives finer grade detail (e.g., a leather collection that spans two grades), expose that — the data model can already represent multiple grades within the same `cover` name as long as `id` is unique.

### P2 — Don't do these yet

- Don't pre-multiply prices by 2.5 — the app does that.
- Don't build any UI — the app's UI is done. The job is data plumbing.
- Don't change `lib/types.ts` or `lib/tiers.ts` — those define the contract.
- Don't touch `lib/catalog.ts` — it just re-exports from `frames.ts` and `covers.ts`.

---

## Schema contract (read this before writing any code)

The full type definitions are in `lib/types.ts` on this branch. The non-negotiable parts:

- `CoverType = "fabric" | "leather" | "microfiber"`
- `FabricGrade = "I" | "II" | "III" | "V"`
- `LeatherGrade = "C" | "D/F" | "G" | "H" | "J"`
- `wholesale` keys must be exactly `"Fabric I"`, `"Fabric II"`, `"Fabric III"`, `"Fabric V"`, `"Leather C"`, `"Leather D/F"`, `"Leather G"`, `"Leather H"`, `"Leather J"` — these match the `al_pricebook.json` keys already.
- A `Frame` may have only some of the keys populated. The app handles missing keys gracefully (returns "no price for this covering").

---

## Verification steps before pushing

After cowork generates the files, run on this branch:

```bash
npm install
npm run typecheck   # must pass — verifies the data matches the types
npm run build       # must pass — verifies static generation of all frame pages
npm run dev         # spot-check: open /, click a frame, pick a cover, see retail price
```

If `typecheck` fails, the data shape is wrong — fix the generator script, don't soften the types.

---

## Open questions cowork can defer to Zach

- Frame hero images — sourcing strategy (AL Brandfolder? own photography? scraping americanleather.com)
- Whether non-Parker collections share Parker's leg + contrast options or need their own option sets (the brief assumes they do for now; if wrong, cowork should leave `options` empty for non-Parker frames and the app will still work)
- Whether to expose all 137 models in v1 or filter to a curated showroom subset (Zach can curate later by removing entries from `frames.ts`)

---

## Why this split makes sense

- **Showroom side (here):** UI, pricing math, cart, NFC URL routing, export pipeline. Done.
- **Cowork side (there):** parsing, image processing, CDN upload, grade lookup. Has the data.

Two parallel workstreams that meet at `lib/covers.ts` and `lib/frames.ts`.
