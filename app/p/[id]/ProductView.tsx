"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { useCart } from "@/lib/cart";
import { computeUnitPrice } from "@/lib/catalog";
import { OptionPicker } from "@/components/OptionPicker";

const formatUSD = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export function ProductView({ product }: { product: Product }) {
  const cart = useCart();
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState("");
  const [justAdded, setJustAdded] = useState(false);

  const missingRequired = product.options
    .filter((g) => g.required && !selections[g.id])
    .map((g) => g.label);

  const unitPrice = useMemo(() => computeUnitPrice(product, selections), [product, selections]);
  const priceReady = !!product.priceFromOption && !!selections[product.priceFromOption];

  const handleAdd = () => {
    if (missingRequired.length > 0) return;
    cart.addLine(product.id, selections, notes || undefined, unitPrice);
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

          {(product.sku || product.comYards) && (
            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              {product.sku ? (
                <>
                  <dt className="text-black/50">SKU</dt>
                  <dd className="font-mono">{product.sku}</dd>
                </>
              ) : null}
              {product.comYards ? (
                <>
                  <dt className="text-black/50">C.O.M. yardage</dt>
                  <dd>{product.comYards} yds</dd>
                </>
              ) : null}
            </dl>
          )}

          {product.features?.length ? (
            <details className="mt-4 text-sm">
              <summary className="cursor-pointer text-black/60">Standard features</summary>
              <ul className="mt-2 grid gap-1 text-black/70 list-disc pl-5 text-[13px]">
                {product.features.map((f) => <li key={f}>{f}</li>)}
              </ul>
            </details>
          ) : null}
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest text-black/50">
            {product.brand}{product.collection ? ` · ${product.collection}` : ""}
          </p>
          <h1 className="text-2xl font-semibold">{product.name}</h1>
          {priceReady ? (
            <p className="text-sm text-black/70 mt-1">
              <span className="font-medium">{formatUSD(unitPrice)}</span>
              <span className="text-black/40 ml-1.5 text-xs">wholesale</span>
            </p>
          ) : (
            <p className="text-sm text-black/40 mt-1">Select covering &amp; grade for pricing</p>
          )}
          <p className="text-sm text-black/70 mt-3 max-w-prose">{product.shortDescription}</p>

          {product.options.map((group) => (
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
              placeholder="e.g. specific leather color (Bisonte Saddle), contrast cushion fabric, delivery requirements"
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
