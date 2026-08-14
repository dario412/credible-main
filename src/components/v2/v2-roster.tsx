"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus } from "@phosphor-icons/react";

import { V2ViewMoreLink } from "@/components/v2/v2-icons";
import { toggleShortlist, useIsShortlisted } from "@/lib/shortlist";
import type { RosterCardExpert } from "@/components/roster-card";
import type { HomePageSections } from "@/lib/cms";
import { cn } from "@/lib/utils";

function firstName(name: string) {
  return name.split(/\s+/)[0] ?? name;
}

function V2RosterCard({ expert }: { expert: RosterCardExpert }) {
  const shortlisted = useIsShortlisted(expert.slug);
  const imageSrc = expert.image ?? "/images/creator-placeholder.png";
  const tags = expert.topics.slice(0, 2);

  return (
    <article className="flex h-full flex-col gap-[18px]">
      <Link
        href={`/roster/${expert.slug}`}
        className="relative block h-[340px] overflow-hidden rounded-[16px] bg-[#D6DED8]"
      >
        <Image
          src={imageSrc}
          alt={expert.name}
          fill
          sizes="(min-width: 1024px) 33vw, 100vw"
          className="object-cover object-top"
        />
        {expert.linkedinTopVoice ? (
          <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-[var(--v2-snow)] py-1.5 pr-[11px] pl-1.5">
            <span className="flex size-[18px] items-center justify-center rounded-[4px] bg-[#0A66C2]">
              <svg viewBox="0 0 24 24" className="size-[11px]" aria-hidden>
                <path
                  d="M4.98 3.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.76V21h-4v-5.6c0-1.34-.03-3.06-1.9-3.06-1.9 0-2.2 1.45-2.2 2.96V21h-4z"
                  fill="#FFFFFF"
                />
              </svg>
            </span>
            <span className="text-[12px] leading-4 font-semibold text-[var(--v2-timberline)]">
              Top Voice
            </span>
          </span>
        ) : expert.role ? (
          <span className="absolute right-3 bottom-3 rounded-full bg-[var(--v2-evergreen)] px-[13px] py-1.5 text-[11px] leading-[14px] font-semibold tracking-[0.06em] text-[var(--v2-snow)] uppercase">
            {expert.role}
          </span>
        ) : null}
      </Link>

      <div className="flex items-end justify-between gap-3">
        <Link
          href={`/roster/${expert.slug}`}
          className="v2-display text-[20px] leading-[26px] tracking-[-0.01em] text-[var(--v2-timberline)]"
        >
          {expert.name}
        </Link>
        {expert.combinedReach ? (
          <div className="shrink-0 text-right">
            <p className="text-[11px] leading-[15px] text-[var(--v2-lichen)]">
              Combined reach
            </p>
            <p className="v2-display text-[20px] leading-[26px] tracking-[-0.02em] text-[var(--v2-timberline)]">
              {expert.combinedReach}
            </p>
          </div>
        ) : null}
      </div>

      <p className="min-h-12 line-clamp-2 text-[14px] leading-[23px] text-[var(--v2-lichen)]">
        {expert.shortBio}
      </p>

      {tags.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-[4px] bg-[#DCE4DE] px-[9px] py-[5px] text-[10px] leading-3 font-medium tracking-[0.06em] text-[var(--v2-evergreen)] uppercase"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-auto flex items-center gap-2 pt-1">
        <Link
          href={`/contact?experts=${encodeURIComponent(expert.slug)}`}
          className="inline-flex flex-1 items-center justify-center rounded-full bg-[var(--v2-evergreen)] py-3 text-[14px] leading-[18px] font-medium text-[var(--v2-snow)] transition-transform active:scale-[0.98]"
        >
          Book {firstName(expert.name)}
        </Link>
        <button
          type="button"
          onClick={() =>
            toggleShortlist({
              slug: expert.slug,
              name: expert.name,
              image: expert.image,
              role: expert.role,
            })
          }
          aria-pressed={shortlisted}
          className={cn(
            "group/shortlist inline-flex shrink-0 cursor-pointer items-center justify-center gap-1 rounded-full border px-[18px] py-3 text-[14px] leading-[18px] font-medium transition-colors duration-300",
            shortlisted
              ? "border-[var(--v2-timberline)] bg-[var(--v2-timberline)] text-[var(--v2-snow)] hover:border-[var(--v2-timberline)]/80 hover:bg-[var(--v2-timberline)]/85"
              : "border-[#C1CCC5] bg-transparent text-[var(--v2-timberline)] hover:border-[var(--v2-timberline)] hover:bg-[var(--v2-timberline)] hover:text-[var(--v2-snow)]",
          )}
        >
          <span className="relative inline-grid grid-cols-1 grid-rows-1 items-center justify-items-center">
            <span
              className={cn(
                "col-start-1 row-start-1 inline-flex items-center gap-1",
                shortlisted && "invisible",
              )}
            >
              <Plus
                weight="bold"
                aria-hidden
                className="size-3.5 shrink-0 transition-transform duration-700 ease-out group-hover/shortlist:rotate-180"
              />
              Shortlist
            </span>
            <span
              className={cn(
                "col-start-1 row-start-1 inline-flex items-center gap-1",
                !shortlisted && "invisible",
              )}
            >
              <Minus weight="bold" className="size-3.5 shrink-0" aria-hidden />
              Shortlisted
            </span>
          </span>
        </button>
      </div>
    </article>
  );
}

export function V2Roster({
  content,
  cards,
}: {
  content: HomePageSections["roster"];
  cards: RosterCardExpert[];
}) {
  if (cards.length === 0) return null;

  return (
    <section className="bg-[var(--v2-glacier)] py-28">
      <div className="v2-container flex flex-col gap-[72px]">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <h2 className="v2-display max-w-[780px] text-[clamp(2.4rem,5vw,4rem)] leading-[1.03] text-[var(--v2-timberline)]">
          {content.headline}
        </h2>
        <V2ViewMoreLink href={content.ctaHref || "/roster"} className="pb-2">
          {content.ctaLabel || "See all creators"}
        </V2ViewMoreLink>
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {cards.map((expert) => (
          <V2RosterCard key={expert.id} expert={expert} />
        ))}
      </div>
      </div>
    </section>
  );
}
