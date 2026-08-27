"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus } from "@phosphor-icons/react";

import { toggleShortlist, useIsShortlisted } from "@/lib/shortlist";
import { cn } from "@/lib/utils";
import type { ExpertChannel } from "@/lib/expert-channels";

export type { ExpertChannel };

export type RosterCardExpert = {
  id: string;
  slug: string;
  name: string;
  shortBio: string | null;
  image: string | null;
  role: string | null;
  topics: string[];
  combinedReach: string | null;
  growth90d: string | null;
  audienceWho: string | null;
  audienceWhere: string | null;
  channels: ExpertChannel[];
  linkedinTopVoice?: boolean;
};

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

/** Brand washes: color varies per card; geometry stays identical. */
const BACKDROP_PALETTE = [
  { base: "#E8EFEA", stroke: "#345B47" }, // forest
  { base: "#E4EBE6", stroke: "#2A4939" }, // forest-dark
  { base: "#F3E8E1", stroke: "#935B3B" }, // rust
  { base: "#EFE3DA", stroke: "#7A4A30" }, // rust-dark
  { base: "#F0EBE6", stroke: "#8A827A" }, // taupe
  { base: "#ECEAE8", stroke: "#6B6560" }, // muted
  { base: "#E7EEEA", stroke: "#5F7368" }, // sage
] as const;

/** Fixed line layout — same spacing / kinks on every card. */
const BACKDROP_LINES = [
  "M18 0V360",
  "M34 0V360",
  "M50 0V92L58 114V360",
  "M66 0V360",
  "M82 0V360",
  "M98 0V360",
  "M114 0V168L106 190V360",
  "M130 0V360",
  "M146 0V360",
  "M162 0V360",
  "M178 0V74L186 96V360",
  "M194 0V360",
  "M210 0V360",
  "M226 0V360",
  "M242 0V210L234 232V360",
  "M258 0V360",
  "M274 0V360",
  "M290 0V360",
  "M306 0V128L314 150V360",
  "M322 0V360",
  "M338 0V360",
  "M354 0V360",
  "M370 0V246L362 268V360",
  "M386 0V360",
  "M402 0V360",
  "M418 0V360",
  "M434 0V56L442 78V360",
  "M450 0V360",
  "M466 0V360",
] as const;

function hashSeed(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function formatLabel(value: string) {
  if (value.toLowerCase() === "ai") return "AI";
  return value;
}

function RosterPhotoBackdrop({ seed }: { seed: string }) {
  const hash = hashSeed(seed);
  const { base, stroke } = BACKDROP_PALETTE[hash % BACKDROP_PALETTE.length];
  const uid = `rbp-${seed.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 24)}-${hash.toString(36)}`;

  return (
    <svg
      aria-hidden
      viewBox="0 0 480 360"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 size-full"
    >
      <rect width="480" height="360" fill={base} />
      <defs>
        <linearGradient id={`${uid}-fade`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={stroke} stopOpacity="0" />
          <stop offset="22%" stopColor={stroke} stopOpacity="0.22" />
          <stop offset="58%" stopColor={stroke} stopOpacity="0.5" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0.72" />
        </linearGradient>
        <filter
          id={`${uid}-blur`}
          x="-2%"
          y="-2%"
          width="104%"
          height="104%"
        >
          <feGaussianBlur stdDeviation="0.45" />
        </filter>
        <mask id={`${uid}-mask`}>
          <rect width="480" height="360" fill={`url(#${uid}-fade)`} />
        </mask>
      </defs>
      <g
        stroke={stroke}
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        filter={`url(#${uid}-blur)`}
        mask={`url(#${uid}-mask)`}
      >
        {BACKDROP_LINES.map((d, index) => (
          <path key={index} d={d} />
        ))}
      </g>
    </svg>
  );
}

export function RosterCard({ expert }: { expert: RosterCardExpert }) {
  const shortlisted = useIsShortlisted(expert.slug);
  const imageSrc = expert.image ?? "/images/creator-placeholder.png";

  function onShortlistClick(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    toggleShortlist({
      slug: expert.slug,
      name: expert.name,
      image: expert.image,
      role: expert.role,
    });
  }

  return (
    <div className="group h-full">
      <article
        className={cn(
          "flex h-full flex-col rounded-sm border border-charcoal/8 bg-[#FBF8F5] p-3",
          "shadow-[0_10px_28px_rgba(28,26,23,0.05)]",
          "transition-[box-shadow,border-color] duration-500",
          "hover:border-forest/25 hover:shadow-[0_16px_36px_rgba(42,73,57,0.12)]",
        )}
        style={{ transitionTimingFunction: EASE }}
      >
        <Link
          href={`/roster/${expert.slug}`}
          className="relative block aspect-4/3 overflow-hidden rounded-sm bg-[#FBF8F5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
          aria-label={`View ${expert.name}'s profile`}
        >
          <RosterPhotoBackdrop seed={expert.slug} />
          <Image
            src={imageSrc}
            alt=""
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
            style={{ transitionTimingFunction: EASE }}
          />
          {expert.linkedinTopVoice ? (
            <span
              className="absolute top-2.5 right-2.5 inline-flex items-center gap-1.5 rounded-sm border border-charcoal/12 bg-cream py-1 pr-2.5 pl-1 shadow-[0_6px_18px_rgba(28,26,23,0.22)]"
              title="LinkedIn Top Voice"
            >
              <Image
                src="/brand/linkedin-in-bug.png"
                alt=""
                width={20}
                height={20}
                className="size-5 shrink-0"
                aria-hidden
              />
              <span className="text-[11px] leading-none font-semibold tracking-[-0.01em] text-charcoal">
                Top Voice
              </span>
            </span>
          ) : null}
          {expert.role ? (
            <span className="absolute right-2.5 bottom-2.5 rounded-sm border border-cream/20 bg-forest/70 px-2.5 py-1 text-[10px] font-medium tracking-[0.14em] text-cream uppercase shadow-[0_6px_20px_rgba(42,73,57,0.3)] backdrop-blur-md">
              {formatLabel(expert.role)}
            </span>
          ) : null}
        </Link>

        <CardBody expert={expert} />

        <div className="mt-auto flex gap-2 pt-4">
          <Link
            href={`/roster/${expert.slug}`}
            className="inline-flex min-w-0 flex-[1.65] items-center justify-center rounded-sm border border-forest bg-forest px-3 py-2.5 text-[0.8125rem] font-medium text-cream transition-colors duration-300 hover:border-forest-dark hover:bg-forest-dark"
          >
            View profile
          </Link>
          <button
            type="button"
            onClick={onShortlistClick}
            aria-pressed={shortlisted}
            className={cn(
              "group/shortlist inline-flex shrink-0 cursor-pointer items-center justify-center gap-1 rounded-sm border px-2.5 py-2.5 text-[0.75rem] font-medium transition-colors duration-300",
              shortlisted
                ? "border-charcoal bg-charcoal text-cream hover:border-charcoal/80 hover:bg-charcoal/85"
                : "border-charcoal/25 bg-transparent text-charcoal hover:border-charcoal hover:bg-charcoal hover:text-cream",
            )}
          >
            {shortlisted ? (
              <>
                <Minus weight="bold" className="size-3 shrink-0" aria-hidden />
                Shortlisted
              </>
            ) : (
              <>
                <Plus
                  weight="bold"
                  aria-hidden
                  className="size-3 shrink-0 transition-transform duration-700 ease-out group-hover/shortlist:rotate-180"
                />
                Shortlist
              </>
            )}
          </button>
        </div>
      </article>
    </div>
  );
}

function CardBody({ expert }: { expert: RosterCardExpert }) {
  return (
    <div className="flex flex-1 flex-col pt-4 pb-2 md:pt-4.5 md:pb-2.5">
      <div className="flex items-start justify-between gap-3">
        <h2 className="min-w-0 font-display text-[1.2rem] leading-[1.15] tracking-tight text-charcoal transition-colors duration-300 group-hover:text-forest md:text-[1.3rem]">
          {expert.name}
        </h2>
        {expert.combinedReach ? (
          <div className="shrink-0 text-right">
            <p className="text-[10px] leading-none text-charcoal/45">
              Combined reach
            </p>
            <p className="mt-1 font-display text-[1.05rem] leading-none tracking-tight text-charcoal md:text-[1.15rem]">
              {expert.combinedReach}
            </p>
          </div>
        ) : null}
      </div>

      {expert.shortBio ? (
        <p className="mt-2 line-clamp-2 text-[0.78rem] leading-normal text-charcoal/60 md:text-[0.8125rem]">
          {expert.shortBio}
        </p>
      ) : null}

      {expert.topics.length > 0 ? (
        <div className="mt-auto flex flex-wrap gap-1.5 pt-3.5">
          {expert.topics.slice(0, 3).map((topic) => (
            <span
              key={topic}
              className="rounded-sm bg-cream-dark px-2.5 py-1 text-[9px] font-medium tracking-[0.08em] text-charcoal/65 uppercase"
            >
              {formatLabel(topic)}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
