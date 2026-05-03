import type { Cover, CoverGrade, CoverType, GradeKey, Tier } from "./types";

// AL grade → Trig customer-facing tier.
// Mapping is a working assumption pending docs/grades_and_tiers.md.
// Symmetric breakpoints: Fabric splits at III, Leather splits at D/F and H.
export function gradeToTier(type: CoverType, grade: CoverGrade): Tier {
  if (type === "leather") {
    if (grade === "C") return "leather-entry";
    if (grade === "D/F" || grade === "G") return "leather-classic";
    if (grade === "H" || grade === "J") return "leather-premium";
  }
  // fabric and microfiber both map to fabric tiers
  if (grade === "I" || grade === "II") return "fabric-standard";
  return "fabric-premium"; // III or V
}

export const TIERS: {
  id: Tier;
  label: string;
  group: "Fabric" | "Leather";
  grades: CoverGrade[];
}[] = [
  { id: "fabric-standard", label: "Fabric — Standard", group: "Fabric", grades: ["I", "II"] },
  { id: "fabric-premium",  label: "Fabric — Premium",  group: "Fabric", grades: ["III", "V"] },
  { id: "leather-entry",   label: "Leather — Entry",   group: "Leather", grades: ["C"] },
  { id: "leather-classic", label: "Leather — Classic", group: "Leather", grades: ["D/F", "G"] },
  { id: "leather-premium", label: "Leather — Premium", group: "Leather", grades: ["H", "J"] },
];

export function tierLabel(tier: Tier): string {
  return TIERS.find((t) => t.id === tier)?.label ?? tier;
}

// Tier label with the AL grade range appended, e.g. "Fabric — Standard (I/II)".
// Used in filter pills so the customer sees both the friendly tier and the
// underlying AL grades that fall under it.
export function tierLabelWithRange(tier: Tier): string {
  const t = TIERS.find((t) => t.id === tier);
  if (!t) return tier;
  return `${t.label} (${t.grades.join("/")})`;
}

// Tier label tagged with a single AL grade, e.g. "Fabric — Standard · Grade I".
// Used wherever a specific cover is shown (selected swatch, cart line).
export function coverTierLabel(cover: Cover): string {
  return `${tierLabel(gradeToTier(cover.type, cover.grade))} · Grade ${cover.grade}`;
}

export function gradeKey(type: CoverType, grade: CoverGrade): GradeKey {
  // microfiber is priced as fabric in AL pricebooks
  return type === "leather"
    ? (`Leather ${grade}` as GradeKey)
    : (`Fabric ${grade}` as GradeKey);
}
