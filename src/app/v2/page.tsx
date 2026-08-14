import { V2Footer } from "@/components/v2/v2-footer";
import { V2Hero, type V2CastMember, type V2ProofStory } from "@/components/v2/v2-hero";
import { V2Impact } from "@/components/v2/v2-impact";
import { V2Insights } from "@/components/v2/v2-insights";
import { V2Nav } from "@/components/v2/v2-nav";
import { V2Proof } from "@/components/v2/v2-proof";
import { V2Roster } from "@/components/v2/v2-roster";
import { V2TrustedBy } from "@/components/v2/v2-trusted-by";
import { V2WaysIn } from "@/components/v2/v2-ways-in";
import { getHomePageSections, getSiteChrome } from "@/lib/actions/admin-cms";
import { loadFeaturedCaseStudy } from "@/lib/case-studies-server";
import { insightCover, readingTime } from "@/lib/insight-content";
import { isLinkedInTopVoice } from "@/lib/expert-profiles";
import { parseExpertChannels } from "@/lib/expert-channels";
import { prisma } from "@/lib/prisma";
import { createMetadata } from "@/lib/seo";
import { hasTrustedByStory } from "@/lib/trusted-by";
import { loadTrustedClients } from "@/lib/trusted-by-server";
import type { RosterCardExpert } from "@/components/roster-card";

export const dynamic = "force-dynamic";

export const metadata = createMetadata({
  title: "Homepage v2",
  path: "/v2",
  noIndex: true,
  description:
    "Book B2B creators for your brand. Credible represents the founders, operators, investors and specialists whose voices your buyers already trust.",
});

export default async function HomeV2Page() {
  const [home, chrome, trustedClients, featured, insights, experts, expertCount] =
    await Promise.all([
      getHomePageSections(),
      getSiteChrome(),
      loadTrustedClients(),
      loadFeaturedCaseStudy(),
      prisma.insight.findMany({
        orderBy: { publishedAt: "desc" },
        take: 3,
      }),
      prisma.expert.findMany({
        orderBy: { name: "asc" },
      }),
      prisma.expert.count(),
    ]);

  const withImages = experts.filter((expert) => Boolean(expert.image?.trim()));
  const castPool = withImages.length >= 6 ? withImages : experts;
  const step = Math.max(1, Math.floor(castPool.length / 6));
  const picked: typeof castPool = [];
  for (let i = 0; picked.length < 6 && i < castPool.length; i += step) {
    picked.push(castPool[i]!);
  }
  for (const expert of castPool) {
    if (picked.length >= 6) break;
    if (!picked.some((item) => item.id === expert.id)) picked.push(expert);
  }

  const cast: V2CastMember[] = picked.slice(0, 6).map((expert) => ({
    id: expert.id,
    slug: expert.slug,
    name: expert.name,
    image: expert.image,
    role: expert.categories[0] ?? null,
    combinedReach: expert.combinedReach,
  }));

  const rosterCards: RosterCardExpert[] = experts.slice(0, 3).map((expert) => ({
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
  }));

  const storyClient = trustedClients.find((client) => hasTrustedByStory(client));
  const proof: V2ProofStory | null = storyClient?.testimonial
    ? {
        quote: storyClient.testimonial.quote,
        name: storyClient.testimonial.name,
        title: storyClient.testimonial.title,
        imageSrc: storyClient.testimonial.imageSrc,
        metric: home.keyStudy.metrics[0]
          ? {
              value: home.keyStudy.metrics[0].value,
              label: home.keyStudy.metrics[0].note || "pipeline lift",
            }
          : undefined,
      }
    : home.brandBrief.quote.trim()
      ? {
          quote: home.brandBrief.quote,
          name: home.brandBrief.quoteName,
          title: home.brandBrief.quoteRole,
          imageSrc: home.brandBrief.quotePhoto,
          metric: home.keyStudy.metrics[0]
            ? {
                value: home.keyStudy.metrics[0].value,
                label: home.keyStudy.metrics[0].note || "pipeline lift",
              }
            : undefined,
        }
      : null;

  const insightCards = insights.map((insight) => ({
    id: insight.id,
    slug: insight.slug,
    title: insight.title,
    excerpt: insight.excerpt,
    cover: insightCover(insight),
    mins: readingTime(insight.body),
    category: insight.category,
  }));

  return (
    <>
      <V2Nav
        links={chrome.header.links}
        ctaLabel={chrome.header.ctaLabel || "Send a brief"}
        creatorCount={expertCount || 20}
      />
      <main className="flex-1">
        <V2Hero
          hero={home.hero}
          cast={cast}
          bookerImage={cast[0]?.image ?? null}
          proof={proof}
          creatorCount={expertCount || 20}
        />
        <V2TrustedBy clients={trustedClients} />
        <V2WaysIn content={home.waysIn} />
        <V2Roster content={home.roster} cards={rosterCards} />
        <V2Impact content={home.impact} />
        <V2Proof
          keyStudy={home.keyStudy}
          featured={featured}
          brandBrief={home.brandBrief}
          creatorCta={home.creatorCta}
        />
        <V2Insights insights={insightCards} />
      </main>
      <V2Footer footer={chrome.footer} />
    </>
  );
}
