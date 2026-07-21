"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, Plus } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

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
};

const SHORTLIST_KEY = "credible-shortlist";
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

function formatLabel(value: string) {
  if (value.toLowerCase() === "ai") return "AI";
  return value;
}

function ChannelIcon({ type }: { type: ExpertChannel["type"] }) {
  const className = "size-3.5";
  switch (type) {
    case "linkedin":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
          <path d="M6.94 6.5A1.94 1.94 0 1 1 5 4.56 1.94 1.94 0 0 1 6.94 6.5ZM7 8.75H4V20h3V8.75Zm4.75 0H8.8V20h2.94v-5.7c0-1.5.28-2.95 2.14-2.95 1.84 0 1.86 1.72 1.86 3.05V20H18.7v-6.26c0-3.07-.66-5.43-4.24-5.43-1.72 0-2.87.94-3.34 1.83h-.05V8.75Z" />
        </svg>
      );
    case "youtube":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
          <path d="M21.6 7.2a2.7 2.7 0 0 0-1.9-1.9C18 5 12 5 12 5s-6 0-7.7.3A2.7 2.7 0 0 0 2.4 7.2 28.2 28.2 0 0 0 2 12a28.2 28.2 0 0 0 .4 4.8 2.7 2.7 0 0 0 1.9 1.9C6 19 12 19 12 19s6 0 7.7-.3a2.7 2.7 0 0 0 1.9-1.9A28.2 28.2 0 0 0 22 12a28.2 28.2 0 0 0-.4-4.8ZM10 15.2V8.8L15.5 12 10 15.2Z" />
        </svg>
      );
    case "podcast":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
          <path d="M12 3a4 4 0 0 0-4 4v4a4 4 0 0 0 8 0V7a4 4 0 0 0-4-4Zm0 14a6.5 6.5 0 0 1-6.5-6.5h-1.8A8.3 8.3 0 0 0 11 18.6V21h2v-2.4a8.3 8.3 0 0 0 7.3-8.1h-1.8A6.5 6.5 0 0 1 12 17Z" />
        </svg>
      );
    case "x":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
          <path d="M17.5 3h3l-6.6 7.5L22 21h-5.7l-4.5-5.9L7 21H4l7.1-8.1L2.5 3H8.3l4 5.3L17.5 3Zm-1 16.2h1.7L7.6 4.7H5.8l10.7 14.5Z" />
        </svg>
      );
    default:
      return null;
  }
}

function channelLabel(type: ExpertChannel["type"]) {
  switch (type) {
    case "linkedin":
      return "LinkedIn";
    case "youtube":
      return "YouTube";
    case "podcast":
      return "Podcast";
    case "x":
      return "X";
  }
}

export function RosterCard({ expert }: { expert: RosterCardExpert }) {
  const [shortlisted, setShortlisted] = useState(false);
  const imageSrc = expert.image ?? "/images/creator-placeholder.png";
  const channels = expert.channels;

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(SHORTLIST_KEY) ?? "[]");
      if (Array.isArray(stored)) {
        setShortlisted(stored.includes(expert.slug));
      }
    } catch {
      /* ignore */
    }
  }, [expert.slug]);

  function toggleShortlist(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    try {
      const stored = JSON.parse(localStorage.getItem(SHORTLIST_KEY) ?? "[]");
      const list = Array.isArray(stored) ? (stored as string[]) : [];
      const next = list.includes(expert.slug)
        ? list.filter((slug) => slug !== expert.slug)
        : [...list, expert.slug];
      localStorage.setItem(SHORTLIST_KEY, JSON.stringify(next));
      setShortlisted(next.includes(expert.slug));
    } catch {
      setShortlisted((prev) => !prev);
    }
  }

  return (
    <div className="group relative z-0 h-full hover:z-20">
      {/* Locks grid cell height to the resting card so hover expansion never reflows the row */}
      <div className="invisible" aria-hidden inert>
        <div className="rounded-sm border border-transparent p-3">
          <div className="aspect-4/3" />
          <CardBody expert={expert} channels={channels} isStatic />
        </div>
      </div>

      <article
        className={cn(
          "absolute inset-x-0 top-0 flex min-h-full flex-col rounded-sm border border-charcoal/8 bg-[#FBF8F5] p-3",
          "shadow-[0_10px_28px_rgba(28,26,23,0.05)]",
          "transition-[transform,box-shadow,border-color] duration-500",
          "hover:-translate-y-3 hover:border-forest/25",
          "hover:shadow-[0_22px_44px_rgba(42,73,57,0.14)]",
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
          {expert.role ? (
            <span className="absolute right-2.5 bottom-2.5 rounded-sm border border-cream/20 bg-forest/70 px-2.5 py-1 text-[10px] font-medium tracking-[0.14em] text-cream uppercase shadow-[0_6px_20px_rgba(42,73,57,0.3)] backdrop-blur-md">
              {formatLabel(expert.role)}
            </span>
          ) : null}
        </div>

        <CardBody expert={expert} channels={channels} />

        <div
          className={cn(
            "grid transition-[grid-template-rows,opacity] duration-500",
            "grid-rows-[0fr] opacity-0",
            "group-hover:grid-rows-[1fr] group-hover:opacity-100",
          )}
          style={{ transitionTimingFunction: EASE }}
        >
          <div className="min-h-0 overflow-hidden">
            <div
              className={cn(
                "flex gap-2 px-1.5 pt-4 md:px-2",
                "translate-y-2 transition-transform duration-500",
                "group-hover:translate-y-0",
              )}
              style={{ transitionTimingFunction: EASE }}
            >
              <Link
                href={`/roster/${expert.slug}`}
                className="inline-flex flex-1 items-center justify-center rounded-sm border border-forest bg-forest px-3 py-2.5 text-[0.8125rem] font-medium text-cream transition-colors duration-300 hover:border-forest-dark hover:bg-forest-dark"
              >
                View profile
              </Link>
              <button
                type="button"
                onClick={toggleShortlist}
                aria-pressed={shortlisted}
                className={cn(
                  "inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-sm border px-3 py-2.5 text-[0.8125rem] font-medium transition-colors duration-300",
                  shortlisted
                    ? "border-forest bg-forest/8 text-forest hover:bg-forest/12"
                    : "border-charcoal/25 bg-transparent text-charcoal hover:border-charcoal hover:bg-charcoal hover:text-cream",
                )}
              >
                {shortlisted ? (
                  <>
                    <Check weight="bold" className="size-3 shrink-0" aria-hidden />
                    Shortlisted
                  </>
                ) : (
                  <>
                    <Plus weight="bold" className="size-3 shrink-0" aria-hidden />
                    Shortlist
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

function CardBody({
  expert,
  channels,
  isStatic = false,
}: {
  expert: RosterCardExpert;
  channels: ExpertChannel[];
  isStatic?: boolean;
}) {
  return (
    <div className="flex flex-1 flex-col px-1.5 pt-4 pb-2 md:px-2 md:pt-4.5 md:pb-2.5">
      <h2 className="font-display text-[1.2rem] leading-[1.15] tracking-tight text-charcoal transition-colors duration-300 group-hover:text-forest md:text-[1.3rem]">
        {expert.name}
      </h2>

      {expert.shortBio ? (
        <p className="mt-2 line-clamp-2 text-[0.78rem] leading-normal text-charcoal/60 md:text-[0.8125rem]">
          {expert.shortBio}
        </p>
      ) : null}

      {(expert.combinedReach || expert.growth90d || channels.length > 0) && (
        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-charcoal/10 pt-3.5">
          <div>
            <p className="text-[10px] text-charcoal/45">Combined reach</p>
            <p className="mt-1 font-display text-[1.15rem] leading-none tracking-tight text-charcoal">
              {expert.combinedReach ?? "—"}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-charcoal/45">90d growth</p>
            <p className="mt-1 font-display text-[1.15rem] leading-none tracking-tight text-forest">
              {expert.growth90d ?? "—"}
            </p>
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-charcoal/45">Channels</p>
            <div className="mt-1.5 flex flex-wrap gap-1">
              {channels.map((channel) =>
                isStatic ? (
                  <span
                    key={`${channel.type}-${channel.url}`}
                    className="inline-flex size-6 items-center justify-center rounded-sm bg-[#E4EBE6] text-charcoal/70"
                  >
                    <ChannelIcon type={channel.type} />
                  </span>
                ) : (
                  <a
                    key={`${channel.type}-${channel.url}`}
                    href={channel.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${expert.name} on ${channelLabel(channel.type)}`}
                    onClick={(event) => event.stopPropagation()}
                    className="inline-flex size-6 items-center justify-center rounded-sm bg-[#E4EBE6] text-charcoal/70 transition-colors hover:bg-forest hover:text-cream"
                  >
                    <ChannelIcon type={channel.type} />
                  </a>
                ),
              )}
            </div>
          </div>
        </div>
      )}

      {(expert.audienceWho || expert.audienceWhere) && (
        <div className="mt-auto pt-3.5">
          <p className="text-[10px] text-charcoal/45">Audience</p>
          <p className="mt-1 text-[0.78rem] leading-snug text-charcoal/65">
            Reaches{" "}
            {expert.audienceWho ? (
              <span className="font-medium text-charcoal">
                {expert.audienceWho}
              </span>
            ) : null}
            {expert.audienceWho && expert.audienceWhere ? " in " : null}
            {expert.audienceWhere ? (
              <span className="font-medium text-charcoal">
                {expert.audienceWhere}
              </span>
            ) : null}
          </p>
        </div>
      )}

      {expert.topics.length > 0 ? (
        <div
          className={cn(
            "flex flex-wrap gap-1.5",
            expert.audienceWho || expert.audienceWhere ? "mt-3.5" : "mt-auto pt-3.5",
          )}
        >
          {expert.topics.slice(0, 3).map((topic) => (
            <span
              key={topic}
              className="rounded-full bg-[#E4EBE6] px-2.5 py-1 text-[9px] font-medium tracking-[0.08em] text-charcoal/65 uppercase"
            >
              {formatLabel(topic)}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
