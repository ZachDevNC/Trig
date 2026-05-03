import { frames, getFrame } from "./frames";
import { covers, getCover } from "./covers";
import { gradeKey } from "./tiers";
import { RETAIL_MULTIPLIER } from "./types";
import type { CoveringSelection, Frame } from "./types";

export { frames, getFrame, covers, getCover };

// Resolve the wholesale price for a frame + covering selection.
// Returns null when the lookup fails (e.g., COL with no override and the
// frame doesn't carry "Leather D/F" pricing).
export function resolveWholesale(
  frame: Frame,
  covering: CoveringSelection,
): number | null {
  if (covering.kind === "cover") {
    const cover = getCover(covering.coverId);
    if (!cover) return null;
    const key = gradeKey(cover.type, cover.grade);
    return frame.wholesale[key] ?? null;
  }
  if (covering.kind === "com") {
    const key = frame.comOverrideKey ?? "Fabric I";
    return frame.wholesale[key] ?? null;
  }
  if (covering.kind === "col") {
    const key = frame.colOverrideKey ?? "Leather D/F";
    return frame.wholesale[key] ?? null;
  }
  return null;
}

export function toRetail(wholesale: number): number {
  return Math.round(wholesale * RETAIL_MULTIPLIER);
}

export function priceFor(frame: Frame, covering: CoveringSelection):
  | { wholesale: number; retail: number }
  | null
{
  const w = resolveWholesale(frame, covering);
  if (w == null) return null;
  return { wholesale: w, retail: toRetail(w) };
}
