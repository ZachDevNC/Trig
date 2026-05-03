"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { CartLine, CoveringSelection, Quote } from "./types";

type CartState = {
  client: string;
  room: string;
  designer: string;
  lines: CartLine[];
};

type AddLineArgs = {
  frameId: string;
  covering: CoveringSelection;
  selections: Record<string, string>;
  notes?: string;
  wholesaleUnit: number;
  retailUnit: number;
};

type CartCtx = CartState & {
  setClient: (v: string) => void;
  setRoom: (v: string) => void;
  setDesigner: (v: string) => void;
  addLine: (args: AddLineArgs) => void;
  updateLine: (lineId: string, patch: Partial<Omit<CartLine, "lineId" | "addedAt">>) => void;
  removeLine: (lineId: string) => void;
  clearCart: () => void;
  toQuote: () => Quote;
};

const Ctx = createContext<CartCtx | null>(null);
const STORAGE_KEY = "trig-showroom-cart-v2";

const empty: CartState = { client: "", room: "", designer: "", lines: [] };

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CartState>(empty);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const setClient = useCallback((client: string) => setState((s) => ({ ...s, client })), []);
  const setRoom = useCallback((room: string) => setState((s) => ({ ...s, room })), []);
  const setDesigner = useCallback((designer: string) => setState((s) => ({ ...s, designer })), []);

  const addLine = useCallback((args: AddLineArgs) => {
    setState((s) => ({
      ...s,
      lines: [
        ...s.lines,
        {
          lineId: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
          frameId: args.frameId,
          covering: args.covering,
          selections: args.selections,
          notes: args.notes,
          wholesaleUnit: args.wholesaleUnit,
          retailUnit: args.retailUnit,
          quantity: 1,
          addedAt: Date.now(),
        },
      ],
    }));
  }, []);

  const updateLine = useCallback((lineId: string, patch: Partial<Omit<CartLine, "lineId" | "addedAt">>) => {
    setState((s) => ({
      ...s,
      lines: s.lines.map((l) => (l.lineId === lineId ? { ...l, ...patch } : l)),
    }));
  }, []);

  const removeLine = useCallback((lineId: string) => {
    setState((s) => ({ ...s, lines: s.lines.filter((l) => l.lineId !== lineId) }));
  }, []);

  const clearCart = useCallback(() => setState(empty), []);

  const toQuote = useCallback(
    (): Quote => ({
      client: state.client,
      room: state.room || undefined,
      designer: state.designer || undefined,
      lines: state.lines,
      totals: {
        wholesale: state.lines.reduce((s, l) => s + l.wholesaleUnit * l.quantity, 0),
        retail:    state.lines.reduce((s, l) => s + l.retailUnit    * l.quantity, 0),
      },
      createdAt: Date.now(),
    }),
    [state],
  );

  const value = useMemo<CartCtx>(
    () => ({ ...state, setClient, setRoom, setDesigner, addLine, updateLine, removeLine, clearCart, toQuote }),
    [state, setClient, setRoom, setDesigner, addLine, updateLine, removeLine, clearCart, toQuote],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
}
