"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";
import { getProduct } from "@/lib/catalog";

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
      if (json.ok) {
        setSubmitted({ ok: true, message: "Quote submitted." });
      } else {
        setSubmitted({ ok: false, message: json.error ?? "Submit failed." });
      }
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

  return (
    <div className="fixed inset-0 z-40 flex">
      <div className="flex-1 bg-black/30" onClick={onClose} />
      <aside className="w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl">
        <header className="px-5 py-4 border-b border-black/10 flex items-center">
          <h2 className="text-base font-medium">Quote</h2>
          <button onClick={onClose} className="ml-auto text-sm text-black/60 hover:text-black">
            Close
          </button>
        </header>

        <section className="px-5 py-4 grid gap-3">
          <Field label="Client" value={cart.client} onChange={cart.setClient} placeholder="e.g. Wilson Residence" />
          <Field label="Room" value={cart.room} onChange={cart.setRoom} placeholder="e.g. Living Room" />
          <Field label="Designer" value={cart.designer} onChange={cart.setDesigner} placeholder="Your name" />
        </section>

        <section className="px-5 py-2">
          {cart.lines.length === 0 ? (
            <p className="text-sm text-black/60 py-8 text-center">No items yet — scan a product tag to begin.</p>
          ) : (
            <ul className="divide-y divide-black/10">
              {cart.lines.map((line) => {
                const product = getProduct(line.productId);
                if (!product) return null;
                return (
                  <li key={line.lineId} className="py-4">
                    <div className="flex justify-between gap-3">
                      <div>
                        <div className="text-sm text-black/60">{product.brand}</div>
                        <div className="font-medium">{product.name}</div>
                      </div>
                      <div className="flex items-start gap-2">
                        <button
                          onClick={() => cart.updateLine(line.lineId, { quantity: Math.max(1, line.quantity - 1) })}
                          className="w-8 h-8 rounded-full ring-1 ring-black/15"
                        >
                          –
                        </button>
                        <span className="w-6 text-center leading-8">{line.quantity}</span>
                        <button
                          onClick={() => cart.updateLine(line.lineId, { quantity: line.quantity + 1 })}
                          className="w-8 h-8 rounded-full ring-1 ring-black/15"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <ul className="mt-2 text-xs text-black/70 grid gap-0.5">
                      {Object.entries(line.selections).map(([gid, cid]) => {
                        const g = product.options.find((o) => o.id === gid);
                        const c = g?.choices.find((x) => x.id === cid);
                        if (!g || !c) return null;
                        return (
                          <li key={gid}>
                            <span className="text-black/50">{g.label}:</span> {c.label}
                          </li>
                        );
                      })}
                    </ul>
                    {line.notes ? <p className="mt-2 text-xs text-black/60 italic">“{line.notes}”</p> : null}
                    <button
                      onClick={() => cart.removeLine(line.lineId)}
                      className="mt-2 text-xs text-red-700 hover:underline"
                    >
                      Remove
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <footer className="sticky bottom-0 bg-white border-t border-black/10 px-5 py-4 grid gap-2">
          {submitted ? (
            <div className={`text-sm ${submitted.ok ? "text-green-700" : "text-red-700"}`}>{submitted.message}</div>
          ) : null}
          <div className="flex gap-2">
            <button
              onClick={downloadJson}
              disabled={cart.lines.length === 0}
              className="flex-1 py-3 rounded-lg ring-1 ring-black/15 text-sm disabled:opacity-50"
            >
              Download JSON
            </button>
            <button
              onClick={submit}
              disabled={submitting || cart.lines.length === 0 || !cart.client}
              className="flex-1 py-3 rounded-lg bg-ink text-white text-sm disabled:opacity-50"
            >
              {submitting ? "Sending…" : "Send Quote"}
            </button>
          </div>
          {cart.lines.length > 0 && !cart.client ? (
            <p className="text-xs text-amber-700">Add a client name above to send.</p>
          ) : null}
          {cart.lines.length > 0 ? (
            <button
              onClick={() => {
                if (confirm("Clear this quote?")) cart.clearCart();
              }}
              className="text-xs text-black/50 hover:text-black mt-1"
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
      <span className="text-[11px] uppercase tracking-widest text-black/50">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="px-3 py-2 rounded-md bg-bone/60 ring-1 ring-black/10 focus:ring-black/40 outline-none text-sm"
      />
    </label>
  );
}
