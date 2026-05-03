"use client";

import { useEffect, useState } from "react";

export function ProductGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [active, setActive] = useState(0);

  // Reset to first image if the image set changes (e.g. swapping frames in nav).
  useEffect(() => {
    setActive(0);
  }, [images]);

  // Keyboard nav when the gallery is focused.
  useEffect(() => {
    if (images.length < 2) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setActive((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft")  setActive((i) => (i - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [images.length]);

  const main = images[active] ?? images[0];
  const multi = images.length > 1;

  return (
    <div>
      <div className="relative group">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={main}
          alt={alt}
          className="w-full aspect-[4/3] object-cover rounded-2xl shadow-card bg-white transition-opacity"
          key={main}
        />

        {multi ? (
          <>
            <Arrow
              direction="prev"
              onClick={() => setActive((i) => (i - 1 + images.length) % images.length)}
            />
            <Arrow
              direction="next"
              onClick={() => setActive((i) => (i + 1) % images.length)}
            />
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={`block h-1.5 rounded-full transition-all ${
                    i === active ? "w-5 bg-ink/80" : "w-1.5 bg-ink/25"
                  }`}
                  aria-hidden
                />
              ))}
            </div>
          </>
        ) : null}
      </div>

      {multi ? (
        <ul className="mt-3 flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
          {images.map((src, i) => {
            const selected = i === active;
            return (
              <li key={src} className="shrink-0">
                <button
                  onClick={() => setActive(i)}
                  aria-label={`View ${i + 1} of ${images.length}`}
                  className={`block w-14 h-14 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-white transition ${
                    selected ? "ring-2 ring-accent" : "ring-1 ring-black/10 hover:ring-black/30"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

function Arrow({
  direction,
  onClick,
}: {
  direction: "prev" | "next";
  onClick: () => void;
}) {
  const isPrev = direction === "prev";
  return (
    <button
      onClick={onClick}
      aria-label={isPrev ? "Previous image" : "Next image"}
      className={`absolute top-1/2 -translate-y-1/2 ${
        isPrev ? "left-3" : "right-3"
      } w-9 h-9 rounded-full bg-white/85 backdrop-blur-sm ring-1 ring-black/10 text-ink/70 hover:text-ink hover:bg-white shadow-sm flex items-center justify-center transition opacity-0 group-hover:opacity-100 focus:opacity-100`}
    >
      <span aria-hidden className="text-base leading-none">
        {isPrev ? "‹" : "›"}
      </span>
    </button>
  );
}
