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

function formatLabel(value: string) {
  if (value.toLowerCase() === "ai") return "AI";
  return value;
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
        <div className="relative aspect-4/3 overflow-hidden rounded-sm bg-[#E4EBE6]">
          <Image
            src={imageSrc}
            alt={expert.name}
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
        </div>

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
