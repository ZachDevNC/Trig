"use client";

import type { OptionGroup } from "@/lib/types";

export function OptionPicker({
  group,
  value,
  onChange,
}: {
  group: OptionGroup;
  value?: string;
  onChange: (choiceId: string) => void;
}) {
  return (
    <section className="border-t border-black/10 py-6">
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="text-sm uppercase tracking-widest text-black/60">{group.label}</h3>
        {group.required && !value ? (
          <span className="text-xs text-amber-700">Required</span>
        ) : null}
      </div>

      {group.kind === "swatch" ? (
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
          {group.choices.map((c) => {
            const selected = c.id === value;
            return (
              <button
                key={c.id}
                onClick={() => onChange(c.id)}
                className={`group flex flex-col items-center gap-1.5 rounded-lg p-1.5 transition ${
                  selected ? "ring-2 ring-ink" : "ring-1 ring-black/10 hover:ring-black/30"
                }`}
              >
                <span
                  className="block w-full aspect-square rounded-md shadow-inner"
                  style={{ background: c.swatch ?? "#ddd" }}
                  aria-hidden
                />
                <span className="text-[11px] leading-tight text-center">{c.label}</span>
                {c.upcharge ? (
                  <span className="text-[10px] text-black/50">+${c.upcharge}</span>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {group.choices.map((c) => {
            const selected = c.id === value;
            return (
              <button
                key={c.id}
                onClick={() => onChange(c.id)}
                className={`px-4 py-3 rounded-lg text-sm transition ${
                  selected
                    ? "bg-ink text-white"
                    : "bg-white ring-1 ring-black/10 hover:ring-black/30"
                }`}
              >
                <span className="block font-medium">{c.label}</span>
                {c.note ? (
                  <span className="block text-[11px] opacity-70 mt-0.5">{c.note}</span>
                ) : null}
                {c.upcharge ? (
                  <span className="block text-[11px] opacity-70 mt-0.5">+${c.upcharge}</span>
                ) : null}
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
