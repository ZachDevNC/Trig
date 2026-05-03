import type { Product } from "./types";

// NOTE: Placeholder data for the American Leather Parker chair.
// Real option lists, swatch images, and pricing should be confirmed with the
// rep / spec sheet, then either edited here or migrated to Airtable.
export const products: Product[] = [
  {
    id: "parker-chair",
    brand: "American Leather",
    name: "Parker Chair",
    shortDescription:
      "Sculpted lounge chair with a tailored silhouette. Available in a wide range of leathers, fabrics, and base finishes.",
    heroImage:
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1600&q=80",
    basePrice: 3895,
    options: [
      {
        id: "covering-type",
        label: "Covering",
        kind: "tile",
        required: true,
        choices: [
          { id: "leather", label: "Leather" },
          { id: "fabric", label: "Fabric" },
          { id: "com", label: "COM (Customer's Own Material)", note: "Designer to provide yardage and spec." },
        ],
      },
      {
        id: "leather",
        label: "Leather Color",
        kind: "swatch",
        choices: [
          { id: "bisonte-bone",   label: "Bisonte — Bone",     swatch: "#e8dccd" },
          { id: "bisonte-stone",  label: "Bisonte — Stone",    swatch: "#a89e93" },
          { id: "bisonte-saddle", label: "Bisonte — Saddle",   swatch: "#8a5a3b" },
          { id: "bisonte-walnut", label: "Bisonte — Walnut",   swatch: "#5a3a28" },
          { id: "bisonte-noir",   label: "Bisonte — Noir",     swatch: "#1f1c19" },
          { id: "capri-cognac",   label: "Capri — Cognac",     swatch: "#8b4a2b", upcharge: 250 },
          { id: "capri-oxblood",  label: "Capri — Oxblood",    swatch: "#5e1f23", upcharge: 250 },
          { id: "capri-fog",      label: "Capri — Fog",        swatch: "#9a9a96", upcharge: 250 },
        ],
      },
      {
        id: "fabric",
        label: "Fabric",
        kind: "swatch",
        choices: [
          { id: "linen-natural",  label: "Linen — Natural",  swatch: "#e7dec7" },
          { id: "linen-flax",     label: "Linen — Flax",     swatch: "#c9b48a" },
          { id: "boucle-ivory",   label: "Bouclé — Ivory",   swatch: "#efe8d8" },
          { id: "boucle-charcoal",label: "Bouclé — Charcoal",swatch: "#3a3a3a" },
          { id: "velvet-moss",    label: "Velvet — Moss",    swatch: "#4a5a3b" },
          { id: "velvet-rust",    label: "Velvet — Rust",    swatch: "#9a4a2b" },
        ],
      },
      {
        id: "base",
        label: "Base Finish",
        kind: "tile",
        required: true,
        choices: [
          { id: "walnut",         label: "Walnut" },
          { id: "natural-oak",    label: "Natural Oak" },
          { id: "ebonized-oak",   label: "Ebonized Oak" },
          { id: "brushed-steel",  label: "Brushed Steel", upcharge: 200 },
          { id: "matte-black",    label: "Matte Black",   upcharge: 200 },
        ],
      },
      {
        id: "swivel",
        label: "Swivel",
        kind: "tile",
        required: true,
        choices: [
          { id: "fixed",  label: "Fixed" },
          { id: "swivel", label: "Swivel", upcharge: 150 },
          { id: "swivel-return", label: "Swivel Return", upcharge: 250 },
        ],
      },
      {
        id: "contrast-stitch",
        label: "Contrast Stitching",
        kind: "tile",
        choices: [
          { id: "tonal", label: "Tonal (matches covering)" },
          { id: "white", label: "White" },
          { id: "black", label: "Black" },
          { id: "tan",   label: "Tan" },
        ],
      },
    ],
  },
];

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
