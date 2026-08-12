"use client";

import Image from "next/image";
import { useRef, useState } from "react";

import { HOME_2_SPEAKERS } from "@/components/home-2/home-2-speakers";
import { cn } from "@/lib/utils";

const EXPERT_IMAGES: Record<string, string> = {
  "alex-lieberman": "/images/experts/alex-lieberman.png",
  "amara-chen": "/images/experts/amara-chen.jpg",
  "daniel-park": "/images/experts/daniel-park.jpg",
  "james-okafor": "/images/experts/james-okafor.jpg",
  "lena-weiss": "/images/experts/lena-weiss.jpg",
  "noah-bennett": "/images/experts/noah-bennett.jpg",
  "sofia-martinez": "/images/experts/sofia-martinez.jpg",
};

const EXPERT_IMAGE_FALLBACKS = Object.values(EXPERT_IMAGES);

const FACE_TILTS = [
  { rotate: -4, y: 2 },
  { rotate: 5, y: -1 },
  { rotate: -5, y: 3 },
  { rotate: 4, y: 0 },
] as const;

const CREATOR_FACES = HOME_2_SPEAKERS.map((speaker, index) => ({
  name: speaker.name,
  slug: speaker.slug,
  src:
    EXPERT_IMAGES[speaker.slug] ??
    EXPERT_IMAGE_FALLBACKS[index % EXPERT_IMAGE_FALLBACKS.length],
  tilt: FACE_TILTS[index % FACE_TILTS.length],
}));

export function CreatorFacesMarquee({
  variant = "compact",
  tone = "rust",
  limit,
}: {
  variant?: "compact" | "wide";
  tone?: "rust" | "cream";
  /** Cap faces in the loop — keeps the strip readable on hero rows. */
  limit?: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<{ name: string; x: number } | null>(null);
  const [open, setOpen] = useState(false);
  const isWide = variant === "wide";
  const faces = limit ? CREATOR_FACES.slice(0, limit) : CREATOR_FACES;
  const loop = [...faces, ...faces];

  function showLabel(name: string, event: React.MouseEvent<HTMLLIElement>) {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const tile = event.currentTarget.getBoundingClientRect();
    const box = wrap.getBoundingClientRect();
    setLabel({ name, x: tile.left + tile.width / 2 - box.left });
    setOpen(true);
  }

  const tileClass =
    tone === "cream"
      ? "border-cream/35 bg-forest-dark/80 shadow-[0_14px_36px_rgba(28,26,23,0.28)]"
      : "border-rust bg-rust-dark shadow-[0_10px_28px_rgba(28,26,23,0.2)]";

  const tileSizeClass = isWide
    ? "h-[6.75rem] w-[4.85rem] sm:h-[7.5rem] sm:w-[5.35rem] md:h-[8.25rem] md:w-[5.85rem] lg:h-[9.25rem] lg:w-[6.5rem]"
    : "h-12 w-9 md:h-14 md:w-10";

  const imageSizes = isWide
    ? "(max-width: 640px) 78px, (max-width: 1024px) 94px, 104px"
    : "36px";

  return (
    <div
      ref={wrapRef}
      className={cn("relative", isWide ? "w-full" : "shrink-0")}
      onMouseLeave={() => setOpen(false)}
    >
      <div
        aria-hidden
        style={{ left: label?.x ?? 0 }}
        className={cn(
          "pointer-events-none absolute bottom-[calc(100%-0.25rem)] z-20 -translate-x-1/2 transition-opacity duration-200",
          open ? "opacity-100" : "opacity-0",
        )}
      >
        <span className="relative block rounded-sm bg-charcoal px-2.5 py-1 text-[0.7rem] font-medium whitespace-nowrap text-cream shadow-[0_8px_20px_rgba(28,26,23,0.3)]">
          {label?.name ?? ""}
          <span className="absolute top-full left-1/2 size-2 -translate-x-1/2 -translate-y-1 rotate-45 bg-charcoal" />
        </span>
      </div>

      <div
        className={cn(
          "creator-marquee-window overflow-hidden",
          isWide
            ? "w-full py-4 mask-[linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] md:py-5 lg:py-6"
            : "w-33 py-2 mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] md:w-37",
        )}
        aria-label="Creators we represent"
      >
        <ul
          className={cn(
            "flex w-max items-end",
            isWide ? "animate-creator-marquee-wide" : "animate-creator-marquee",
          )}
        >
          {loop.map((face, index) => (
            <li
              key={`${face.slug}-${index}`}
              className={cn(
                "relative shrink-0 origin-bottom",
                isWide ? "pr-5 md:pr-6 lg:pr-7" : "pr-2.5 md:pr-3",
              )}
              style={{
                transform: `rotate(${face.tilt.rotate}deg) translateY(${face.tilt.y}px)`,
              }}
              onMouseEnter={(event) => showLabel(face.name, event)}
            >
              <span
                className={cn(
                  "relative block overflow-hidden rounded-sm border-2 transition-transform duration-300 ease-out hover:scale-[1.04] hover:-translate-y-0.5",
                  tileClass,
                  tileSizeClass,
                )}
              >
                <Image
                  src={face.src}
                  alt=""
                  fill
                  sizes={imageSizes}
                  className="object-cover object-top"
                />
              </span>
              <span className="sr-only">{face.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
