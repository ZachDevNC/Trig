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
      <div className="fixed bottom-0 inset-x-0 z-30 bg-white/85 backdrop-blur-md border-t border-black/[0.06]">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-3">
          <Link href="/" className="text-[13px] font-medium tracking-tightish text-black/80 hover:text-black">
            Trig <span className="text-accent">Showroom</span>
          </Link>
          <div className="flex-1 text-sm text-black/55 truncate">
            {client ? <>Quote for <span className="font-medium text-black">{client}</span></> : "No client set"}
          </div>
          <button
            onClick={() => setOpen(true)}
            className={`px-4 py-2 rounded-full text-sm transition ${
              count > 0
                ? "bg-accent hover:bg-accent-600 text-white"
                : "bg-ink text-white"
            }`}
          >
            Quote · {count}
          </button>
        </div>
      </div>
      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
