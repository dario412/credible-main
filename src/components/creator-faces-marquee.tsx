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
  { rotate: -5, y: 3 },
  { rotate: 7, y: -2 },
  { rotate: -6, y: 4 },
  { rotate: 5, y: 0 },
] as const;

const CREATOR_FACES = HOME_2_SPEAKERS.map((speaker, index) => ({
  name: speaker.name,
  slug: speaker.slug,
  src:
    EXPERT_IMAGES[speaker.slug] ??
    EXPERT_IMAGE_FALLBACKS[index % EXPERT_IMAGE_FALLBACKS.length],
  tilt: FACE_TILTS[index % FACE_TILTS.length],
}));

export function CreatorFacesMarquee() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<{ name: string; x: number } | null>(null);
  const [open, setOpen] = useState(false);
  const loop = [...CREATOR_FACES, ...CREATOR_FACES];

  function showLabel(name: string, event: React.MouseEvent<HTMLLIElement>) {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const tile = event.currentTarget.getBoundingClientRect();
    const box = wrap.getBoundingClientRect();
    setLabel({ name, x: tile.left + tile.width / 2 - box.left });
    setOpen(true);
  }

  return (
    <div
      ref={wrapRef}
      className="relative shrink-0"
      onMouseLeave={() => setOpen(false)}
    >
      <div
        aria-hidden
        style={{ left: label?.x ?? 0 }}
        className={cn(
          "pointer-events-none absolute bottom-[calc(100%-0.4rem)] z-20 -translate-x-1/2 transition-opacity duration-200",
          open ? "opacity-100" : "opacity-0",
        )}
      >
        <span className="relative block rounded-sm bg-charcoal px-2.5 py-1 text-[0.7rem] font-medium whitespace-nowrap text-cream shadow-[0_8px_20px_rgba(28,26,23,0.3)]">
          {label?.name ?? ""}
          <span className="absolute top-full left-1/2 size-2 -translate-x-1/2 -translate-y-1 rotate-45 bg-charcoal" />
        </span>
      </div>

      <div
        className="creator-marquee-window w-33 overflow-hidden py-2 mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] md:w-37"
        aria-label="Creators we represent"
      >
        <ul className="animate-creator-marquee flex w-max items-center pl-1">
          {loop.map((face, index) => (
            <li
              key={`${face.slug}-${index}`}
              className="relative -ml-1 origin-bottom"
              style={{
                transform: `rotate(${face.tilt.rotate}deg) translateY(${face.tilt.y}px)`,
              }}
              onMouseEnter={(event) => showLabel(face.name, event)}
            >
              <span className="relative block h-12 w-9 overflow-hidden rounded-sm border-2 border-rust bg-rust-dark transition-transform duration-300 hover:scale-105 md:h-14 md:w-10">
                <Image
                  src={face.src}
                  alt=""
                  fill
                  sizes="36px"
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
