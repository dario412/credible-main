import { ViewMoreLink } from "@/components/view-more-link";
import { LatestInsightsGrid } from "@/components/latest-insights-grid";
import { insightCover, insightCoverAlt, readingTime } from "@/lib/insight-content";
import { prisma } from "@/lib/prisma";

export async function LatestInsights() {
  const insights = await prisma.insight.findMany({
    orderBy: { publishedAt: "desc" },
    take: 3,
  });

  if (insights.length === 0) return null;

  const cards = insights.map((insight) => ({
    id: insight.id,
    slug: insight.slug,
    title: insight.title,
    excerpt: insight.excerpt,
    cover: insightCover(insight),
    coverAlt: insightCoverAlt(insight),
    mins: readingTime(insight.body),
  }));

  return (
    <section className="bg-cream px-6 py-16 md:px-10 md:py-20 lg:px-12">
      <div className="mx-auto max-w-352">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-display text-[2rem] leading-[1.12] tracking-tight text-charcoal sm:text-[2.4rem] md:text-[2.75rem]">
            Latest insights
          </h2>
          <ViewMoreLink href="/insights">All insights</ViewMoreLink>
        </div>

        <LatestInsightsGrid insights={cards} />
      </div>
    </section>
  );
}
