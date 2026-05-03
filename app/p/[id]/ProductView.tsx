"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Cover, CoveringSelection, Frame } from "@/lib/types";
import { useCart } from "@/lib/cart";
import { covers as allCovers, priceFor } from "@/lib/catalog";
import { coverTierLabel } from "@/lib/tiers";
import { SwatchGrid } from "@/components/SwatchGrid";
import { OptionPicker } from "@/components/OptionPicker";
import { ProductGallery } from "@/components/ProductGallery";

const formatUSD = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export function ProductView({ frame }: { frame: Frame }) {
  const cart = useCart();
  const [coverId, setCoverId] = useState<string | undefined>();
  const [coveringMode, setCoveringMode] = useState<"library" | "com" | "col">("library");
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState("");
  const [justAdded, setJustAdded] = useState(false);

  const covering: CoveringSelection | null = useMemo(() => {
    if (coveringMode === "com") return { kind: "com" };
    if (coveringMode === "col") return { kind: "col" };
    if (coverId) return { kind: "cover", coverId };
    return null;
  }, [coveringMode, coverId]);

  const selectedCover: Cover | undefined = useMemo(
    () => (coverId ? allCovers.find((c) => c.id === coverId) : undefined),
    [coverId],
  );

  const price = useMemo(() => (covering ? priceFor(frame, covering) : null), [frame, covering]);

  const missingRequired = (frame.options ?? [])
    .filter((g) => g.required && !selections[g.id])
    .map((g) => g.label);
  const coverMissing = !covering;

  const canAdd = !coverMissing && missingRequired.length === 0 && !!price;

  const handleAdd = () => {
    if (!canAdd || !covering || !price) return;
    cart.addLine({
      frameId: frame.id,
      covering,
      selections,
      notes: notes || undefined,
      wholesaleUnit: price.wholesale,
      retailUnit: price.retail,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 pt-6 pb-32">
      <Link href="/" className="text-xs text-black/45 hover:text-black tracking-wide">← Catalog</Link>

      <div className="mt-4 grid lg:grid-cols-[1.05fr_1fr] gap-10">
        {/* Hero column */}
        <div className="lg:sticky lg:top-6 self-start">
          <ProductGallery
            images={frame.heroImages?.length ? frame.heroImages : [frame.heroImage]}
            alt={frame.name}
          />

          {selectedCover ? (
            <div className="mt-4 flex items-center gap-3 rounded-xl bg-white shadow-card p-3">
              <span
                className="block w-12 h-12 rounded-lg shrink-0"
                style={
                  selectedCover.imageUrl
                    ? { background: `url(${selectedCover.imageUrl}) center/cover` }
                    : { background: selectedCover.swatchHex ?? "#ddd" }
                }
                aria-hidden
              />
              <div className="text-sm leading-tight">
                <div className="text-[11px] uppercase tracking-widest text-black/40">
                  {coverTierLabel(selectedCover)}
                </div>
                <div className="font-medium">
                  {selectedCover.cover} <span className="text-black/50">— {selectedCover.color}</span>
                </div>
              </div>
            </div>
          ) : null}

          <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            <dt className="text-black/45">SKU</dt>
            <dd className="font-mono">{frame.sku}</dd>
            <dt className="text-black/45">C.O.M. yardage</dt>
            <dd>{frame.comYards} yds</dd>
          </dl>

          {frame.features?.length ? (
            <details className="mt-4 text-sm">
              <summary className="cursor-pointer text-black/55 select-none">Standard features</summary>
              <ul className="mt-2 grid gap-1 text-black/65 list-disc pl-5 text-[13px]">
                {frame.features.map((f) => <li key={f}>{f}</li>)}
              </ul>
            </details>
          ) : null}
        </div>

        {/* Configuration column */}
        <div>
          <p className="text-[11px] uppercase tracking-widest text-black/40">
            {frame.brand} · {frame.collection}
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tightish mt-1">{frame.name}</h1>

          <div className="mt-2 flex items-baseline gap-3">
            {price ? (
              <>
                <span className="text-2xl font-medium text-accent">{formatUSD(price.retail)}</span>
                <span className="text-xs text-black/40">retail</span>
              </>
            ) : (
              <span className="text-sm text-black/40">Choose a covering for pricing</span>
            )}
          </div>

          <p className="text-sm text-black/65 mt-4 max-w-prose">{frame.shortDescription}</p>

          {/* Covering picker */}
          <section className="border-t border-black/[0.08] py-6 mt-6">
            <div className="flex items-baseline justify-between mb-4">
              <h3 className="text-[11px] uppercase tracking-widest text-black/40">Covering</h3>
              <div className="flex gap-1.5">
                {(["library", "com", "col"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      setCoveringMode(m);
                      if (m !== "library") setCoverId(undefined);
                    }}
                    className={`px-2.5 py-1 rounded-full text-[11px] transition ${
                      coveringMode === m
                        ? "bg-ink text-white"
                        : "bg-white ring-1 ring-black/10 text-black/65 hover:ring-black/30"
                    }`}
                  >
                    {m === "library" ? "AL Library" : m.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {coveringMode === "library" ? (
              <SwatchGrid
                covers={allCovers}
                selectedId={coverId}
                onSelect={(c) => setCoverId(c.id)}
              />
            ) : (
              <div className="rounded-xl bg-bone p-5 text-sm text-black/75">
                {coveringMode === "com" ? (
                  <>
                    <strong>C.O.M. — Customer's Own Material</strong>
                    <p className="mt-1 text-black/65">
                      Designer ships {frame.comYards} yds to AL. Priced at Fabric Grade I.
                      Note specific fabric in the field below. Not recommended for patterned fabrics requiring flow matching.
                    </p>
                  </>
                ) : (
                  <>
                    <strong>C.O.L. — Customer's Own Leather</strong>
                    <p className="mt-1 text-black/65">
                      Designer provides hide spec to AL. Priced at Leather Grade D/F.
                    </p>
                  </>
                )}
              </div>
            )}
          </section>

          {(frame.options ?? []).map((group) => (
            <OptionPicker
              key={group.id}
              group={group}
              value={selections[group.id]}
              onChange={(choiceId) => setSelections((s) => ({ ...s, [group.id]: choiceId }))}
            />
          ))}

          <section className="border-t border-black/[0.08] py-6">
            <h3 className="text-[11px] uppercase tracking-widest text-black/40 mb-3">Notes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="e.g. contrast cushion in Bisonte Saddle, deliver before June 1"
              className="w-full px-3 py-2.5 rounded-lg bg-bone ring-1 ring-black/[0.06] focus:ring-accent/50 outline-none text-sm"
            />
          </section>

          <div className="sticky bottom-20 md:bottom-24 mt-6">
            {coverMissing ? (
              <p className="text-xs text-accent mb-2">Select a covering to continue.</p>
            ) : missingRequired.length > 0 ? (
              <p className="text-xs text-accent mb-2">Choose: {missingRequired.join(", ")}</p>
            ) : null}
            <button
              onClick={handleAdd}
              disabled={!canAdd}
              className={`w-full py-4 rounded-full text-sm font-medium transition ${
                canAdd
                  ? "bg-accent hover:bg-accent-600 text-white shadow-card"
                  : "bg-black/[0.06] text-black/35"
              }`}
            >
              {justAdded ? "Added to quote ✓" : price ? `Add to quote — ${formatUSD(price.retail)}` : "Add to quote"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
