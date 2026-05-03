export type OptionChoice = {
  id: string;
  label: string;
  // Optional visual aids
  swatch?: string;       // hex color or path to small swatch image
  image?: string;        // larger preview image (e.g., a leg style render)
  note?: string;         // short helper text shown under the choice
  upcharge?: number;     // dollar adjustment vs. base option (display only for now)
};

export type OptionGroup = {
  id: string;            // e.g. "leather"
  label: string;         // e.g. "Leather"
  kind: "swatch" | "tile" | "select"; // controls how it's rendered
  required?: boolean;
  choices: OptionChoice[];
};

export type Product = {
  id: string;            // slug used in URL: /p/parker-chair
  brand: string;
  name: string;
  shortDescription: string;
  heroImage: string;     // large hero photo
  basePrice?: number;    // optional, display-only
  configuratorUrl?: string; // optional manufacturer configurator embed
  options: OptionGroup[];
};

export type CartLineSelections = Record<string, string>; // optionGroupId -> choiceId

export type CartLine = {
  lineId: string;        // unique per add-to-cart
  productId: string;
  selections: CartLineSelections;
  quantity: number;
  notes?: string;
  addedAt: number;
};

export type Quote = {
  client: string;
  room?: string;
  designer?: string;
  lines: CartLine[];
  createdAt: number;
};
