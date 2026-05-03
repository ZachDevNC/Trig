"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { useCart } from "@/lib/cart";
import { OptionPicker } from "@/components/OptionPicker";

export function ProductView({ product }: { product: Product }) {
  const cart = useCart();
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState("");
  const [justAdded, setJustAdded] = useState(false);

  // Hide fabric picker when leather is chosen, and vice versa.
  const visibleGroups = useMemo(() => {
    const covering = selections["covering-type"];
    return product.options.filter((g) => {
      if (g.id === "leather" && covering && covering !== "leather") return false;
      if (g.id === "fabric" && covering && covering !== "fabric") return false;
      return true;
    });
  }, [product.options, selections]);

  const missingRequired = visibleGroups
    .filter((g) => g.required && !selections[g.id])
    .map((g) => g.label);

  const upchargeTotal = visibleGroups.reduce((sum, g) => {
    const c = g.choices.find((x) => x.id === selections[g.id]);
    return sum + (c?.upcharge ?? 0);
  }, 0);

  const handleAdd = () => {
    if (missingRequired.length > 0) return;
    cart.addLine(product.id, selections, notes || undefined);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  return (
    <div className="max-w-5xl mx-auto px-5 py-6">
      <Link href="/" className="text-xs text-black/50 hover:text-black">← Catalog</Link>

      <div className="mt-4 grid md:grid-cols-2 gap-8">
        <div className="md:sticky md:top-4 self-start">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.heroImage}
            alt={product.name}
            className="w-full aspect-[4/3] object-cover rounded-xl ring-1 ring-black/10 bg-white"
          />
          {product.configuratorUrl ? (
            <a
              href={product.configuratorUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block text-sm text-black/70 underline"
            >
              Open manufacturer 3D configurator ↗
            </a>
          ) : null}
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest text-black/50">{product.brand}</p>
          <h1 className="text-2xl font-semibold">{product.name}</h1>
          {product.basePrice ? (
            <p className="text-sm text-black/60 mt-1">
              From ${product.basePrice.toLocaleString()}
              {upchargeTotal ? <> · selected options +${upchargeTotal.toLocaleString()}</> : null}
            </p>
          ) : null}
          <p className="text-sm text-black/70 mt-3 max-w-prose">{product.shortDescription}</p>

          {visibleGroups.map((group) => (
            <OptionPicker
              key={group.id}
              group={group}
              value={selections[group.id]}
              onChange={(choiceId) => setSelections((s) => ({ ...s, [group.id]: choiceId }))}
            />
          ))}

          <section className="border-t border-black/10 py-6">
            <h3 className="text-sm uppercase tracking-widest text-black/60 mb-3">Notes for vendor</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="e.g. customer requested extra back support, deliver before June 1"
              className="w-full px-3 py-2 rounded-md bg-bone/60 ring-1 ring-black/10 focus:ring-black/40 outline-none text-sm"
            />
          </section>

          <div className="sticky bottom-20 md:bottom-24 mt-4">
            {missingRequired.length > 0 ? (
              <p className="text-xs text-amber-700 mb-2">
                Choose: {missingRequired.join(", ")}
              </p>
            ) : null}
            <button
              onClick={handleAdd}
              disabled={missingRequired.length > 0}
              className="w-full py-4 rounded-lg bg-ink text-white text-sm font-medium disabled:opacity-50"
            >
              {justAdded ? "Added to quote ✓" : "Add to quote"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
