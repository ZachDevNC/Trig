"use client";

import { useMemo, useState } from "react";
import type { Cover, CoverType } from "@/lib/types";
import { gradeToTier, TIERS, tierLabel } from "@/lib/tiers";

type TypeFilter = "all" | CoverType;
type TierFilter = "all" | (typeof TIERS)[number]["id"];

export function SwatchGrid({
  covers,
  selectedId,
  onSelect,
}: {
  covers: Cover[];
  selectedId?: string;
  onSelect: (cover: Cover) => void;
}) {
  const [type, setType] = useState<TypeFilter>("all");
  const [tier, setTier] = useState<TierFilter>("all");

  const filtered = useMemo(() => {
    return covers.filter((c) => {
      if (type !== "all" && c.type !== type) return false;
      if (tier !== "all" && gradeToTier(c.type, c.grade) !== tier) return false;
      return true;
    });
  }, [covers, type, tier]);

  return (
    <div>
      <div className="flex flex-col gap-3">
        <FilterRow
          label="Material"
          options={[
            { id: "all", label: "All" },
            { id: "fabric", label: "Fabric" },
            { id: "leather", label: "Leather" },
            { id: "microfiber", label: "Microfiber" },
          ]}
          value={type}
          onChange={(v) => setType(v as TypeFilter)}
        />
        <FilterRow
          label="Tier"
          options={[
            { id: "all", label: "All" },
            ...TIERS.map((t) => ({ id: t.id, label: tierLabel(t.id) })),
          ]}
          value={tier}
          onChange={(v) => setTier(v as TierFilter)}
        />
      </div>

      <div className="mt-5 text-xs text-black/50">
        {filtered.length} {filtered.length === 1 ? "cover" : "covers"}
      </div>

      <ul className="mt-3 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
        {filtered.map((c) => {
          const selected = c.id === selectedId;
          return (
            <li key={c.id}>
              <button
                onClick={() => onSelect(c)}
                className={`group relative w-full text-left rounded-xl overflow-hidden transition ${
                  selected
                    ? "ring-2 ring-accent"
                    : "ring-1 ring-black/10 hover:ring-black/30"
                }`}
              >
                <span
                  className="block w-full aspect-square"
                  style={
                    c.imageUrl
                      ? { background: `url(${c.imageUrl}) center/cover` }
                      : { background: c.swatchHex ?? "#ddd" }
                  }
                  aria-hidden
                />
                <span className="block px-2 py-2">
                  <span className="block text-[11px] uppercase tracking-wide text-black/40">
                    {c.cover}
                  </span>
                  <span className="block text-[13px] leading-tight">{c.color}</span>
                </span>
                {selected ? (
                  <span className="absolute top-1.5 right-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-accent text-white text-[10px]">
                    ✓
                  </span>
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>

      {filtered.length === 0 ? (
        <p className="mt-6 text-sm text-black/50 text-center py-10">
          No covers match these filters.
        </p>
      ) : null}
    </div>
  );
}

function FilterRow<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="shrink-0 text-[11px] uppercase tracking-widest text-black/40 w-16">
        {label}
      </span>
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
        {options.map((o) => {
          const selected = o.id === value;
          return (
            <button
              key={o.id}
              onClick={() => onChange(o.id)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs transition ${
                selected
                  ? "bg-ink text-white"
                  : "bg-white ring-1 ring-black/10 text-black/70 hover:ring-black/30"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
