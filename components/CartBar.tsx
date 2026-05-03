"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { CartDrawer } from "./CartDrawer";

export function CartBar() {
  const { lines, client } = useCart();
  const [open, setOpen] = useState(false);
  const count = lines.reduce((n, l) => n + l.quantity, 0);

  return (
    <>
      <div className="fixed bottom-0 inset-x-0 z-30 bg-white/90 backdrop-blur border-t border-black/10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link
            href="/"
            className="text-sm font-medium tracking-wide text-black/70 hover:text-black"
          >
            Trig Showroom
          </Link>
          <div className="flex-1 text-sm text-black/60 truncate">
            {client ? <>Quote for <span className="font-medium text-black">{client}</span></> : "No client set"}
          </div>
          <button
            onClick={() => setOpen(true)}
            className="px-4 py-2 rounded-full bg-ink text-white text-sm"
          >
            Quote · {count}
          </button>
        </div>
      </div>
      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
