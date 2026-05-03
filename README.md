# AL Swatch Configurator — Project Folder

Hand-off folder for building Trig Modern's American Leather configurator with Claude Code.

## Open with Claude Code

```bash
cd "Trig Build/AL_swatch_configurator"
claude
```

Claude Code reads `CLAUDE.md` automatically. That's the brief.

## Folder contents

```
AL_swatch_configurator/
├── CLAUDE.md                    Project context (Claude Code reads this)
├── README.md                    You are here
├── data/                        Source data — read-only
│   ├── swatches.json            664 unique swatches (primary)
│   ├── swatches.csv             Same data, spreadsheet
│   ├── swatches.sqlite          Same data, relational
│   ├── covers_grade_lookup.csv  134 covers, grade column empty (Phase 2)
│   └── al_pricebook.json        2,624 SKUs across 137 AL frame models
├── demo/                        UX target
│   └── AL_configurator_demo.html  Single-file HTML demo (open in browser)
└── scripts/                     Re-runnable parsers (regenerate data)
    ├── build_swatch_manifest.py
    └── build_configurator_demo.py
```

## What's done

- 894 raw swatch exports from AL Brandfolder → 664 deduped, classified swatches
- 134 unique covers identified
- Pricing data (wholesale × 2.5 = retail) for every AL frame model
- Visual MVP showing UX direction

## What's needed

- Configurator UI/UX (web, stack TBD)
- Grade column populated in `covers_grade_lookup.csv` (manual or PDF parse)
- Image upload to a CDN with public URLs

See `CLAUDE.md` for full brief.
