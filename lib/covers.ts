import type { Cover } from "./types";

// MVP placeholder swatch library. ~25 covers spread across types and grades
// so the tier and type filters demonstrate well. Cover/color names are
// PLACEHOLDERS — real names + photos arrive when data/swatches.json (894
// images / 664 unique swatches) lands.
//
// To swap in real data later: replace this array with the parsed contents
// of swatches.json, joined against covers_grade_lookup.csv for `grade`.
export const covers: Cover[] = [
  // ── Fabric Standard (Grade I / II) ──────────────────────────────────────
  { id: "brae-cinnamon",      cover: "Brae",       color: "Cinnamon",     type: "fabric",     grade: "I",  swatchHex: "#a85a3b" },
  { id: "brae-sand",          cover: "Brae",       color: "Sand",         type: "fabric",     grade: "I",  swatchHex: "#d8c8a8" },
  { id: "brae-stone",         cover: "Brae",       color: "Stone",        type: "fabric",     grade: "I",  swatchHex: "#a89e93" },
  { id: "heritage-bone",      cover: "Heritage",   color: "Bone",         type: "fabric",     grade: "I",  swatchHex: "#ece2cf" },
  { id: "heritage-pebble",    cover: "Heritage",   color: "Pebble",       type: "fabric",     grade: "II", swatchHex: "#a09286" },
  { id: "linen-natural",      cover: "Linen",      color: "Natural",      type: "fabric",     grade: "II", swatchHex: "#e7dec7" },
  { id: "linen-flax",         cover: "Linen",      color: "Flax",         type: "fabric",     grade: "II", swatchHex: "#c9b48a" },
  { id: "ultrasuede-stone",   cover: "Ultrasuede", color: "Stone",        type: "microfiber", grade: "II", swatchHex: "#9b9189" },

  // ── Fabric Premium (Grade III / V) ──────────────────────────────────────
  { id: "boucle-ivory",       cover: "Bouclé",     color: "Ivory",        type: "fabric",     grade: "III", swatchHex: "#efe8d8" },
  { id: "boucle-charcoal",    cover: "Bouclé",     color: "Charcoal",     type: "fabric",     grade: "III", swatchHex: "#3a3a3a" },
  { id: "velvet-moss",        cover: "Velvet",     color: "Moss",         type: "fabric",     grade: "III", swatchHex: "#4a5a3b" },
  { id: "velvet-rust",        cover: "Velvet",     color: "Rust",         type: "fabric",     grade: "V",   swatchHex: "#9a4a2b" },
  { id: "mohair-graphite",    cover: "Mohair",     color: "Graphite",     type: "fabric",     grade: "V",   swatchHex: "#41423f" },
  { id: "alpaca-cream",       cover: "Alpaca",     color: "Cream",        type: "fabric",     grade: "V",   swatchHex: "#ece4cf" },

  // ── Leather Entry (Grade C) ─────────────────────────────────────────────
  { id: "bisonte-bone",       cover: "Bisonte",    color: "Bone",         type: "leather",    grade: "C",   swatchHex: "#e8dccd" },
  { id: "bisonte-saddle",     cover: "Bisonte",    color: "Saddle",       type: "leather",    grade: "C",   swatchHex: "#8a5a3b" },
  { id: "bisonte-walnut",     cover: "Bisonte",    color: "Walnut",       type: "leather",    grade: "C",   swatchHex: "#5a3a28" },
  { id: "bisonte-noir",       cover: "Bisonte",    color: "Noir",         type: "leather",    grade: "C",   swatchHex: "#1f1c19" },

  // ── Leather Classic (Grade D/F or G) ────────────────────────────────────
  { id: "capri-cognac",       cover: "Capri",      color: "Cognac",       type: "leather",    grade: "D/F", swatchHex: "#8b4a2b" },
  { id: "capri-fog",          cover: "Capri",      color: "Fog",          type: "leather",    grade: "D/F", swatchHex: "#9a9a96" },
  { id: "como-mist",          cover: "Como",       color: "Mist",         type: "leather",    grade: "G",   swatchHex: "#bcbab2" },
  { id: "como-tobacco",       cover: "Como",       color: "Tobacco",      type: "leather",    grade: "G",   swatchHex: "#6b4524" },

  // ── Leather Premium (Grade H / J) ───────────────────────────────────────
  { id: "mont-blanc-caramel", cover: "Mont Blanc", color: "Caramel",      type: "leather",    grade: "H",   swatchHex: "#a9683b" },
  { id: "mont-blanc-onyx",    cover: "Mont Blanc", color: "Onyx",         type: "leather",    grade: "H",   swatchHex: "#171513" },
  { id: "riviera-oxblood",    cover: "Riviera",    color: "Oxblood",      type: "leather",    grade: "J",   swatchHex: "#5e1f23" },
  { id: "riviera-ivory",      cover: "Riviera",    color: "Ivory",        type: "leather",    grade: "J",   swatchHex: "#f0e7d7" },
];

export function getCover(id: string): Cover | undefined {
  return covers.find((c) => c.id === id);
}
