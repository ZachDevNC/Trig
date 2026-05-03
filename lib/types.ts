// Trig retail markup applied to AL wholesale across the entire line.
export const RETAIL_MULTIPLIER = 2.5;

// AL real grades. Used internally for pricing lookups.
export type CoverType = "fabric" | "leather" | "microfiber";

export type FabricGrade = "I" | "II" | "III" | "V";
export type LeatherGrade = "C" | "D/F" | "G" | "H" | "J";
export type CoverGrade = FabricGrade | LeatherGrade;

// Tier strings used in the al_pricebook.json wholesale map keys.
// e.g. "Leather D/F", "Fabric III"
export type GradeKey =
  | `Leather ${LeatherGrade}`
  | `Fabric ${FabricGrade}`;

// Trig's customer-facing tiers — collapse 9 AL grades into 5 tiers.
export type Tier =
  | "fabric-standard"
  | "fabric-premium"
  | "leather-entry"
  | "leather-classic"
  | "leather-premium";

export type Cover = {
  id: string;          // stable slug e.g. "brae-cinnamon"
  cover: string;       // cover/material name e.g. "Brae"
  color: string;       // color variant e.g. "Cinnamon"
  type: CoverType;
  grade: CoverGrade;
  swatchHex?: string;  // placeholder color until real images are uploaded
  imageUrl?: string;   // CDN URL for the swatch hero image (when available)
};

export type Frame = {
  id: string;          // url slug e.g. "parker-chair"
  brand: string;       // "American Leather"
  collection: string;  // "Parker"
  name: string;        // "Parker Chair"
  sku: string;         // "PKR-CHR-ST"
  comYards: number;
  shortDescription: string;
  features?: string[];
  heroImage: string;
  // Optional product gallery. Falls back to [heroImage] when absent.
  heroImages?: string[];
  // wholesale price keyed by GradeKey ("Leather C", "Fabric I", ...)
  wholesale: Partial<Record<GradeKey, number>>;
  // C.O.M./C.O.L. price overrides (default to Fabric I / Leather D/F)
  comOverrideKey?: GradeKey;  // default "Fabric I"
  colOverrideKey?: GradeKey;  // default "Leather D/F"
  options?: OptionGroup[];    // remaining configurable options (legs, contrast, etc.)
};

// Selections that aren't covers — leg finish, contrast cushions, etc.
export type OptionChoice = {
  id: string;
  label: string;
  note?: string;
  upcharge?: number;
};

export type OptionGroup = {
  id: string;
  label: string;
  kind: "tile";
  required?: boolean;
  choices: OptionChoice[];
};

// One configured product in the cart. The covering is a single value:
// a Cover.id, the literal "com", or the literal "col".
export type CoveringSelection =
  | { kind: "cover"; coverId: string }
  | { kind: "com" }
  | { kind: "col" };

export type CartLine = {
  lineId: string;
  frameId: string;
  covering: CoveringSelection;
  selections: Record<string, string>; // optionGroupId -> choiceId
  quantity: number;
  notes?: string;
  wholesaleUnit: number;  // captured at add-to-cart
  retailUnit: number;     // captured at add-to-cart
  addedAt: number;
};

export type Quote = {
  client: string;
  room?: string;
  designer?: string;
  lines: CartLine[];
  totals: { wholesale: number; retail: number };
  createdAt: number;
};
