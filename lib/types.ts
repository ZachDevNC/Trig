export type OptionChoice = {
  id: string;
  label: string;
  // Optional visual aids
  swatch?: string;       // hex color or path to small swatch image
  image?: string;        // larger preview image (e.g., a leg style render)
  note?: string;         // short helper text shown under the choice
  // Pricing: when this choice is in the product's `priceFromOption` group,
  // its `price` becomes the line's wholesale base. Otherwise `upcharge` adds
  // to the base.
  price?: number;
  upcharge?: number;
};

export type OptionGroup = {
  id: string;
  label: string;
  kind: "swatch" | "tile" | "select"; // controls how it's rendered
  required?: boolean;
  choices: OptionChoice[];
};

export type Product = {
  id: string;            // slug used in URL: /p/parker-chair
  brand: string;
  collection?: string;   // e.g. "Parker"
  name: string;          // display name e.g. "Parker Chair"
  sku?: string;          // e.g. "PKR-CHR-ST"
  comYards?: number;     // COM yardage required for this frame
  shortDescription: string;
  features?: string[];   // bullet list of standard features
  heroImage: string;
  configuratorUrl?: string; // optional manufacturer configurator embed
  // ID of the option group whose selected choice provides the line's base
  // price (`OptionChoice.price`). Other groups' `upcharge` values add on top.
  priceFromOption?: string;
  options: OptionGroup[];
};

export type CartLineSelections = Record<string, string>; // optionGroupId -> choiceId

export type CartLine = {
  lineId: string;        // unique per add-to-cart
  productId: string;
  selections: CartLineSelections;
  quantity: number;
  notes?: string;
  unitPrice?: number;    // captured at add-to-cart for snapshot stability
  addedAt: number;
};

export type Quote = {
  client: string;
  room?: string;
  designer?: string;
  lines: CartLine[];
  createdAt: number;
};
