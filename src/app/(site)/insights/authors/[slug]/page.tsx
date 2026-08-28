import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "@phosphor-icons/react/ssr";

import { FadeUp } from "@/components/fade-up";
import { INSIGHT_AUTHORS } from "@/lib/insight-authors";
import { insightCover, insightCoverAlt, readingTime } from "@/lib/insight-content";
import { portraitAltFor } from "@/lib/image-alt";
import { prisma } from "@/lib/prisma";
import { createMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const author = INSIGHT_AUTHORS[slug];
  if (!author) return {};
  return createMetadata({
    title: author.name,
    description: author.shortBio,
    path: `/insights/authors/${author.slug}`,
  });
}

export default async function InsightAuthorPage({ params }: Props) {
  const { slug } = await params;
  const author = INSIGHT_AUTHORS[slug];
  if (!author) notFound();

  const articles = await prisma.insight.findMany({
    orderBy: { publishedAt: "desc" },
  });

  return (
    <>
      <section className="bg-cream-dark">
        <div className="mx-auto max-w-352 px-6 py-10 md:px-10 md:py-12 lg:px-12 lg:py-14">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2"
          >
            <Link
              href="/insights"
              className="text-[0.875rem] font-medium text-charcoal/70 transition-colors hover:text-charcoal"
            >
              Insights
            </Link>
            <ArrowRight
              weight="bold"
              className="size-3.5 shrink-0 text-charcoal/45"
              aria-hidden
            />
            <span className="text-[0.875rem] font-medium text-charcoal">
              Authors
            </span>
          </nav>

          <div className="mt-8 grid items-end gap-8 lg:mt-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-12">
            <div className="relative aspect-4/5 max-w-sm overflow-hidden rounded-sm bg-forest sm:max-w-md lg:max-w-none">
              {author.image ? (
                <Image
                  src={author.image}
                  alt={portraitAltFor(author.name, author.role)}
                  fill
                  priority
                  sizes="(min-width: 1024px) 28vw, 60vw"
                  className="object-cover"
                />
              ) : (
                <span
                  aria-hidden
                  className="absolute inset-0 flex items-center justify-center font-display text-[7rem] leading-none text-cream/90 sm:text-[8.5rem]"
                >
                  C
                </span>
              )}
            </div>

            <div className="pb-1">
              <p className="text-[0.65rem] font-medium tracking-[0.16em] text-charcoal/45 uppercase">
                {author.role}
              </p>
              <h1 className="mt-3 font-display text-[2.4rem] leading-none tracking-tight text-charcoal sm:text-[3rem] md:text-[3.4rem]">
                {author.name}
              </h1>
              <p className="mt-5 max-w-xl text-[1rem] leading-relaxed text-charcoal/65 md:text-[1.05rem]">
                {author.bio}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-352 px-6 py-14 md:px-10 md:py-16 lg:px-12 lg:py-20">
        <h2 className="font-display text-[1.75rem] leading-[1.12] tracking-tight text-charcoal sm:text-[2rem]">
          Articles by {author.name}
        </h2>
        <p className="mt-2 text-[0.9rem] text-charcoal/55">
          {articles.length} {articles.length === 1 ? "piece" : "pieces"}
        </p>

        <ul className="mt-10 grid gap-8 sm:grid-cols-2 md:mt-12 lg:grid-cols-3 lg:gap-10">
          {articles.map((item, index) => {
            const cover = insightCover(item);
            const mins = readingTime(item.body);

            return (
              <li key={item.id}>
                <FadeUp
                  delay={index * 120}
                  duration={1300}
                  y={24}
                  threshold={0.08}
                >
                  <Link
                    href={`/insights/${item.slug}`}
                    className="group block cursor-pointer"
                  >
                    <div className="relative aspect-16/10 overflow-hidden rounded-sm bg-cream-dark">
                      {cover ? (
                        <Image
                          src={cover}
                          alt={insightCoverAlt(item)}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                        />
                      ) : null}
                    </div>
                    <p className="mt-4 text-xs text-charcoal/55">
                      {item.category} · {mins} min read
                    </p>
                    <h3 className="mt-2 max-w-sm font-display text-[1.15rem] leading-snug tracking-tight text-charcoal transition-colors group-hover:text-forest md:text-[1.25rem]">
                      {item.title}
                    </h3>
                  </Link>
                </FadeUp>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
