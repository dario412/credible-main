import Image from "next/image";
import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { createMetadata } from "@/lib/seo";
import { INSIGHT_TOPICS } from "@/lib/insight-topics";
import { InsightsToolbar } from "@/components/insights-filters";
import { ViewMoreLink } from "@/components/view-more-link";
import { InsightsPromo } from "@/components/insights-promo";

export const dynamic = "force-dynamic";

export const metadata = createMetadata({
  title: "Insights",
  description:
    "Field notes on B2B creators, their audiences, and the buyers who need them.",
  path: "/insights",
});

type SearchParams = Promise<{ category?: string; q?: string }>;

const FEATURED_SLUG = "why-creator-label-doesnt-fit-b2b";

const COVER_BY_SLUG: Record<string, string> = {
  "why-creator-label-doesnt-fit-b2b": "/images/insights/operator-creator.jpg",
  "rise-of-the-creator-marketing-manager":
    "/images/insights/expert-economy.jpg",
  "four-tier-revenue-pyramid": "/images/insights/beyond-keynote.jpg",
  "superstar-revenue-mix-2025": "/images/insights/operator-creator.jpg",
  "conversation-with-alex-lieberman": "/images/insights/expert-economy.jpg",
  "pr-agencies-best-buyers": "/images/insights/beyond-keynote.jpg",
  "how-to-brief-a-b2b-creator": "/images/insights/operator-creator.jpg",
  "when-to-use-expert-creators-vs-executives":
    "/images/insights/expert-economy.jpg",
  "category-narrative-before-the-campaign":
    "/images/insights/beyond-keynote.jpg",
  "what-b2b-buyers-actually-trust": "/images/insights/operator-creator.jpg",
  "inside-the-creator-briefing-room": "/images/insights/beyond-keynote.jpg",
  "pricing-ambassador-retainers": "/images/insights/expert-economy.jpg",
  "conversation-with-lenny-rachitsky": "/images/insights/operator-creator.jpg",
  "conversation-with-emily-kramer": "/images/insights/beyond-keynote.jpg",
  "format-roi-benchmarks-2025": "/images/insights/expert-economy.jpg",
  "audience-overlap-across-expert-tiers":
    "/images/insights/beyond-keynote.jpg",
};

type InsightCardData = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  coverImage: string | null;
};

function coverFor(insight: { slug: string; coverImage: string | null }) {
  return insight.coverImage ?? COVER_BY_SLUG[insight.slug] ?? null;
}

function readingTime(body: string) {
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

function matchesQuery(insight: InsightCardData, q: string) {
  const hay =
    `${insight.title} ${insight.excerpt} ${insight.body}`.toLowerCase();
  return hay.includes(q.toLowerCase());
}

export default async function InsightsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const category = params.category?.trim();
  const q = params.q?.trim();
  const isFiltered = Boolean(category || q);

  const all = await prisma.insight.findMany({
    orderBy: { publishedAt: "desc" },
  });

  const featured =
    !isFiltered
      ? (all.find((insight) => insight.slug === FEATURED_SLUG) ??
        all[0] ??
        null)
      : null;

  const pool = all.filter((insight) => {
    if (featured && insight.id === featured.id) return false;
    if (
      category &&
      insight.category.toLowerCase() !== category.toLowerCase()
    ) {
      return false;
    }
    if (q && !matchesQuery(insight, q)) return false;
    return true;
  });

  const sections = isFiltered
    ? null
    : INSIGHT_TOPICS.map((topic) => {
        const insights = pool.filter((insight) => insight.category === topic);
        return {
          category: topic,
          preview: insights.slice(0, 3),
          total: insights.length,
        };
      }).filter((section) => section.preview.length > 0);

  const featuredMins = featured ? readingTime(featured.body) : 0;

  return (
    <div className="mx-auto max-w-352 px-6 py-16 md:px-10 md:py-20 lg:px-12">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h1 className="font-display text-[2.6rem] leading-none tracking-tight text-charcoal sm:text-[3.25rem] md:text-[3.75rem]">
          Insights.
        </h1>
        <InsightsToolbar currentCategory={category} currentQuery={q} />
      </div>

      {featured ? (
        <Link
          href={`/insights/${featured.slug}`}
          className="group mt-10 block overflow-hidden rounded-sm bg-[#FBF8F5] shadow-[0_10px_28px_rgba(28,26,23,0.05)] transition-shadow duration-300 hover:shadow-[0_16px_36px_rgba(28,26,23,0.08)] md:mt-12"
        >
          <article className="grid min-h-80 lg:min-h-112 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
            <div className="flex flex-col justify-between gap-10 px-6 py-10 md:px-8 md:py-12 lg:px-10 lg:py-14">
              <div>
                <p className="text-[11px] font-medium tracking-[0.16em] text-charcoal/45 uppercase">
                  {featured.category} · {featuredMins} min read
                </p>
                <h2 className="mt-4 max-w-xl font-display text-[1.65rem] leading-[1.12] tracking-tight text-charcoal transition-colors group-hover:text-forest sm:text-[1.9rem] md:text-[2.15rem]">
                  {featured.title}
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#E4EBE6] font-display text-sm text-forest"
                >
                  C
                </span>
                <div>
                  <p className="text-sm font-medium text-charcoal">
                    Credible team
                  </p>
                  <p className="text-xs text-charcoal/50">Editorial</p>
                </div>
              </div>
            </div>

            <div className="relative min-h-64 overflow-hidden bg-[#E4EBE6] lg:min-h-full">
              {coverFor(featured) ? (
                <Image
                  src={coverFor(featured)!}
                  alt=""
                  fill
                  priority
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                />
              ) : (
                <span
                  aria-hidden
                  className="absolute inset-0 flex items-center justify-center font-display text-7xl text-charcoal/15"
                >
                  01
                </span>
              )}
              <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-[#FBF8F5]/40 to-transparent lg:hidden" />
            </div>
          </article>
        </Link>
      ) : null}

      <InsightsPromo />

      <div className="mt-14 md:mt-20">
        {sections ? (
          <div className="space-y-16 md:space-y-20">
            {sections.map((section) => (
              <section key={section.category} aria-labelledby={`topic-${section.category}`}>
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <h2
                    id={`topic-${section.category}`}
                    className="font-display text-[1.75rem] leading-[1.12] tracking-tight text-charcoal sm:text-[2rem] md:text-[2.25rem]"
                  >
                    {section.category}
                  </h2>
                  <ViewMoreLink
                    href={`/insights?category=${encodeURIComponent(section.category)}`}
                  />
                </div>

                <ul className="mt-8 grid gap-8 sm:grid-cols-2 md:mt-10 lg:grid-cols-3 lg:gap-10">
                  {section.preview.map((insight) => (
                    <li key={insight.id}>
                      <InsightCard
                        insight={insight}
                        showCategory={false}
                      />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        ) : pool.length > 0 ? (
          <>
            {category ? (
              <div className="mb-8 flex flex-wrap items-end justify-between gap-4 md:mb-10">
                <h2 className="font-display text-[1.75rem] leading-[1.12] tracking-tight text-charcoal sm:text-[2rem] md:text-[2.25rem]">
                  {category}
                </h2>
                <ViewMoreLink href="/insights">All topics</ViewMoreLink>
              </div>
            ) : null}
            <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
              {pool.map((insight) => (
                <li key={insight.id}>
                  <InsightCard insight={insight} showCategory={!category} />
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-sm text-charcoal/50">
            No insights match these filters.
          </p>
        )}
      </div>
    </div>
  );
}

function InsightCard({
  insight,
  showCategory,
}: {
  insight: InsightCardData;
  showCategory: boolean;
}) {
  const cover = coverFor(insight);
  const mins = readingTime(insight.body);

  return (
    <Link href={`/insights/${insight.slug}`} className="group block cursor-pointer">
      <div className="relative aspect-16/10 overflow-hidden rounded-sm bg-[#E4EBE6]">
        {cover ? (
          <Image
            src={cover}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <span
            aria-hidden
            className="absolute inset-0 flex items-center justify-center font-display text-5xl leading-none text-charcoal/20"
          >
            {insight.title.charAt(0)}
          </span>
        )}
      </div>

      <p className="mt-4 text-xs text-charcoal/55">
        {showCategory ? `${insight.category} · ${mins} min` : `${mins} min read`}
      </p>

      <h3 className="mt-2 max-w-sm font-display text-[1.2rem] leading-snug tracking-tight text-charcoal transition-colors group-hover:text-forest md:text-[1.3rem]">
        {insight.title}
      </h3>

      <p className="mt-2 max-w-sm text-[0.8125rem] leading-relaxed text-charcoal/60 md:text-[0.875rem]">
        {insight.excerpt}
      </p>
    </Link>
  );
}
