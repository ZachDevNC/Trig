"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";
import { getCover, getFrame } from "@/lib/catalog";
import { coverTierLabel } from "@/lib/tiers";

const formatUSD = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const cart = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<null | { ok: boolean; message: string }>(null);

  if (!open) return null;

  const submit = async () => {
    setSubmitting(true);
    setSubmitted(null);
    try {
      const quote = cart.toQuote();
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(quote),
      });
      const json = await res.json();
      setSubmitted(
        json.ok
          ? { ok: true, message: "Quote submitted." }
          : { ok: false, message: json.error ?? "Submit failed." },
      );
    } catch (e) {
      setSubmitted({ ok: false, message: e instanceof Error ? e.message : "Submit failed." });
    } finally {
      setSubmitting(false);
    }
  };

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(cart.toQuote(), null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `trig-quote-${(cart.client || "untitled").replace(/\s+/g, "-")}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totals = {
    retail:    cart.lines.reduce((s, l) => s + l.retailUnit    * l.quantity, 0),
    wholesale: cart.lines.reduce((s, l) => s + l.wholesaleUnit * l.quantity, 0),
  };

  return (
    <div className="fixed inset-0 z-40 flex">
      <div className="flex-1 bg-black/30" onClick={onClose} />
      <aside className="w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl">
        <header className="px-6 py-5 border-b border-black/[0.08] flex items-center sticky top-0 bg-white z-10">
          <h2 className="text-base font-semibold tracking-tightish">Quote</h2>
          <button onClick={onClose} className="ml-auto text-sm text-black/55 hover:text-black">
            Close
          </button>
        </header>

        <section className="px-6 py-5 grid gap-3">
          <Field label="Client" value={cart.client} onChange={cart.setClient} placeholder="e.g. Wilson Residence" />
          <Field label="Room" value={cart.room} onChange={cart.setRoom} placeholder="e.g. Living Room" />
          <Field label="Designer" value={cart.designer} onChange={cart.setDesigner} placeholder="Your name" />
        </section>

        <section className="px-6">
          {cart.lines.length === 0 ? (
            <p className="text-sm text-black/50 py-10 text-center">No items yet — scan a tag to begin.</p>
          ) : (
            <ul className="divide-y divide-black/[0.08]">
              {cart.lines.map((line) => {
                const frame = getFrame(line.frameId);
                if (!frame) return null;
                const cov = line.covering;
                const cover = cov.kind === "cover" ? getCover(cov.coverId) : undefined;
                const coveringLabel =
                  cov.kind === "com" ? "C.O.M." :
                  cov.kind === "col" ? "C.O.L." :
                  cover ? `${cover.cover} — ${cover.color}` : "—";
                const tier =
                  cov.kind === "cover" && cover
                    ? coverTierLabel(cover)
                    : cov.kind === "com" ? "Fabric — Standard · Grade I" : "Leather — Classic · Grade D/F";

                return (
                  <li key={line.lineId} className="py-4">
                    <div className="flex justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-[11px] uppercase tracking-widest text-black/40">{frame.brand}</div>
                        <div className="font-medium truncate">{frame.name}</div>
                        <div className="text-[11px] font-mono text-black/40">{frame.sku}</div>
                      </div>
                      <div className="flex items-start gap-2">
                        <button
                          onClick={() => cart.updateLine(line.lineId, { quantity: Math.max(1, line.quantity - 1) })}
                          className="w-8 h-8 rounded-full ring-1 ring-black/15 hover:bg-black/5"
                          aria-label="Decrease"
                        >
                          –
                        </button>
                        <span className="w-6 text-center leading-8 text-sm">{line.quantity}</span>
                        <button
                          onClick={() => cart.updateLine(line.lineId, { quantity: line.quantity + 1 })}
                          className="w-8 h-8 rounded-full ring-1 ring-black/15 hover:bg-black/5"
                          aria-label="Increase"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                      {cover ? (
                        <span
                          className="block w-6 h-6 rounded ring-1 ring-black/10 shrink-0"
                          style={
                            cover.imageUrl
                              ? { background: `url(${cover.imageUrl}) center/cover` }
                              : { background: cover.swatchHex ?? "#ddd" }
                          }
                          aria-hidden
                        />
                      ) : null}
                      <div className="text-xs text-black/65 leading-tight">
                        <div>{coveringLabel}</div>
                        <div className="text-black/40">{tier}</div>
                      </div>
                    </div>

                    {Object.entries(line.selections).length > 0 ? (
                      <ul className="mt-2 text-[11px] text-black/55 grid gap-0.5">
                        {Object.entries(line.selections).map(([gid, cid]) => {
                          const g = frame.options?.find((o) => o.id === gid);
                          const c = g?.choices.find((x) => x.id === cid);
                          if (!g || !c) return null;
                          return (
                            <li key={gid}>
                              <span className="text-black/40">{g.label}:</span> {c.label}
                            </li>
                          );
                        })}
                      </ul>
                    ) : null}

                    {line.notes ? (
                      <p className="mt-2 text-xs text-black/55 italic">"{line.notes}"</p>
                    ) : null}

                    <div className="mt-2 flex items-baseline justify-between">
                      <button
                        onClick={() => cart.removeLine(line.lineId)}
                        className="text-[11px] text-black/45 hover:text-accent"
                      >
                        Remove
                      </button>
                      <div className="text-sm">
                        <span className="text-accent font-medium">{formatUSD(line.retailUnit * line.quantity)}</span>
                        {line.quantity > 1 ? (
                          <span className="text-black/40 text-xs ml-1.5">
                            ({formatUSD(line.retailUnit)} × {line.quantity})
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <footer className="sticky bottom-0 bg-white border-t border-black/[0.08] px-6 py-4 grid gap-3">
          {cart.lines.length > 0 ? (
            <div className="grid gap-1 text-sm">
              <div className="flex justify-between">
                <span className="text-black/55">Retail total</span>
                <span className="font-semibold text-accent">{formatUSD(totals.retail)}</span>
              </div>
              <div className="flex justify-between text-xs text-black/40">
                <span>Wholesale (internal)</span>
                <span>{formatUSD(totals.wholesale)}</span>
              </div>
            </div>
          ) : null}
          {submitted ? (
            <div className={`text-sm ${submitted.ok ? "text-green-700" : "text-accent"}`}>{submitted.message}</div>
          ) : null}
          <div className="flex gap-2">
            <button
              onClick={downloadJson}
              disabled={cart.lines.length === 0}
              className="flex-1 py-3 rounded-full ring-1 ring-black/15 text-sm disabled:opacity-50 hover:bg-black/[0.03]"
            >
              Download JSON
            </button>
            <button
              onClick={submit}
              disabled={submitting || cart.lines.length === 0 || !cart.client}
              className="flex-1 py-3 rounded-full bg-accent hover:bg-accent-600 text-white text-sm disabled:opacity-50"
            >
              {submitting ? "Sending…" : "Send Quote"}
            </button>
          </div>
          {cart.lines.length > 0 && !cart.client ? (
            <p className="text-xs text-accent">Add a client name above to send.</p>
          ) : null}
          {cart.lines.length > 0 ? (
            <button
              onClick={() => {
                if (confirm("Clear this quote?")) cart.clearCart();
              }}
              className="text-xs text-black/45 hover:text-black"
            >
              Clear quote
            </button>
          ) : null}
        </footer>
      </aside>
    </div>
  );
}

function Field({
  label, value, onChange, placeholder,
}: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="grid gap-1">
      <span className="text-[10px] uppercase tracking-widest text-black/40">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="px-3 py-2 rounded-lg bg-bone ring-1 ring-black/[0.06] focus:ring-accent/50 outline-none text-sm"
      />
    </label>
  );
}
