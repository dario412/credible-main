import Image from "next/image";
import Link from "next/link";

import { prisma } from "@/lib/prisma";

const COVER_BY_SLUG: Record<string, string> = {
  "why-creator-label-doesnt-fit-b2b": "/images/insights/operator-creator.jpg",
  "rise-of-the-creator-marketing-manager":
    "/images/insights/expert-economy.jpg",
  "four-tier-revenue-pyramid": "/images/insights/beyond-keynote.jpg",
  "superstar-revenue-mix-2025": "/images/insights/operator-creator.jpg",
  "conversation-with-alex-lieberman": "/images/insights/expert-economy.jpg",
  "pr-agencies-best-buyers": "/images/insights/beyond-keynote.jpg",
  "how-to-brief-a-b2b-creator": "/images/insights/operator-creator.jpg",
};

function readingTime(body: string) {
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export async function LatestInsights() {
  const insights = await prisma.insight.findMany({
    orderBy: { publishedAt: "desc" },
    take: 3,
  });

  if (insights.length === 0) return null;

  return (
    <section className="bg-cream px-6 py-16 md:px-10 md:py-20 lg:px-12">
      <div className="mx-auto max-w-352">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-display text-[2rem] leading-[1.12] tracking-tight text-charcoal sm:text-[2.4rem] md:text-[2.75rem]">
            Latest insights
          </h2>
          <Link
            href="/insights"
            className="inline-flex items-center justify-center rounded-sm border border-charcoal/25 px-5 py-2.5 text-[0.8125rem] font-medium text-charcoal transition-colors hover:border-forest hover:bg-forest hover:text-cream"
          >
            All insights
            <span aria-hidden className="ml-2">
              →
            </span>
          </Link>
        </div>

        <ul className="mt-10 grid gap-8 sm:grid-cols-2 md:mt-12 lg:grid-cols-3 lg:gap-10">
          {insights.map((insight) => {
            const cover =
              insight.coverImage ?? COVER_BY_SLUG[insight.slug] ?? null;

            return (
              <li key={insight.id}>
                <Link href={`/insights/${insight.slug}`} className="group block">
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
                        className="absolute inset-0 flex items-center justify-center font-display text-7xl italic leading-none text-charcoal/20 transition-transform duration-500 ease-out group-hover:scale-105"
                      >
                        {insight.title.charAt(0)}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-x-2.5 text-xs text-charcoal/65">
                    <span>{insight.category}</span>
                    <span className="text-charcoal/35" aria-hidden>
                      |
                    </span>
                    <time dateTime={insight.publishedAt.toISOString()}>
                      {insight.publishedAt.toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </time>
                    <span className="text-charcoal/35" aria-hidden>
                      |
                    </span>
                    <span>{readingTime(insight.body)} min read</span>
                  </div>

                  <h3 className="mt-3 max-w-sm font-display text-[1.2rem] leading-snug tracking-tight text-charcoal transition-colors group-hover:text-forest md:text-[1.3rem]">
                    {insight.title}
                  </h3>

                  <p className="mt-2 max-w-sm text-[0.8125rem] leading-relaxed text-charcoal/60 md:text-[0.875rem]">
                    {insight.excerpt}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
