import Link from "next/link";
import { products } from "@/lib/catalog";

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-5 py-10">
      <header className="mb-10">
        <p className="text-xs uppercase tracking-[0.25em] text-black/50">Trig Modern</p>
        <h1 className="text-3xl font-semibold mt-1">Showroom Quote Builder</h1>
        <p className="text-sm text-black/60 mt-2 max-w-xl">
          Scan an NFC tag on the showroom floor to open that product, configure options, and add it to a client quote.
        </p>
      </header>

      <h2 className="text-xs uppercase tracking-widest text-black/50 mb-3">Catalog</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {products.map((p) => (
          <li key={p.id}>
            <Link
              href={`/p/${p.id}`}
              className="block rounded-xl ring-1 ring-black/10 overflow-hidden bg-white hover:ring-black/30 transition"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.heroImage} alt={p.name} className="w-full aspect-[4/3] object-cover" />
              <div className="p-4">
                <div className="text-xs text-black/50">{p.brand}</div>
                <div className="font-medium">{p.name}</div>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <p className="text-xs text-black/40 mt-10">
        NFC tags should encode the URL <code>/p/&lt;product-id&gt;</code> — e.g. <code>/p/parker-chair</code>.
      </p>
    </div>
  );
}
