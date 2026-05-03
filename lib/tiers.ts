import type { CoverGrade, CoverType, GradeKey, Tier } from "./types";

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

export const TIERS: { id: Tier; label: string; group: "Fabric" | "Leather" }[] = [
  { id: "fabric-standard", label: "Fabric — Standard", group: "Fabric" },
  { id: "fabric-premium",  label: "Fabric — Premium",  group: "Fabric" },
  { id: "leather-entry",   label: "Leather — Entry",   group: "Leather" },
  { id: "leather-classic", label: "Leather — Classic", group: "Leather" },
  { id: "leather-premium", label: "Leather — Premium", group: "Leather" },
];

export function tierLabel(tier: Tier): string {
  return TIERS.find((t) => t.id === tier)?.label ?? tier;
}

export function gradeKey(type: CoverType, grade: CoverGrade): GradeKey {
  // microfiber is priced as fabric in AL pricebooks
  return type === "leather"
    ? (`Leather ${grade}` as GradeKey)
    : (`Fabric ${grade}` as GradeKey);
}
