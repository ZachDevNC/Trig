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
    <section className="border-t border-black/[0.08] py-6">
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="text-[11px] uppercase tracking-widest text-black/40">{group.label}</h3>
        {group.required && !value ? (
          <span className="text-[11px] text-accent">Required</span>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        {group.choices.map((c) => {
          const selected = c.id === value;
          return (
            <button
              key={c.id}
              onClick={() => onChange(c.id)}
              className={`px-4 py-2.5 rounded-full text-sm transition ${
                selected
                  ? "bg-ink text-white"
                  : "bg-white ring-1 ring-black/10 text-black/80 hover:ring-black/30"
              }`}
            >
              {c.label}
              {c.upcharge ? (
                <span className="opacity-70 ml-1.5 text-xs">+${c.upcharge}</span>
              ) : null}
            </button>
          );
        })}
      </div>
      {group.choices.find((c) => c.id === value)?.note ? (
        <p className="mt-2 text-xs text-black/55">
          {group.choices.find((c) => c.id === value)?.note}
        </p>
      ) : null}
    </section>
  );
}
