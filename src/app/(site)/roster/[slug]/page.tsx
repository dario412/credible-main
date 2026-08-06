import { notFound } from "next/navigation";

import {
  ExpertProfileFooter,
  ExpertProfileMain,
} from "@/components/expert-profile-body";
import { ExpertProfileShell } from "@/components/expert-profile-hero";
import { ExpertProfileStageHero } from "@/components/expert-profile-stage-hero";
import type { RosterCardExpert } from "@/components/roster-card";
import {
  brandsWithLogos,
  withResolvedLogos,
  type TrustedBrand,
} from "@/lib/brand-logos";
import type { AirtableProfileSections } from "@/lib/airtable/map-profile-sections";
import { parseExpertChannels } from "@/lib/expert-channels";
import {
  getExpertProfileEnrichment,
  isLinkedInTopVoice,
  type ExpertAudience,
  type ExpertChannelPresence,
  type ExpertFormatOffering,
  type ExpertProfileEnrichment,
  type ExpertProfileStat,
  type ExpertTopicShare,
} from "@/lib/expert-profiles";
import { prisma } from "@/lib/prisma";
import { createMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

type ProfileExtras = {
  nameFirst?: string | null;
  bannerImage?: string | null;
  highlight2?: string | null;
  highlight3?: string | null;
  exclusive?: boolean;
  quote?: string | null;
  quoteSource?: string | null;
  brandPartnershipsCopy?: string | null;
  trustedBy?: TrustedBrand[];
  profileSections?: AirtableProfileSections;
};

function parseProfileExtras(value: unknown): ProfileExtras {
  if (!value || typeof value !== "object") return {};
  return value as ProfileExtras;
}

/** Prefer Airtable section data when present; fall back to hardcoded enrichment. */
function mergeProfileContent(
  extras: ProfileExtras,
  enrichment: ExpertProfileEnrichment,
): {
  quote?: string;
  quoteAttribution?: string;
  channels?: ExpertChannelPresence[];
  topicShares?: ExpertTopicShare[];
  audience?: ExpertAudience;
  formats?: ExpertFormatOffering[];
  linkedinTopVoice: boolean;
} {
  const sections = extras.profileSections;
  const channels =
    sections?.channels?.length ? sections.channels : enrichment.channels;
  const topicShares =
    sections?.topicShares?.length
      ? sections.topicShares
      : enrichment.topicShares;
  const audience = sections?.audience ?? enrichment.audience;
  const formats =
    sections?.formats?.length ? sections.formats : enrichment.formats;
  const quote =
    sections?.quote ?? extras.quote ?? enrichment.quote ?? undefined;
  const quoteAttribution =
    sections?.quoteAttribution ??
    extras.quoteSource ??
    enrichment.quoteAttribution ??
    undefined;

  return {
    quote: quote ?? undefined,
    quoteAttribution: quoteAttribution ?? undefined,
    channels,
    topicShares,
    audience,
    formats,
    linkedinTopVoice:
      Boolean(sections?.linkedinTopVoice) ||
      Boolean(enrichment.linkedinTopVoice),
  };
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const expert = await prisma.expert.findUnique({ where: { slug } });
  if (!expert) return {};

  return createMetadata({
    title: expert.seoTitle ?? expert.name,
    description:
      expert.seoDescription ??
      expert.shortBio ??
      expert.bio.slice(0, 155),
    path: `/roster/${expert.slug}`,
  });
}

function buildStats(
  expert: {
    combinedReach: string | null;
    growth90d: string | null;
  },
  extras: ProfileExtras,
  enrichmentStats?: ExpertProfileStat[],
): ExpertProfileStat[] {
  if (enrichmentStats?.length) return enrichmentStats;

  const stats: ExpertProfileStat[] = [];
  if (expert.combinedReach) {
    stats.push({ label: "Combined reach", value: expert.combinedReach });
  }
  if (extras.highlight2) {
    const value = extras.highlight2.replace(/\s+/g, " ").trim();
    const metric = value.match(/^([+-]?[\d.,]+\s*[KkMmBb%+]*)/);
    stats.push({
      label: value.replace(metric?.[1] ?? "", "").trim() || "Highlight",
      value: (metric?.[1] ?? value).replace(/\s+/g, ""),
    });
  }
  if (extras.highlight3) {
    const value = extras.highlight3.replace(/\s+/g, " ").trim();
    const metric = value.match(/^([+-]?[\d.,]+\s*[KkMmBb%+]*)/);
    stats.push({
      label: value.replace(metric?.[1] ?? "", "").trim() || "Highlight",
      value: (metric?.[1] ?? value).replace(/\s+/g, ""),
    });
  }
  if (expert.growth90d) {
    stats.push({
      label: "Growth (90d)",
      value: expert.growth90d,
      accent: "forest",
    });
  }
  return stats;
}

function resolveTrustedBy(
  extras: ProfileExtras,
  enrichmentTrustedBy?: TrustedBrand[],
): TrustedBrand[] {
  const fromAirtable = withResolvedLogos(extras.trustedBy ?? []);
  const fromEnrichment = withResolvedLogos(enrichmentTrustedBy ?? []);
  // Prefer Airtable orgs when present; otherwise enrichment fallback
  const merged =
    brandsWithLogos(fromAirtable).length > 0 ? fromAirtable : fromEnrichment;
  return brandsWithLogos(merged);
}

function toRosterCard(expert: {
  id: string;
  slug: string;
  name: string;
  shortBio: string | null;
  image: string | null;
  categories: string[];
  topics: string[];
  combinedReach: string | null;
  growth90d: string | null;
  audienceWho: string | null;
  audienceWhere: string | null;
  channels: unknown;
}): RosterCardExpert {
  return {
    id: expert.id,
    slug: expert.slug,
    name: expert.name,
    shortBio: expert.shortBio,
    image: expert.image,
    role: expert.categories[0] ?? null,
    topics: expert.topics ?? [],
    combinedReach: expert.combinedReach,
    growth90d: expert.growth90d,
    audienceWho: expert.audienceWho,
    audienceWhere: expert.audienceWhere,
    channels: parseExpertChannels(expert.channels),
    linkedinTopVoice: isLinkedInTopVoice(expert.slug),
  };
}

export default async function ExpertPage({ params }: Props) {
  const { slug } = await params;
  const expert = await prisma.expert.findUnique({ where: { slug } });
  if (!expert) notFound();

  const enrichment = getExpertProfileEnrichment(expert.slug);
  const extras = parseProfileExtras(expert.profileExtras);
  const content = mergeProfileContent(extras, enrichment);
  const primaryCategory = expert.categories[0];
  const trustedBy = resolveTrustedBy(extras, enrichment.trustedBy);

  const similarPool = await prisma.expert.findMany({
    where: { slug: { not: expert.slug } },
    orderBy: { name: "asc" },
    take: 12,
  });

  const similarSorted = [
    ...similarPool.filter((item) =>
      primaryCategory
        ? item.categories.some(
            (category) =>
              category.toLowerCase() === primaryCategory.toLowerCase(),
          )
        : false,
    ),
    ...similarPool.filter(
      (item) =>
        !primaryCategory ||
        !item.categories.some(
          (category) =>
            category.toLowerCase() === primaryCategory.toLowerCase(),
        ),
    ),
  ]
    .filter(
      (item, index, list) =>
        list.findIndex((candidate) => candidate.id === item.id) === index,
    )
    .slice(0, 3)
    .map(toRosterCard);

  const heroStats = buildStats(expert, extras, enrichment.stats);
  const heroProof =
    enrichment.heroProof ??
    ([expert.shortBio, expert.categories[0]].filter(Boolean).join(" · ") ||
      expert.title);

  return (
    <>
      <ExpertProfileStageHero
        slug={expert.slug}
        name={expert.name}
        title={expert.title}
        archetype={expert.categories[0] ?? null}
        based={enrichment.based}
        stageImage={
          enrichment.stageImage ?? extras.bannerImage ?? undefined
        }
        stageImagePosition={enrichment.stageImagePosition}
        portraitImage={expert.image}
        heroProof={heroProof}
        trustedBy={trustedBy}
        stats={heroStats}
      />

      <ExpertProfileShell
        slug={expert.slug}
        name={expert.name}
        title={expert.title}
        image={expert.image}
        archetype={expert.categories[0] ?? null}
        topics={expert.topics ?? []}
        based={enrichment.based}
        languages={enrichment.languages}
        representationStatus={
          enrichment.representationStatus ??
          (extras.exclusive ? "SIGNED" : "AVAILABLE")
        }
        stats={heroStats}
        nav={[
          { href: "#overview", label: "Overview" },
          ...(content.channels?.length
            ? [{ href: "#channels", label: "Channels" }]
            : []),
          ...(content.topicShares?.length && content.audience
            ? [{ href: "#topics", label: "Topics & audience" }]
            : []),
          ...(content.formats?.length
            ? [{ href: "#formats", label: "Formats" }]
            : []),
          ...(enrichment.recentWork?.length
            ? [{ href: "#work", label: "Recent work" }]
            : []),
        ]}
      >
        <ExpertProfileMain
          name={expert.name}
          bio={expert.bio}
          quote={content.quote}
          quoteAttribution={content.quoteAttribution}
          channels={content.channels}
          topicShares={content.topicShares}
          audience={content.audience}
          formats={content.formats}
          recentWork={enrichment.recentWork}
        />
      </ExpertProfileShell>

      <ExpertProfileFooter
        name={expert.name}
        slug={expert.slug}
        similar={similarSorted}
        backgroundImage={
          enrichment.ctaImage ??
          enrichment.stageImage ??
          extras.bannerImage ??
          expert.image
        }
      />
    </>
  );
}
