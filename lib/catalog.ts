import type { Product } from "./types";

// Source: American Leather wholesale price list, effective April 15, 2026
// (Trig3 LLC). Pricing shown is WHOLESALE / dealer cost — not retail.
//
// Specific leather color names and fabric SKUs within each grade are NOT in
// this sheet; they live in the AL leather/fabric sample books. Designers add
// the specific color/fabric in the per-line notes for now. When we have those
// books digitized we can add a color picker filtered by selected grade.

export const products: Product[] = [
  {
    id: "parker-chair",
    brand: "American Leather",
    collection: "Parker",
    name: "Parker Chair",
    sku: "PKR-CHR-ST",
    comYards: 7,
    shortDescription:
      "Sculpted lounge chair with a tailored silhouette and buttonless tufted seat and back cushions.",
    features: [
      "Advanced unidirectional suspension system",
      "Premium high-density, high-resiliency foam seat cushions",
      "Buttonless tufted seat and back cushions",
      "Single needle topstitching",
      "Stainless steel legs (standard)",
      "Lifetime warranty on frame and suspension",
    ],
    heroImage:
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1600&q=80",
    priceFromOption: "covering-grade",
    options: [
      {
        id: "covering-grade",
        label: "Covering & Grade",
        kind: "tile",
        required: true,
        choices: [
          { id: "leather-c",  label: "Leather Grade C",   price: 1700 },
          { id: "leather-df", label: "Leather Grade D/F", price: 1775 },
          { id: "leather-g",  label: "Leather Grade G",   price: 1875 },
          { id: "leather-h",  label: "Leather Grade H",   price: 1950 },
          { id: "leather-j",  label: "Leather Grade J",   price: 2025 },
          { id: "fabric-i",   label: "Fabric Grade I",    price: 1425 },
          { id: "fabric-ii",  label: "Fabric Grade II",   price: 1475 },
          { id: "fabric-iii", label: "Fabric Grade III",  price: 1550 },
          { id: "fabric-v",   label: "Fabric Grade V",    price: 1650 },
          {
            id: "col",
            label: "C.O.L. — Customer's Own Leather",
            price: 1775,
            note: "Priced at Grade D/F. Designer to provide leather hide spec.",
          },
          {
            id: "com",
            label: "C.O.M. — Customer's Own Material",
            price: 1425,
            note: "Priced at Grade I. Designer to provide 7 yards. Not recommended for patterned fabrics requiring flow matching.",
          },
        ],
      },
      {
        id: "legs",
        label: "Leg Finish",
        kind: "tile",
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
        kind: "tile",
        choices: [
          { id: "no",  label: "No — uniform covering" },
          {
            id: "yes",
            label: "Yes — designer to specify contrast covering in notes",
          },
        ],
      },
    ],
  },
];

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

// Compute the wholesale unit price for a given product + selections.
export function computeUnitPrice(
  product: Product,
  selections: Record<string, string>,
): number {
  let base = 0;
  if (product.priceFromOption) {
    const group = product.options.find((g) => g.id === product.priceFromOption);
    const choice = group?.choices.find((c) => c.id === selections[product.priceFromOption!]);
    base = choice?.price ?? 0;
  }
  const upcharges = product.options.reduce((sum, g) => {
    if (g.id === product.priceFromOption) return sum;
    const c = g.choices.find((x) => x.id === selections[g.id]);
    return sum + (c?.upcharge ?? 0);
  }, 0);
  return base + upcharges;
}
