import Image from "next/image";
import Link from "next/link";

import { prisma } from "@/lib/prisma";

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
            className="inline-flex items-center justify-center border border-charcoal/25 px-5 py-2.5 text-[0.8125rem] font-medium text-charcoal transition-colors hover:border-forest hover:bg-forest hover:text-cream"
          >
            All insights
            <span aria-hidden className="ml-2">
              →
            </span>
          </Link>
        </div>

        <ul className="mt-10 grid gap-8 sm:grid-cols-2 md:mt-12 lg:grid-cols-3">
          {insights.map((insight) => (
            <li key={insight.id}>
              <Link href={`/insights/${insight.slug}`} className="group block">
                <div className="relative flex aspect-16/10 items-center justify-center overflow-hidden rounded-sm bg-charcoal">
                  {insight.coverImage ? (
                    <Image
                      src={insight.coverImage}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    />
                  ) : (
                    <span
                      aria-hidden
                      className="font-display text-7xl italic leading-none text-[#E4EBE6]/85 transition-transform duration-500 ease-out group-hover:scale-105"
                    >
                      {insight.title.charAt(0)}
                    </span>
                  )}
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <span className="inline-flex items-center rounded-sm border border-charcoal/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-charcoal/70">
                    {insight.category}
                  </span>
                  <span className="text-xs text-charcoal/55">
                    {readingTime(insight.body)} min read
                  </span>
                </div>

                <p className="mt-3 max-w-sm text-[0.95rem] font-medium leading-snug text-charcoal transition-colors group-hover:text-forest">
                  {insight.title}
                </p>

                <p className="mt-2 max-w-sm text-[0.8125rem] leading-relaxed text-charcoal/60">
                  {insight.excerpt}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
