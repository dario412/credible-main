import { notFound } from "next/navigation";

import {
  ExpertProfileFooter,
  ExpertProfileMain,
} from "@/components/expert-profile-body";
import { ExpertProfileShell } from "@/components/expert-profile-hero";
import { ExpertProfileStageHero } from "@/components/expert-profile-stage-hero";
import { ProfileVisualEditor } from "@/components/profile-visual-editor";
import type { RosterCardExpert } from "@/components/roster-card";
import {
  brandsWithLogos,
  withResolvedLogos,
  type TrustedBrand,
} from "@/lib/brand-logos";
import { parseHighlightStat, isCombinedReachLabel } from "@/lib/airtable/map-expert";
import {
  linkedinTopVoiceFromExtras,
  type AirtableProfileSections,
} from "@/lib/airtable/map-profile-sections";
import {
  enrichChannelsWithFollowerHistory,
  type ChannelFollowerHistory,
} from "@/lib/channel-follower-history";
import {
  meetsMinimumChannelFollowers,
  sumChannelFollowers,
} from "@/lib/channel-sparkline";
import { parseExpertChannels } from "@/lib/expert-channels";
import {
  getExpertProfileEnrichment,
  mergeAudience,
  mergeFormats,
  resolveFormatKind,
  type ExpertAudience,
  type ExpertChannelPresence,
  type ExpertFormatOffering,
  type ExpertProfileEnrichment,
  type ExpertProfileStat,
  type ExpertProfileTestimonial,
  type ExpertTopicShare,
} from "@/lib/expert-profiles";
import { prisma } from "@/lib/prisma";
import { createMetadata } from "@/lib/seo";
import { getSiteChrome, saveSiteChrome } from "@/lib/actions/admin-cms";
import { auth } from "@/lib/auth";
import {
  caseStudyToExpertWork,
  loadCaseStudiesForExpert,
} from "@/lib/case-studies-server";
import { hasPermission } from "@/lib/permissions";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

type ProfileExtras = {
  nameFirst?: string | null;
  bannerImage?: string | null;
  highlight1?: string | null;
  highlight2?: string | null;
  highlight3?: string | null;
  highlight4?: string | null;
  websiteSubtitle?: string | null;
  exclusive?: boolean;
  quote?: string | null;
  quoteSource?: string | null;
  brandPartnershipsCopy?: string | null;
  trustedBy?: TrustedBrand[];
  similarProfileIds?: string[];
  profileSections?: AirtableProfileSections;
  channelFollowerHistory?: ChannelFollowerHistory;
  testimonials?: ExpertProfileTestimonial[];
};

function parseProfileExtras(value: unknown): ProfileExtras {
  if (!value || typeof value !== "object") return {};
  return value as ProfileExtras;
}

function applyAirtableFormatDescriptions(
  formats: ExpertFormatOffering[],
  extras: ProfileExtras,
): ExpertFormatOffering[] {
  const byKind = new Map<string, string>();
  for (const item of extras.profileSections?.formats ?? []) {
    const kind = resolveFormatKind(item);
    const text = item.description?.trim();
    if (kind && text) byKind.set(kind, text);
  }
  if (byKind.size === 0) return formats;
  return formats.map((format) => {
    const kind = resolveFormatKind(format);
    const text = kind ? byKind.get(kind) : undefined;
    return text ? { ...format, description: text } : format;
  });
}


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
  const channels = enrichChannelsWithFollowerHistory(
    sections?.channels?.filter((channel) => {
      if (
        channel.platform === "TikTok" ||
        channel.platform === "Podcast" ||
        channel.icon === "tiktok" ||
        channel.icon === "podcast"
      ) {
        return false;
      }
      return meetsMinimumChannelFollowers(channel.followers);
    }) ?? [],
    extras.channelFollowerHistory,
  );
  const topicShares =
    sections?.topicShares?.length
      ? sections.topicShares
      : enrichment.topicShares;
  const audience = mergeAudience(sections?.audience, enrichment.audience);
  const formats = applyAirtableFormatDescriptions(
    mergeFormats(sections?.formats, enrichment.formats),
    extras,
  );
  const quote =
    sections?.quote?.trim() || extras.quote?.trim() || undefined;
  const quoteAttribution = quote
    ? sections?.quoteAttribution?.trim() ||
      extras.quoteSource?.trim() ||
      undefined
    : undefined;

  return {
    quote: quote ?? undefined,
    quoteAttribution: quoteAttribution ?? undefined,
    channels,
    topicShares,
    audience,
    formats,
    linkedinTopVoice: Boolean(sections?.linkedinTopVoice),
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

/** Prefer live channel sum, then synced Expert.combinedReach. */
function resolveCombinedReach(
  expert: { combinedReach: string | null },
  extras: ProfileExtras,
  channels?: ExpertChannelPresence[],
): string | null {
  const fromVisibleChannels = sumChannelFollowers(
    (channels ?? []).filter((channel) =>
      meetsMinimumChannelFollowers(channel.followers),
    ),
  );
  if (fromVisibleChannels) return fromVisibleChannels;

  const fromStoredChannels = sumChannelFollowers(
    (extras.profileSections?.channels ?? []).filter((channel) =>
      meetsMinimumChannelFollowers(channel.followers),
    ),
  );
  if (fromStoredChannels) return fromStoredChannels;

  const synced = expert.combinedReach?.trim();
  return synced || null;
}

function channelFollowersForLabel(
  label: string,
  channels?: ExpertChannelPresence[],
): string | null {
  if (!channels?.length) return null;
  const lower = label.toLowerCase();

  const match = channels.find((channel) => {
    const platform = channel.platform.toLowerCase();
    if (/linkedin/.test(lower)) return platform.includes("linkedin");
    if (/youtube/.test(lower)) return platform.includes("youtube");
    if (/newsletter/.test(lower)) return platform.includes("newsletter");
    if (/instagram/.test(lower)) return platform.includes("instagram");
    if (/tiktok/.test(lower)) return platform.includes("tiktok");
    if (/facebook/.test(lower)) return platform.includes("facebook");
    if (/podcast/.test(lower)) return platform.includes("podcast");
    if (/\btwitter\b|(^|[\s/])x([\s/]|$)/.test(lower)) {
      return platform.includes("x") || platform.includes("twitter");
    }
    return false;
  });

  return match?.followers?.trim() || null;
}

function withSyncedCombinedReach(
  stats: ExpertProfileStat[],
  combinedReach: string | null,
  channels?: ExpertChannelPresence[],
): ExpertProfileStat[] {
  let replaced = false;
  const next = stats.map((stat) => {
    if (isCombinedReachLabel(stat.label)) {
      if (!combinedReach) return stat;
      replaced = true;
      return { ...stat, value: combinedReach };
    }

    const fromChannel = channelFollowersForLabel(stat.label, channels);
    if (fromChannel) return { ...stat, value: fromChannel };
    return stat;
  });

  if (combinedReach && !replaced) {
    next.unshift({
      label: "Combined reach",
      value: combinedReach,
    });
  }

  return next.slice(0, 4);
}

function buildStats(
  expert: {
    combinedReach: string | null;
    growth90d: string | null;
  },
  extras: ProfileExtras,
  enrichmentStats?: ExpertProfileStat[],
  channels?: ExpertChannelPresence[],
): ExpertProfileStat[] {
  const combinedReach = resolveCombinedReach(expert, extras, channels);

  const fromAirtable = [
    extras.highlight1,
    extras.highlight2,
    extras.highlight3,
    extras.highlight4,
  ]
    .map(parseHighlightStat)
    .filter((stat): stat is { value: string; label: string } => Boolean(stat))
    .map((stat) => ({
      value: stat.value,
      label: stat.label,
      accent: /growth/i.test(stat.label) ? ("forest" as const) : undefined,
    }));

  if (fromAirtable.length > 0) {
    return withSyncedCombinedReach(fromAirtable, combinedReach, channels);
  }
  if (enrichmentStats?.length) {
    return withSyncedCombinedReach(enrichmentStats, combinedReach, channels);
  }

  const stats: ExpertProfileStat[] = [];
  if (combinedReach) {
    stats.push({ label: "Combined reach", value: combinedReach });
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
  profileExtras?: unknown;
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
    linkedinTopVoice: linkedinTopVoiceFromExtras(expert.profileExtras),
  };
}

async function loadSimilarCreators(
  expert: { slug: string; categories: string[] },
  extras: ProfileExtras,
): Promise<RosterCardExpert[]> {
  const linkedIds = (extras.similarProfileIds ?? []).filter(
    (id): id is string => typeof id === "string" && id.startsWith("rec"),
  );

  if (linkedIds.length > 0) {
    const linked = await prisma.expert.findMany({
      where: {
        airtableId: { in: linkedIds },
        slug: { not: expert.slug },
      },
    });
    const byAirtableId = new Map(
      linked
        .filter((item) => item.airtableId)
        .map((item) => [item.airtableId as string, item] as const),
    );
    return linkedIds
      .map((id) => byAirtableId.get(id))
      .filter((item): item is NonNullable<typeof item> => Boolean(item))
      .slice(0, 6)
      .map(toRosterCard);
  }

  const primaryCategory = expert.categories[0];
  const similarPool = await prisma.expert.findMany({
    where: { slug: { not: expert.slug } },
    orderBy: { name: "asc" },
    take: 12,
  });

  return [
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
}

export default async function ExpertPage({ params }: Props) {
  const { slug } = await params;
  const expert = await prisma.expert.findUnique({ where: { slug } });
  if (!expert) notFound();

  const [siteChrome, session, linkedCaseStudies] = await Promise.all([
    getSiteChrome(),
    auth(),
    loadCaseStudiesForExpert(expert.slug),
  ]);
  const canEdit = Boolean(
    session?.user && hasPermission(session.user.role, "MANAGE_CONTENT"),
  );
  const enrichment = getExpertProfileEnrichment(expert.slug);
  const extras = parseProfileExtras(expert.profileExtras);
  const content = mergeProfileContent(extras, enrichment);
  const trustedBy = resolveTrustedBy(extras, enrichment.trustedBy);
  const similarSorted = await loadSimilarCreators(expert, extras);
  const recentWork = linkedCaseStudies.map(caseStudyToExpertWork);
  const testimonials = extras.testimonials ?? [];
  const hasFaq = siteChrome.profileFaq.items.some(
    (item) => item.q.trim() && item.a.trim(),
  );

  const heroStats = buildStats(
    expert,
    extras,
    enrichment.stats,
    content.channels,
  );
  const heroProof =
    extras.websiteSubtitle?.trim() ||
    (expert.shortBio && expert.shortBio.trim().length <= 180
      ? expert.shortBio.trim()
      : undefined) ||
    enrichment.heroProof ||
    undefined;

  return (
    <>
      <ExpertProfileStageHero
        slug={expert.slug}
        name={expert.name}
        title={expert.title}
        archetype={expert.categories[0] ?? null}
        based={enrichment.based}
        stageImage={
          extras.bannerImage ?? enrichment.stageImage ?? undefined
        }
        stageImagePosition={
          extras.bannerImage ? undefined : enrichment.stageImagePosition
        }
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
        stats={heroStats}
        navSections={{
          hasChannels: Boolean(content.channels?.length),
          hasTopics: Boolean(
            content.topicShares?.length ||
              content.audience?.seniority.length ||
              content.audience?.industry.length,
          ),
          hasFormats: Boolean(content.formats?.length),
          hasWork: recentWork.length > 0,
          hasTestimonials: testimonials.length > 0,
          hasFaq,
        }}
      >
        <ExpertProfileMain
          name={expert.name}
          slug={expert.slug}
          bio={expert.bio}
          quote={content.quote}
          quoteAttribution={content.quoteAttribution}
          channels={content.channels}
          topicShares={content.topicShares}
          audience={content.audience}
          formats={content.formats}
          recentWork={recentWork}
          testimonials={testimonials}
        />
      </ExpertProfileShell>

      <ExpertProfileFooter
        name={expert.name}
        slug={expert.slug}
        similar={similarSorted}
      />
      {canEdit ? (
        <ProfileVisualEditor
          initialChrome={siteChrome}
          canEdit={canEdit}
          saveAction={saveSiteChrome}
        />
      ) : null}
    </>
  );
}
