import Link from "next/link";
import { frames } from "@/lib/catalog";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-6 pt-12 pb-24">
      <header className="mb-12">
        <p className="text-[11px] uppercase tracking-[0.3em] text-accent">Trig Modern · Showroom</p>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tightish mt-3">
          Configure a piece.
        </h1>
        <p className="text-base md:text-lg text-black/60 mt-3 max-w-xl">
          Tap a frame, choose a covering, build a quote. Or scan an NFC tag on the floor to land here directly.
        </p>
      </header>

      <h2 className="text-[11px] uppercase tracking-widest text-black/40 mb-4">Frames</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {frames.map((f) => (
          <li key={f.id}>
            <Link
              href={`/p/${f.id}`}
              className="group block rounded-2xl bg-white shadow-card overflow-hidden transition hover:shadow-md"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={f.heroImage}
                alt={f.name}
                className="w-full aspect-[4/3] object-cover transition group-hover:scale-[1.01]"
              />
              <div className="p-5">
                <div className="text-[11px] uppercase tracking-widest text-black/40">
                  {f.brand} · {f.collection}
                </div>
                <div className="mt-1 font-medium text-base">{f.name}</div>
                <div className="mt-1 text-xs font-mono text-black/40">{f.sku}</div>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <p className="text-xs text-black/35 mt-12">
        NFC tags should encode the URL <code className="font-mono">/p/&lt;frame-id&gt;</code> — e.g. <code className="font-mono">/p/parker-chair</code>.
      </p>
    </div>
  );
}
