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
const PARKER_HERO =
  "https://cdn11.bigcommerce.com/s-y52856za8c/images/stencil/1280x1280/products/1501/7949/AL25_Chair_Parker_45__21938.1760974881.jpg?c=2";
const PARKER_GALLERY = [
  "https://cdn11.bigcommerce.com/s-y52856za8c/images/stencil/1280x1280/products/1501/7949/AL25_Chair_Parker_45__21938.1760974881.jpg?c=2",
  "https://cdn11.bigcommerce.com/s-y52856za8c/images/stencil/1280x1280/products/1501/7950/AL25_Chair_Parker_Side__09427.1760974886.jpg?c=2",
  "https://cdn11.bigcommerce.com/s-y52856za8c/images/stencil/1280x1280/products/1501/7951/AL25_Chair_Parker_Front__42041.1760974892.jpg?c=2",
];
const SOFA_GALLERY = [
  "https://cdn11.bigcommerce.com/s-y52856za8c/images/stencil/1280x1280/products/161/5830/AL_Web_Sofas_Front_Angle_45_Parker__03800__48965.1689954957.jpg?c=2",
  "https://cdn11.bigcommerce.com/s-y52856za8c/images/stencil/1280x1280/products/161/4574/AL_Web_Sofas_Front_Parker__32247.1689954951.jpg?c=2",
  "https://cdn11.bigcommerce.com/s-y52856za8c/images/stencil/1280x1280/products/161/5834/Parker-SO2-Fabric-45-Front_1__83008__98833.1689954969.jpg?c=2",
  "https://cdn11.bigcommerce.com/s-y52856za8c/images/stencil/1280x1280/products/161/5837/RM-Parker.LTH-HR__43952__30484.1689954990.jpg?c=2",
];
const SOFA_HERO = SOFA_GALLERY[0];

const OTTOMAN_GALLERY = [
  "https://cdn11.bigcommerce.com/s-y52856za8c/images/stencil/1280x1280/products/1502/7956/AL25_Ottoman_Parker_45__29552.1760975044.jpg?c=2",
  "https://cdn11.bigcommerce.com/s-y52856za8c/images/stencil/1280x1280/products/1502/7955/AL25_Ottoman_Parker_Front__49845.1760975038.jpg?c=2",
];
const OTTOMAN_HERO = OTTOMAN_GALLERY[0];

const CHAISE_GALLERY = [
  "https://cdn11.bigcommerce.com/s-y52856za8c/images/stencil/1280x1280/products/918/3556/Parker-Chaise-Lounge-Sectional__66202.1689954808.jpg?c=2",
  "https://cdn11.bigcommerce.com/s-y52856za8c/images/stencil/1280x1280/products/918/3557/Parker-Sectional-Chase-Talent__26215.1689954786.jpg?c=2",
];
const CHAISE_HERO = CHAISE_GALLERY[0];

const CORNER_GALLERY = [
  "https://cdn11.bigcommerce.com/s-y52856za8c/images/stencil/1280x1280/products/918/4900/PARKER_SECTIONAL__14290.1689954745.JPG?c=2",
  "https://cdn11.bigcommerce.com/s-y52856za8c/images/stencil/1280x1280/products/918/4899/PARKER_SECTIONAL2__92748.1689954750.JPG?c=2",
  "https://cdn11.bigcommerce.com/s-y52856za8c/images/stencil/1280x1280/products/918/3555/Parker-Sectional-Leather__85888.1689954770.jpg?c=2",
  "https://cdn11.bigcommerce.com/s-y52856za8c/images/stencil/1280x1280/products/918/5233/Parker-Bison_White_1__75125.1689954801.jpg?c=2",
];
const CORNER_HERO = CORNER_GALLERY[0];

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
    heroImages: PARKER_GALLERY,
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
    heroImages: SOFA_GALLERY,
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
    heroImages: CHAISE_GALLERY,
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
    heroImages: OTTOMAN_GALLERY,
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
    heroImages: CORNER_GALLERY,
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
