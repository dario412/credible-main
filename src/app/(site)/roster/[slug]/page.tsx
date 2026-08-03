import { notFound } from "next/navigation";

import {
  ExpertProfileFooter,
  ExpertProfileMain,
} from "@/components/expert-profile-body";
import { ExpertProfileShell } from "@/components/expert-profile-hero";
import { ExpertProfileStageHero } from "@/components/expert-profile-stage-hero";
import type { RosterCardExpert } from "@/components/roster-card";
import { parseExpertChannels } from "@/lib/expert-channels";
import {
  getExpertProfileEnrichment,
  isLinkedInTopVoice,
  type ExpertProfileStat,
} from "@/lib/expert-profiles";
import { prisma } from "@/lib/prisma";
import { createMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

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
  enrichmentStats?: ExpertProfileStat[],
): ExpertProfileStat[] {
  if (enrichmentStats?.length) return enrichmentStats;

  const stats: ExpertProfileStat[] = [];
  if (expert.combinedReach) {
    stats.push({ label: "Combined reach", value: expert.combinedReach });
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
  const primaryCategory = expert.categories[0];

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

  const heroStats = buildStats(expert, enrichment.stats);

  return (
    <>
      <ExpertProfileStageHero
        slug={expert.slug}
        name={expert.name}
        title={expert.title}
        archetype={expert.categories[0] ?? null}
        based={enrichment.based}
        stageImage={enrichment.stageImage}
        stageImagePosition={enrichment.stageImagePosition}
        portraitImage={expert.image}
        heroProof={enrichment.heroProof}
        trustedBy={enrichment.trustedBy}
        stats={heroStats}
      />

      {/* Client review: new-creator hero without Trusted by logos */}
      <div className="bg-cream px-6 py-5 md:px-10 lg:px-12">
        <div className="mx-auto max-w-352">
          <p className="text-[0.65rem] font-medium tracking-[0.14em] text-charcoal/40 uppercase">
            Layout option · New creator (no Trusted by)
          </p>
          <p className="mt-1.5 max-w-xl text-[0.875rem] leading-relaxed text-charcoal/50">
            Same hero — name, proof, brief CTA, and stats — without the logo
            strip, for creators who do not have brand clients yet.
          </p>
        </div>
      </div>
      <ExpertProfileStageHero
        slug={expert.slug}
        name={expert.name}
        title={expert.title}
        archetype={expert.categories[0] ?? null}
        based={enrichment.based}
        stageImage={enrichment.stageImage}
        stageImagePosition={enrichment.stageImagePosition}
        portraitImage={expert.image}
        heroProof={enrichment.heroProof}
        trustedBy={[]}
        stats={heroStats}
        preview
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
        representationStatus={enrichment.representationStatus}
        stats={heroStats}
        nav={[
          { href: "#overview", label: "Overview" },
          ...(enrichment.channels?.length
            ? [{ href: "#channels", label: "Channels" }]
            : []),
          ...(enrichment.topicShares?.length && enrichment.audience
            ? [{ href: "#topics", label: "Topics & audience" }]
            : []),
          ...(enrichment.formats?.length
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
          quote={enrichment.quote}
          quoteAttribution={enrichment.quoteAttribution}
          channels={enrichment.channels}
          topicShares={enrichment.topicShares}
          audience={enrichment.audience}
          formats={enrichment.formats}
          recentWork={enrichment.recentWork}
        />
      </ExpertProfileShell>

      <ExpertProfileFooter
        name={expert.name}
        slug={expert.slug}
        similar={similarSorted}
        backgroundImage={
          enrichment.ctaImage ?? enrichment.stageImage ?? expert.image
        }
      />
    </>
  );
}
