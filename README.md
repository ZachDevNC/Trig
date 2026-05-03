# Trig Showroom

iPad-first quote builder for the Trig Modern showroom. Designers tap an NFC tag on a product, configure options, and add to a client quote that gets exported back to the team.

## Stack

- Next.js 15 (App Router) + TypeScript + Tailwind
- Catalog: JSON in `lib/catalog.ts` (v1). Designed to swap to Airtable later — `getProduct()` is the only call site that needs to change.
- Cart state: React context + `localStorage` (`lib/cart.tsx`)
- Quote submission: `POST /api/quote` (currently logs server-side; wire to email / Sheet / Airtable next)

## Run locally

```bash
npm install
npm run dev
# open http://localhost:3000
```

## NFC tag encoding

Each product page lives at `/p/<product-id>`. Encode that full URL onto each NFC tag (NTAG215 stickers, free "NFC Tools" app).

Example: `https://your-domain.com/p/parker-chair`

## Adding products

Until we wire up Airtable, edit `lib/catalog.ts`. The `Product` type lives in `lib/types.ts`.

Option groups support three render styles:
- `swatch` — color/fabric tiles in a grid (uses `swatch` hex color or image)
- `tile`   — text tiles (good for arm style, base finish, swivel)
- `select` — reserved for a future dropdown variant

## TODOs (next session)

- Confirm real Parker chair option list with American Leather rep / spec sheet
- Replace the placeholder hero image with a proper product photo
- Pick a quote destination (email via Resend, Google Sheet via Apps Script, or Airtable record)
- Migrate catalog to Airtable
- Optional: embed manufacturer 3D configurator where available
