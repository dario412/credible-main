import Image from "next/image";
import Link from "next/link";
import { ArrowSquareOut } from "@phosphor-icons/react/ssr";
import type { ReactNode } from "react";

import {
  AudienceShareList,
  TopicMixPie,
} from "@/components/expert-audience-map";
import { ExpertFormatsGrid } from "@/components/expert-formats-grid";
import { ExpertInterestCta } from "@/components/expert-interest-cta";
import { ExpertProfileSimilarIntro } from "@/components/expert-profile-similar-intro";
import { ExpertQuoteCard } from "@/components/expert-quote-card";
import { ExpertWorkLayoutPreviews } from "@/components/expert-work-layouts";
import { PatternField } from "@/components/pattern-field";
import type { RosterCardExpert } from "@/components/roster-card";
import { SimilarCreatorsGrid } from "@/components/similar-creators-grid";
import { StatCounter } from "@/components/stat-counter";
import {
  channelPresenceUrl,
  firstName,
  type ExpertAudience,
  type ExpertChannelPresence,
  type ExpertFormatOffering,
  type ExpertRecentWork,
  type ExpertTopicShare,
} from "@/lib/expert-profiles";
import { getCaseStudy } from "@/lib/case-studies";
import { cn } from "@/lib/utils";

function SectionHeading({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "max-w-[18ch] font-display text-[1.75rem] leading-[1.08] tracking-tight text-charcoal md:text-[2rem]",
        className,
      )}
    >
      {children}
    </h2>
  );
}

function ChannelGlyph({
  icon,
}: {
  icon: ExpertChannelPresence["icon"];
}) {
  const className = "size-5";

  let mark: ReactNode = null;
  let tint = "bg-charcoal text-cream";

  switch (icon) {
    case "linkedin":
      tint = "bg-[#0A66C2] text-white";
      mark = (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
          <path d="M6.94 6.5A1.94 1.94 0 1 1 5 4.56 1.94 1.94 0 0 1 6.94 6.5ZM7 8.75H4V20h3V8.75Zm4.75 0H8.8V20h2.94v-5.7c0-1.5.28-2.95 2.14-2.95 1.84 0 1.86 1.72 1.86 3.05V20H18.7v-6.26c0-3.07-.66-5.43-4.24-5.43-1.72 0-2.87.94-3.34 1.83h-.05V8.75Z" />
        </svg>
      );
      break;
    case "youtube":
      tint = "bg-[#FF0000] text-white";
      mark = (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
          <path d="M21.6 7.2a2.7 2.7 0 0 0-1.9-1.9C18 5 12 5 12 5s-6 0-7.7.3A2.7 2.7 0 0 0 2.4 7.2 28.2 28.2 0 0 0 2 12a28.2 28.2 0 0 0 .4 4.8 2.7 2.7 0 0 0 1.9 1.9C6 19 12 19 12 19s6 0 7.7-.3a2.7 2.7 0 0 0 1.9-1.9A28.2 28.2 0 0 0 22 12a28.2 28.2 0 0 0-.4-4.8ZM10 15.2V8.8L15.5 12 10 15.2Z" />
        </svg>
      );
      break;
    case "podcast":
      tint = "bg-[#935B3B] text-cream";
      mark = (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
          <path d="M12 3a4 4 0 0 0-4 4v4a4 4 0 0 0 8 0V7a4 4 0 0 0-4-4Zm0 14a6.5 6.5 0 0 1-6.5-6.5h-1.8A8.3 8.3 0 0 0 11 18.6V21h2v-2.4a8.3 8.3 0 0 0 7.3-8.1h-1.8A6.5 6.5 0 0 1 12 17Z" />
        </svg>
      );
      break;
    case "newsletter":
      tint = "bg-forest text-cream";
      mark = (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
          <path d="M3.5 5.75A1.75 1.75 0 0 1 5.25 4h13.5A1.75 1.75 0 0 1 20.5 5.75v12.5A1.75 1.75 0 0 1 18.75 20H5.25A1.75 1.75 0 0 1 3.5 18.25V5.75Zm1.75-.25a.25.25 0 0 0-.25.25v.4l7 4.55 7-4.55v-.4a.25.25 0 0 0-.25-.25H5.25Zm13.5 3.05-6.52 4.23a.75.75 0 0 1-.82 0L5 8.55v9.7c0 .14.11.25.25.25h13.5a.25.25 0 0 0 .25-.25V8.55Z" />
        </svg>
      );
      break;
    case "x":
      tint = "bg-charcoal text-cream";
      mark = (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
          <path d="M17.5 3h3l-6.6 7.5L22 21h-5.7l-4.5-5.9L7 21H4l7.1-8.1L2.5 3H8.3l4 5.3L17.5 3Zm-1 16.2h1.7L7.6 4.7H5.8l10.7 14.5Z" />
        </svg>
      );
      break;
  }

  return (
    <span
      className={cn(
        "inline-flex size-10 shrink-0 items-center justify-center rounded-sm shadow-[inset_0_0_0_1px_rgba(28,26,23,0.06)]",
        tint,
      )}
      aria-hidden
    >
      {mark}
    </span>
  );
}

const WORK_TONE: Record<ExpertRecentWork["tone"], string> = {
  forest: "bg-[#345B47] text-cream",
  rust: "bg-rust text-cream",
  sage: "bg-[#D8E2DC] text-charcoal",
};

function bioParagraphs(bio: string): string[] {
  const trimmed = bio.trim();
  if (!trimmed) return [];

  const explicit = trimmed
    .split(/\n\s*\n/)
    .map((part) => part.replace(/\s+/g, " ").trim())
    .filter(Boolean);
  if (explicit.length > 1) return explicit;

  const words = trimmed.split(/\s+/).filter(Boolean);
  // Short bios stay as one block; longer (~200 words) get readable breaks.
  if (words.length < 110) return [trimmed];

  const sentences =
    trimmed.match(/[^.!?]+[.!?]+(?:\s+|$)|[^.!?]+$/g)?.map((s) => s.trim()) ??
    [trimmed];

  if (sentences.length <= 2) return [trimmed];

  const target = Math.ceil(sentences.length / (words.length > 180 ? 3 : 2));
  const groups: string[] = [];
  for (let i = 0; i < sentences.length; i += target) {
    groups.push(sentences.slice(i, i + target).join(" "));
  }
  return groups.filter(Boolean);
}

function IntroBlock({
  first,
  bio,
  quote,
  quoteAttribution,
}: {
  first: string;
  bio: string;
  quote?: string;
  quoteAttribution?: string;
}) {
  const paragraphs = bioParagraphs(bio);

  return (
    <div id="overview" className="scroll-mt-28">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="max-w-[16ch] font-display text-[1.75rem] leading-[1.08] tracking-tight text-charcoal md:text-[2rem]">
          About {first}.
        </h2>
        <p className="text-[0.7rem] font-medium tracking-[0.14em] text-charcoal/40 uppercase">
          Biography
        </p>
      </div>

      <div
        className={cn(
          "mt-7 grid gap-8 md:mt-8",
          quote
            ? "lg:grid-cols-[minmax(0,1fr)_minmax(15rem,20rem)] lg:items-start lg:gap-10 xl:gap-12"
            : "",
        )}
      >
        <div className="rounded-sm bg-[#FBF8F5] px-5 py-7 md:px-7 md:py-8 lg:px-8 lg:py-9">
          <div className="max-w-[62ch] space-y-5 text-[1.02rem] leading-[1.75] text-charcoal/78 md:text-[1.06rem] md:leading-[1.72]">
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>

        {quote ? (
          <ExpertQuoteCard
            quote={quote}
            attribution={quoteAttribution}
            className="lg:sticky lg:top-28"
          />
        ) : null}
      </div>
    </div>
  );
}

function ChannelsSection({
  channels,
}: {
  channels: ExpertChannelPresence[];
}) {
  return (
    <section id="channels" className="scroll-mt-28">
      <SectionHeading>Presence across channels.</SectionHeading>

      <div className="mt-8 overflow-hidden rounded-sm border border-charcoal/10 bg-[#FBF8F5] shadow-[0_12px_32px_rgba(28,26,23,0.06)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[24rem] border-collapse text-left">
            <thead>
              <tr className="border-b border-charcoal/10 bg-cream">
                {["", "Platform", "Followers"].map((label) => (
                  <th
                    key={label || "icon"}
                    className="px-3 py-3.5 text-[0.65rem] font-medium tracking-[0.14em] text-charcoal/45 uppercase first:w-14 first:pl-4 last:pr-4 md:px-4"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {channels.map((channel) => {
                const href = channelPresenceUrl(channel);

                return (
                  <tr
                    key={`${channel.platform}-${channel.handle}`}
                    className="border-b border-charcoal/8 last:border-b-0"
                  >
                    <td className="px-3 py-4 first:pl-4 md:px-4 md:py-4.5">
                      <ChannelGlyph icon={channel.icon} />
                    </td>
                    <td className="px-3 py-4 md:px-4 md:py-4.5">
                      <div className="flex items-center gap-2">
                        <p className="text-[0.9375rem] font-medium text-charcoal">
                          {channel.platform}
                        </p>
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Open ${channel.platform} profile`}
                          className="inline-flex size-6 shrink-0 items-center justify-center rounded-sm text-charcoal/40 transition-colors hover:bg-charcoal/5 hover:text-forest"
                        >
                          <ArrowSquareOut
                            weight="bold"
                            className="size-3.5"
                            aria-hidden
                          />
                        </a>
                      </div>
                      <p className="mt-1 text-[0.8125rem] font-medium tracking-tight text-charcoal/70">
                        {channel.handle}
                      </p>
                    </td>
                    <td className="px-3 py-4 text-[1.05rem] font-medium tabular-nums tracking-tight text-charcoal last:pr-4 md:px-4 md:py-4.5 md:text-[1.125rem]">
                      <StatCounter value={channel.followers} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function TopicsAndAudience({
  first,
  topicShares,
  audience,
}: {
  first: string;
  topicShares: ExpertTopicShare[];
  audience: ExpertAudience;
}) {
  return (
    <section id="topics" className="scroll-mt-28">
      <div className="max-w-2xl">
        <SectionHeading className="max-w-none">
          What {first} covers — and who shows up for it.
        </SectionHeading>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 sm:gap-4 md:mt-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)_minmax(0,1fr)] lg:gap-5">
        <TopicMixPie topics={topicShares} className="sm:col-span-2 lg:col-span-1" />
        {audience.seniority.length > 0 ? (
          <AudienceShareList title="Audience" items={audience.seniority} />
        ) : null}
        {audience.industry.length > 0 ? (
          <AudienceShareList
            title="Best for"
            items={audience.industry}
            delay={120}
          />
        ) : null}
      </div>
    </section>
  );
}

function FormatsSection({
  formats,
  name,
}: {
  formats: ExpertFormatOffering[];
  name: string;
}) {
  return (
    <section id="formats" className="scroll-mt-28">
      <SectionHeading>Formats available.</SectionHeading>
      <ExpertFormatsGrid formats={formats} name={name} />
    </section>
  );
}

function workTypeLabel(meta: string) {
  return meta
    .replace(/\s*[·•]\s*\d{4}(?:[–-]\d{2,4})?\s*$/u, "")
    .trim();
}

function workCover(item: ExpertRecentWork): string | null {
  if (!item.href?.startsWith("/case-studies/")) return null;
  const slug = item.href.replace(/^\/case-studies\//, "").replace(/\/$/, "");
  return getCaseStudy(slug)?.coverImage ?? null;
}

function RecentWorkSection({ work }: { work: ExpertRecentWork[] }) {
  return (
    <section id="work" className="scroll-mt-28">
      <SectionHeading>Recent work.</SectionHeading>

      <ul className="mt-8 grid gap-7 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {work.map((item) => {
          const typeLabel = workTypeLabel(item.meta);
          const cover = workCover(item);
          const card = (
            <>
              <div
                className={cn(
                  "relative flex aspect-4/3 items-center justify-center overflow-hidden rounded-sm",
                  !cover && WORK_TONE[item.tone],
                )}
              >
                {cover ? (
                  <Image
                    src={cover}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 18rem, (min-width: 640px) 40vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.035]"
                  />
                ) : (
                  <span className="font-display text-[1.5rem] tracking-tight md:text-[1.7rem]">
                    {item.client}
                  </span>
                )}
                {typeLabel ? (
                  <span className="absolute top-3 left-3 z-10 rounded-sm border border-cream/25 bg-charcoal/40 px-2.5 py-1 text-[0.625rem] font-medium tracking-[0.12em] text-cream uppercase shadow-[0_6px_18px_rgba(28,26,23,0.18)] backdrop-blur-md">
                    {typeLabel}
                  </span>
                ) : null}
              </div>
              <p className="mt-4 text-[0.65rem] font-medium tracking-[0.12em] text-charcoal/40 uppercase">
                {item.client}
              </p>
              <h3 className="mt-1.5 font-display text-[1.15rem] leading-snug tracking-tight text-charcoal transition-colors duration-300 group-hover:text-forest">
                {item.title}
              </h3>
              <p className="mt-2 text-[0.875rem] leading-relaxed text-charcoal/55">
                {item.description}
              </p>
              {item.href ? (
                <span className="mt-3 inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-charcoal/50 transition-colors duration-300 group-hover:text-forest">
                  View case
                  <span
                    aria-hidden
                    className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </span>
              ) : null}
            </>
          );

          return (
            <li key={item.title}>
              {item.href ? (
                <Link href={item.href} className="group block">
                  {card}
                </Link>
              ) : (
                <div>{card}</div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function ExpertProfileMain({
  bio,
  quote,
  quoteAttribution,
  channels,
  topicShares,
  audience,
  formats,
  recentWork,
  name,
}: {
  bio: string;
  quote?: string;
  quoteAttribution?: string;
  channels?: ExpertChannelPresence[];
  topicShares?: ExpertTopicShare[];
  audience?: ExpertAudience;
  formats?: ExpertFormatOffering[];
  recentWork?: ExpertRecentWork[];
  name: string;
}) {
  const first = firstName(name);
  const hasTopicsAudience =
    (topicShares?.length ?? 0) > 0 && audience != null;

  return (
    <div className="flex flex-col gap-14 md:gap-16 lg:gap-20 lg:pt-1">
      <IntroBlock
        first={first}
        bio={bio}
        quote={quote}
        quoteAttribution={quoteAttribution}
      />

      {channels && channels.length > 0 ? (
        <ChannelsSection channels={channels} />
      ) : null}

      {hasTopicsAudience ? (
        <TopicsAndAudience
          first={first}
          topicShares={topicShares!}
          audience={audience!}
        />
      ) : null}

      {formats && formats.length > 0 ? (
        <FormatsSection formats={formats} name={name} />
      ) : null}

      {recentWork && recentWork.length > 0 ? (
        <>
          <RecentWorkSection work={recentWork} />
          <section
            id="work-layout-options"
            className="scroll-mt-28"
            aria-label="Recent work layout options"
          >
            <ExpertWorkLayoutPreviews work={recentWork} />
          </section>
        </>
      ) : null}
    </div>
  );
}

const CTA_PATTERN_COLOR = { r: 249, g: 243, b: 239 };

export function ExpertProfileFooter({
  name,
  slug,
  similar,
}: {
  name: string;
  slug: string;
  similar: RosterCardExpert[];
}) {
  return (
    <>
      <section className="bg-cream px-6 py-16 md:px-10 md:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-352">
          <div className="relative isolate overflow-hidden rounded-sm bg-charcoal px-6 py-12 text-center shadow-[0_24px_60px_rgba(28,26,23,0.18)] md:px-12 md:py-14">
            <PatternField
              color={CTA_PATTERN_COLOR}
              className="opacity-[0.12]"
              mask="radial-gradient(120% 100% at 100% 50%, black 0%, rgba(0,0,0,0.55) 38%, transparent 78%)"
            />

            <div className="relative z-2">
              <ExpertInterestCta name={name} slug={slug} />
            </div>
          </div>
        </div>
      </section>

      {similar.length > 0 ? (
        <section className="bg-cream px-6 pt-4 pb-16 md:px-10 md:pb-20 lg:px-12 lg:pb-24">
          <div className="mx-auto max-w-352">
            <ExpertProfileSimilarIntro />

            <SimilarCreatorsGrid experts={similar} />
          </div>
        </section>
      ) : null}
    </>
  );
}

/** @deprecated Prefer ExpertProfileMain + ExpertProfileFooter */
export function ExpertProfileBody(
  props: Parameters<typeof ExpertProfileMain>[0] & {
    slug: string;
    similar: RosterCardExpert[];
  },
) {
  return (
    <>
      <ExpertProfileMain {...props} />
      <ExpertProfileFooter
        name={props.name}
        slug={props.slug}
        similar={props.similar}
      />
    </>
  );
}
