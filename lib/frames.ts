import type { Frame } from "./types";

// Source: AL wholesale price list (Trig3 LLC), eff. April 15 2026 — Parker family.
// MVP scope is intentionally narrow: 5 frames across the Parker collection
// to demonstrate breadth (chair → ottoman → chaise → mid-size sofa →
// square corner return sofa). Real al_pricebook.json drop will replace this.

const PARKER_FEATURES = [
  "Advanced unidirectional suspension system",
  "Premium high-density, high-resiliency foam seat cushions",
  "Buttonless tufted seat and back cushions",
  "Single needle topstitching",
  "Stainless steel legs (standard)",
  "Lifetime warranty on frame and suspension",
];

const PARKER_OPTIONS = [
  {
    id: "legs",
    label: "Leg Finish",
    kind: "tile" as const,
    required: true,
    choices: [
      { id: "stainless", label: "Stainless Steel", note: "Standard" },
      { id: "dune",      label: "Dune (Wood)" },
      { id: "ebony",     label: "Ebony (Wood)" },
      { id: "mink",      label: "Mink (Wood)" },
      { id: "oiled-ash", label: "Oiled Ash (Wood)" },
    ],
  },
  {
    id: "contrast",
    label: "Contrasting Seat & Back Cushions",
    kind: "tile" as const,
    choices: [
      { id: "no",  label: "No — uniform covering" },
      { id: "yes", label: "Yes — designer to specify in notes" },
    ],
  },
];

// Real American Leather product photography (sourced from americanleather.com).
// Other Parker SKUs still use placeholders pending dedicated photos.
const PARKER_HERO =
  "https://cdn11.bigcommerce.com/s-y52856za8c/images/stencil/1280x1280/products/1501/7949/AL25_Chair_Parker_45__21938.1760974881.jpg?c=2";
const SOFA_HERO =
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1600&q=80";
const OTTOMAN_HERO =
  "https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&w=1600&q=80";
const CHAISE_HERO =
  "https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=1600&q=80";
const CORNER_HERO =
  "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1600&q=80";

export const frames: Frame[] = [
  {
    id: "parker-chair",
    brand: "American Leather",
    collection: "Parker",
    name: "Parker Chair",
    sku: "PKR-CHR-ST",
    comYards: 7,
    shortDescription:
      "Sculpted lounge chair with a tailored silhouette and buttonless tufted cushions.",
    features: PARKER_FEATURES,
    heroImage: PARKER_HERO,
    wholesale: {
      "Leather C":   1700,
      "Leather D/F": 1775,
      "Leather G":   1875,
      "Leather H":   1950,
      "Leather J":   2025,
      "Fabric I":    1425,
      "Fabric II":   1475,
      "Fabric III":  1550,
      "Fabric V":    1650,
    },
    options: PARKER_OPTIONS,
  },
  {
    id: "parker-mid-sofa",
    brand: "American Leather",
    collection: "Parker",
    name: "Parker Mid-Size Sofa",
    sku: "PKR-SM2-ST",
    comYards: 11,
    shortDescription:
      "Two-seat mid-size sofa. Ideal for apartments and second seating arrangements.",
    features: PARKER_FEATURES,
    heroImage: SOFA_HERO,
    wholesale: {
      "Leather C":   2325,
      "Leather D/F": 2475,
      "Leather G":   2625,
      "Leather H":   2725,
      "Leather J":   2925,
      "Fabric I":    1800,
      "Fabric II":   1850,
      "Fabric III":  1975,
      "Fabric V":    2100,
    },
    options: PARKER_OPTIONS,
  },
  {
    id: "parker-chaise-la",
    brand: "American Leather",
    collection: "Parker",
    name: "Parker Small Chaise — Left Arm",
    sku: "PKR-SCH-LA",
    comYards: 8,
    shortDescription:
      "Compact chaise with the arm on the left as you sit. Pairs with the mid-size sofa for a sectional.",
    features: PARKER_FEATURES,
    heroImage: CHAISE_HERO,
    wholesale: {
      "Leather C":   1900,
      "Leather D/F": 2025,
      "Leather G":   2150,
      "Leather H":   2225,
      "Leather J":   2325,
      "Fabric I":    1625,
      "Fabric II":   1675,
      "Fabric III":  1775,
      "Fabric V":    1900,
    },
    options: PARKER_OPTIONS,
  },
  {
    id: "parker-ottoman",
    brand: "American Leather",
    collection: "Parker",
    name: "Parker Ottoman",
    sku: "PKR-OTO-ST",
    comYards: 4,
    shortDescription:
      "Standard ottoman that pairs with the Parker chair. Doubles as occasional seating.",
    features: PARKER_FEATURES,
    heroImage: OTTOMAN_HERO,
    wholesale: {
      "Leather C":    900,
      "Leather D/F": 1000,
      "Leather G":   1050,
      "Leather H":   1075,
      "Leather J":   1125,
      "Fabric I":     800,
      "Fabric II":    825,
      "Fabric III":   875,
      "Fabric V":     900,
    },
    options: PARKER_OPTIONS,
  },
  {
    id: "parker-corner-la",
    brand: "American Leather",
    collection: "Parker",
    name: "Parker Square Corner Return Sofa — Left Arm",
    sku: "PKR-SQS-LA",
    comYards: 16,
    shortDescription:
      "Corner-return sofa with the arm on the left. Anchors a room and seats four comfortably.",
    features: PARKER_FEATURES,
    heroImage: CORNER_HERO,
    wholesale: {
      "Leather C":   2700,
      "Leather D/F": 2825,
      "Leather G":   3000,
      "Leather H":   3125,
      "Leather J":   3325,
      "Fabric I":    2075,
      "Fabric II":   2125,
      "Fabric III":  2250,
      "Fabric V":    2425,
    },
    options: PARKER_OPTIONS,
  },
];

export function getFrame(id: string): Frame | undefined {
  return frames.find((f) => f.id === id);
}
