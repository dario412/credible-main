"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowSquareOut,
  EnvelopeSimple,
  FacebookLogo,
  InstagramLogo,
  LinkedinLogo,
  Microphone,
  TiktokLogo,
  XLogo,
  YoutubeLogo,
} from "@phosphor-icons/react/ssr";

import {
  AudienceShareList,
  TopicMixPie,
} from "@/components/expert-audience-map";
import { ExpertFormatsGrid } from "@/components/expert-formats-grid";
import { ExpertInterestCta } from "@/components/expert-interest-cta";
import { ExpertProfileSimilarIntro } from "@/components/expert-profile-similar-intro";
import { ExpertQuoteCard } from "@/components/expert-quote-card";
import { FeaturedCaseStudyCard, ExpertTestimonials } from "@/components/expert-work-layouts";
import { EYEBROW } from "@/components/inner-page";
import { PatternField } from "@/components/pattern-field";
import { RepresentationFaq } from "@/components/representation-faq";
import type { RosterCardExpert } from "@/components/roster-card";
import { SimilarCreatorsGrid } from "@/components/similar-creators-grid";
import { StatCounter } from "@/components/stat-counter";
import { useSiteChrome } from "@/components/site-chrome-context";
import { ProfileEditHit } from "@/components/use-profile-edit-hit";
import {
  firstName,
  type ExpertAudience,
  type ExpertChannelPresence,
  type ExpertFormatOffering,
  type ExpertProfileTestimonial,
  type ExpertRecentWork,
  type ExpertTopicShare,
} from "@/lib/expert-profiles";
import { getCaseStudy, projectSlugFromHref } from "@/lib/case-studies";
import {
  applyProfileRailTemplate,
  type ProfileBodySectionId,
  type ProfileFooterBlockId,
} from "@/lib/site-chrome";
import { coverAltFor } from "@/lib/image-alt";
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

function channelMark(
  channel: ExpertChannelPresence,
): ExpertChannelPresence["icon"] {
  const platform = channel.platform.toLowerCase();
  const url = (channel.url ?? "").toLowerCase();

  if (platform.includes("linkedin") || url.includes("linkedin.com")) {
    return "linkedin";
  }
  if (
    platform.includes("youtube") ||
    url.includes("youtube.com") ||
    url.includes("youtu.be")
  ) {
    return "youtube";
  }
  if (platform.includes("instagram") || url.includes("instagram.com")) {
    return "instagram";
  }
  if (
    platform.includes("facebook") ||
    url.includes("facebook.com") ||
    url.includes("fb.com")
  ) {
    return "facebook";
  }
  if (platform.includes("newsletter") || url.includes("substack.com")) {
    return "newsletter";
  }
  if (
    platform.includes("twitter") ||
    platform === "x" ||
    platform.startsWith("x /") ||
    url.includes("x.com") ||
    url.includes("twitter.com")
  ) {
    return "x";
  }
  return channel.icon;
}

function ChannelGlyph({ channel }: { channel: ExpertChannelPresence }) {
  const mark = channelMark(channel);
  const className = "size-5";

  const styles: Record<
    ExpertChannelPresence["icon"],
    { tint: string; icon: ReactNode }
  > = {
    linkedin: {
      tint: "bg-[#0A66C2] text-white",
      icon: <LinkedinLogo weight="fill" className={className} aria-hidden />,
    },
    youtube: {
      tint: "bg-[#FF0000] text-white",
      icon: <YoutubeLogo weight="fill" className={className} aria-hidden />,
    },
    x: {
      tint: "bg-charcoal text-cream",
      icon: <XLogo weight="fill" className={className} aria-hidden />,
    },
    instagram: {
      tint: "bg-[#E1306C] text-white",
      icon: <InstagramLogo weight="fill" className={className} aria-hidden />,
    },
    facebook: {
      tint: "bg-[#1877F2] text-white",
      icon: <FacebookLogo weight="fill" className={className} aria-hidden />,
    },
    newsletter: {
      tint: "bg-forest text-cream",
      icon: <EnvelopeSimple weight="fill" className={className} aria-hidden />,
    },
    podcast: {
      tint: "bg-[#935B3B] text-cream",
      icon: <Microphone weight="fill" className={className} aria-hidden />,
    },
    tiktok: {
      tint: "bg-charcoal text-cream",
      icon: <TiktokLogo weight="fill" className={className} aria-hidden />,
    },
  };

  const visual = styles[mark] ?? styles.newsletter;

  return (
    <span
      className={cn(
        "inline-flex size-10 shrink-0 items-center justify-center rounded-sm shadow-[inset_0_0_0_1px_rgba(28,26,23,0.06)]",
        visual.tint,
      )}
      aria-hidden
      title={channel.platform}
    >
      {visual.icon}
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
  title,
  eyebrow,
}: {
  first: string;
  bio: string;
  quote?: string;
  quoteAttribution?: string;
  title: string;
  eyebrow: string;
}) {
  const paragraphs = bioParagraphs(bio);

  return (
    <div id="overview" className="scroll-mt-28">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <ProfileEditHit
          field="profileLayout.headings.overview"
          label="Overview heading"
          block
        >
          <h2 className="max-w-[16ch] font-display text-[1.75rem] leading-[1.08] tracking-tight text-charcoal md:text-[2rem]">
            {title}
          </h2>
        </ProfileEditHit>
        <ProfileEditHit
          field="profileLayout.headings.overviewEyebrow"
          label="Overview eyebrow"
        >
          <p className="text-[0.7rem] font-medium tracking-[0.14em] text-charcoal/40 uppercase">
            {eyebrow}
          </p>
        </ProfileEditHit>
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
  title,
}: {
  channels: ExpertChannelPresence[];
  title: string;
}) {
  return (
    <section id="channels" className="scroll-mt-28">
      <ProfileEditHit
        field="profileLayout.headings.channels"
        label="Channels heading"
        block
      >
        <SectionHeading>{title}</SectionHeading>
      </ProfileEditHit>

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
                const href = channel.url;

                return (
                  <tr
                    key={`${channel.platform}-${channel.handle}`}
                    className="border-b border-charcoal/8 last:border-b-0"
                  >
                    <td className="px-3 py-4 first:pl-4 md:px-4 md:py-4.5">
                      <ChannelGlyph channel={channel} />
                    </td>
                    <td className="px-3 py-4 md:px-4 md:py-4.5">
                      <div className="flex items-center gap-2">
                        <p className="text-[0.9375rem] font-medium text-charcoal">
                          {channel.platform}
                        </p>
                        {href ? (
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
                        ) : null}
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
  topicShares,
  audience,
  title,
}: {
  first: string;
  topicShares: ExpertTopicShare[];
  audience: ExpertAudience;
  title: string;
}) {
  return (
    <section id="topics" className="scroll-mt-28">
      <div className="max-w-2xl">
        <ProfileEditHit
          field="profileLayout.headings.topics"
          label="Topics heading"
          block
        >
          <SectionHeading className="max-w-none">{title}</SectionHeading>
        </ProfileEditHit>
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
  title,
}: {
  formats: ExpertFormatOffering[];
  name: string;
  title: string;
}) {
  return (
    <section id="formats" className="scroll-mt-28">
      <ProfileEditHit
        field="profileLayout.headings.formats"
        label="Formats heading"
        block
      >
        <SectionHeading>{title}</SectionHeading>
      </ProfileEditHit>
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
  if (item.coverImage?.trim()) return item.coverImage.trim();
  const slug = projectSlugFromHref(item.href);
  if (!slug) return null;
  return getCaseStudy(slug)?.coverImage ?? null;
}

function RecentWorkSection({
  work,
  title,
}: {
  work: ExpertRecentWork[];
  title: string;
}) {
  if (work.length === 1) {
    return (
      <section id="work" className="scroll-mt-28">
        <ProfileEditHit
          field="profileLayout.headings.work"
          label="Recent work heading"
          block
        >
          <SectionHeading>{title}</SectionHeading>
        </ProfileEditHit>
        <div className="mt-8">
          <FeaturedCaseStudyCard item={work[0]!} />
        </div>
      </section>
    );
  }

  return (
    <section id="work" className="scroll-mt-28">
      <ProfileEditHit
        field="profileLayout.headings.work"
        label="Recent work heading"
        block
      >
        <SectionHeading>{title}</SectionHeading>
      </ProfileEditHit>

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
                    alt={coverAltFor(`${item.client} project`)}
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
                  View project
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
            <li key={`${item.href ?? item.title}-${item.client}`}>
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

function TestimonialsSection({
  items,
  title,
}: {
  items: ExpertProfileTestimonial[];
  title: string;
}) {
  return (
    <section id="testimonials" className="scroll-mt-28">
      <SectionHeading>{title}</SectionHeading>
      <div className="mt-8">
        <ExpertTestimonials items={items} />
      </div>
    </section>
  );
}

function ProfileFaqSection() {
  const { chrome, editing, canEdit } = useSiteChrome();
  const faqItems = chrome.profileFaq.items.filter(
    (item) => item.q.trim() && item.a.trim(),
  );
  const showFaq = faqItems.length > 0 || (editing && canEdit);

  if (!showFaq) return null;

  return (
    <section id="profile-faq" className="scroll-mt-28">
      <ProfileEditHit field="profileFaq" label="FAQ" block>
        <p className={EYEBROW}>{chrome.profileFaq.eyebrow}</p>
        <SectionHeading className="mt-4 max-w-[22ch]">
          {chrome.profileFaq.headline}
        </SectionHeading>
        <p className="mt-5 max-w-xl text-[0.9375rem] leading-relaxed text-charcoal/65 md:text-[1rem]">
          {chrome.profileFaq.subhead}
        </p>
      </ProfileEditHit>
      <div className="mt-10">
        <ProfileEditHit field="profileFaq" label="FAQ items" block>
          {faqItems.length > 0 ? (
            <RepresentationFaq items={faqItems} />
          ) : (
            <p className="text-sm text-charcoal/45">
              Add FAQ questions in the profile template editor…
            </p>
          )}
        </ProfileEditHit>
      </div>
    </section>
  );
}

const CTA_PATTERN_COLOR = { r: 249, g: 243, b: 239 };

function ProfileInterestCtaSection({
  name,
  slug,
}: {
  name: string;
  slug: string;
}) {
  return (
    <section id="profile-cta" className="scroll-mt-28">
      <div className="relative isolate overflow-hidden rounded-sm bg-charcoal px-6 py-12 text-center shadow-[0_24px_60px_rgba(28,26,23,0.18)] md:px-10 md:py-14">
        <PatternField
          color={CTA_PATTERN_COLOR}
          className="opacity-[0.12]"
          mask="radial-gradient(120% 100% at 100% 50%, black 0%, rgba(0,0,0,0.55) 38%, transparent 78%)"
        />
        <div className="relative z-2">
          <ExpertInterestCta name={name} slug={slug} />
        </div>
      </div>
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
  testimonials,
  name,
  slug,
}: {
  bio: string;
  quote?: string;
  quoteAttribution?: string;
  channels?: ExpertChannelPresence[];
  topicShares?: ExpertTopicShare[];
  audience?: ExpertAudience;
  formats?: ExpertFormatOffering[];
  recentWork?: ExpertRecentWork[];
  testimonials?: ExpertProfileTestimonial[];
  name: string;
  slug: string;
}) {
  const { chrome } = useSiteChrome();
  const layout = chrome.profileLayout;
  const first = firstName(name);
  const vars = { first, name };
  const hasTopicsAudience =
    (topicShares?.length ?? 0) > 0 && audience != null;

  const heading = {
    overview: applyProfileRailTemplate(layout.headings.overview, vars),
    overviewEyebrow: layout.headings.overviewEyebrow,
    channels: applyProfileRailTemplate(layout.headings.channels, vars),
    topics: applyProfileRailTemplate(layout.headings.topics, vars),
    formats: applyProfileRailTemplate(layout.headings.formats, vars),
    work: applyProfileRailTemplate(layout.headings.work, vars),
  };

  const sectionNodes: Partial<Record<ProfileBodySectionId, ReactNode>> = {
    overview: (
      <IntroBlock
        first={first}
        bio={bio}
        quote={quote}
        quoteAttribution={quoteAttribution}
        title={heading.overview}
        eyebrow={heading.overviewEyebrow}
      />
    ),
    channels:
      channels && channels.length > 0 ? (
        <ChannelsSection channels={channels} title={heading.channels} />
      ) : null,
    topics: hasTopicsAudience ? (
      <TopicsAndAudience
        first={first}
        topicShares={topicShares!}
        audience={audience!}
        title={heading.topics}
      />
    ) : null,
    formats:
      formats && formats.length > 0 ? (
        <FormatsSection
          formats={formats}
          name={name}
          title={heading.formats}
        />
      ) : null,
    work:
      recentWork && recentWork.length > 0 ? (
        <RecentWorkSection work={recentWork} title={heading.work} />
      ) : null,
  };

  return (
    <div className="flex flex-col gap-14 md:gap-16 lg:gap-20 lg:pt-1">
      {layout.sectionOrder.map((id) => {
        const node = sectionNodes[id];
        return node ? <div key={id}>{node}</div> : null;
      })}
      {testimonials && testimonials.length > 0 ? (
        <div key="testimonials">
          <TestimonialsSection
            items={testimonials}
            title="What partners say."
          />
        </div>
      ) : null}
      <ProfileFaqSection />
      <ProfileInterestCtaSection name={name} slug={slug} />
    </div>
  );
}

export function ExpertProfileFooter({
  similar,
}: {
  name: string;
  slug: string;
  similar: RosterCardExpert[];
}) {
  const { chrome } = useSiteChrome();
  const footerOrder = chrome.profileLayout.footerOrder;

  const blocks: Record<ProfileFooterBlockId, ReactNode> = {
    similar:
      similar.length > 0 ? (
        <section
          key="similar"
          className="bg-cream px-6 pt-4 pb-16 md:px-10 md:pb-20 lg:px-12 lg:pb-24"
        >
          <div className="mx-auto max-w-352">
            <ExpertProfileSimilarIntro />

            <SimilarCreatorsGrid experts={similar} />
          </div>
        </section>
      ) : null,
  };

  return <>{footerOrder.map((id) => blocks[id])}</>;
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
