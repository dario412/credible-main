import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "@phosphor-icons/react/ssr";

import { InsightArticleCta } from "@/components/insight-article-cta";
import { InsightShare } from "@/components/insight-share";
import { ViewMoreLink } from "@/components/view-more-link";
import {
  insightCover,
  parseInsightBody,
  readingTime,
  type InsightBlock,
} from "@/lib/insight-content";
import { prisma } from "@/lib/prisma";
import { absoluteUrl, createMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const insight = await prisma.insight.findUnique({ where: { slug } });
  if (!insight) return {};
  return createMetadata({
    title: insight.seoTitle ?? insight.title,
    description: insight.seoDescription ?? insight.excerpt,
    path: `/insights/${insight.slug}`,
  });
}

export default async function InsightPage({ params }: Props) {
  const { slug } = await params;
  const insight = await prisma.insight.findUnique({ where: { slug } });
  if (!insight) notFound();

  const cover = insightCover(insight);
  const mins = readingTime(insight.body);
  const { blocks, toc } = parseInsightBody(insight.body);
  const shareUrl = absoluteUrl(`/insights/${insight.slug}`);

  const related = await prisma.insight.findMany({
    where: {
      category: insight.category,
      NOT: { id: insight.id },
    },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });

  return (
    <>
      <section className="bg-[#E4EBE6]">
        <div className="mx-auto max-w-352 px-6 py-8 md:px-10 md:py-10 lg:px-12 lg:py-12">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-10 xl:gap-12">
            <div className="flex min-w-0 flex-col">
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
                <Link
                  href={`/insights?category=${encodeURIComponent(insight.category)}`}
                  className="text-[0.875rem] font-medium text-charcoal transition-colors hover:text-forest"
                >
                  {insight.category}
                </Link>
              </nav>

              <p className="mt-5 text-[0.8125rem] text-charcoal/55 md:mt-6">
                <time dateTime={insight.publishedAt.toISOString()}>
                  {insight.publishedAt.toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </time>
                <span className="mx-2 text-charcoal/30" aria-hidden>
                  ·
                </span>
                <span>{mins} min read</span>
              </p>

              <h1 className="mt-3 max-w-xl font-display text-[1.85rem] leading-[1.1] tracking-tight text-charcoal sm:text-[2.15rem] md:text-[2.4rem] lg:text-[2.6rem]">
                {insight.title}
              </h1>

              <div className="mt-6 flex items-center gap-3 md:mt-7">
                <span
                  aria-hidden
                  className="flex size-9 shrink-0 items-center justify-center rounded-full bg-cream font-display text-sm text-forest"
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

            <div className="relative mx-auto aspect-16/10 w-full max-w-lg overflow-hidden rounded-sm bg-forest/10 sm:max-w-xl lg:mx-0 lg:max-w-none lg:w-[95%] lg:justify-self-end">
              {cover ? (
                <Image
                  src={cover}
                  alt=""
                  fill
                  priority
                  sizes="(min-width: 1024px) 36vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <span
                  aria-hidden
                  className="absolute inset-0 flex items-center justify-center font-display text-7xl text-charcoal/15"
                >
                  {insight.title.charAt(0)}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-352 px-6 py-10 md:px-10 md:py-12 lg:px-12 lg:py-14">
        <InsightShare
          url={shareUrl}
          title={insight.title}
          className="mb-8 lg:hidden"
        />

        {toc.length > 0 ? (
          <nav
            aria-label="In this article"
            className="mb-8 rounded-sm border border-charcoal/8 bg-[#FBF8F5] px-5 py-5 md:mb-10 md:px-6 lg:hidden"
          >
            <p className="font-display text-[1.05rem] font-medium leading-snug tracking-tight text-charcoal">
              In this article
            </p>
            <ol className="mt-3 space-y-2">
              {toc.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="text-[0.875rem] text-charcoal/60 transition-colors hover:text-forest"
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        <div className="grid gap-8 lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-stretch lg:gap-12 xl:grid-cols-[19rem_minmax(0,1fr)] xl:gap-14">
          <aside className="hidden lg:block">
            <InsightShare url={shareUrl} title={insight.title} />

            <div className="sticky top-28 mt-8">
              {toc.length > 0 ? (
                <nav
                  aria-label="On this page"
                  className="border-t border-charcoal/10 pt-7"
                >
                  <p className="font-display text-[1.05rem] font-medium leading-snug tracking-tight text-charcoal">
                    In this article
                  </p>
                  <ol className="mt-3 space-y-2.5">
                    {toc.map((item) => (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          className="block text-[0.8125rem] leading-snug text-charcoal/60 transition-colors hover:text-forest"
                        >
                          {item.text}
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              ) : null}

              <div className={toc.length > 0 ? "mt-8" : undefined}>
                <InsightArticleCta />
              </div>
            </div>
          </aside>

          <div className="min-w-0 w-full">
            <p className="mb-7 w-full text-[0.98rem] leading-relaxed text-charcoal/65 md:mb-8 md:text-[1.02rem]">
              {insight.excerpt}
            </p>

            <div className="prose-credible w-full ![max-width:none]">
              {blocks.map((block, index) => (
                <InsightBlockView
                  key={`${block.type}-${index}`}
                  block={block}
                />
              ))}
            </div>

            <div className="mt-12 border-t border-charcoal/10 pt-8 md:mt-14 md:pt-10">
              <div className="flex items-start gap-4">
                <span
                  aria-hidden
                  className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#E4EBE6] font-display text-base text-forest"
                >
                  C
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-charcoal">Credible team</p>
                  <p className="mt-1 text-[0.8125rem] text-charcoal/50">
                    Editorial
                  </p>
                  <p className="mt-3 text-[0.875rem] leading-relaxed text-charcoal/65">
                    Credible Creators is a B2B talent agency connecting brands
                    with expert operators — the voices buyers already trust. We
                    publish field notes on briefing, formats, and the expert
                    economy.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 lg:hidden">
              <InsightArticleCta />
            </div>
          </div>
        </div>

        {related.length > 0 ? (
          <section className="mt-20 border-t border-charcoal/10 pt-14 md:mt-24 md:pt-16">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-display text-[1.75rem] leading-[1.12] tracking-tight text-charcoal sm:text-[2rem]">
                More in {insight.category}
              </h2>
              <ViewMoreLink
                href={`/insights?category=${encodeURIComponent(insight.category)}`}
              />
            </div>

            <ul className="mt-8 grid gap-8 sm:grid-cols-2 md:mt-10 lg:grid-cols-3 lg:gap-10">
              {related.map((item) => {
                const itemCover = insightCover(item);
                const itemMins = readingTime(item.body);

                return (
                  <li key={item.id}>
                    <Link
                      href={`/insights/${item.slug}`}
                      className="group block cursor-pointer"
                    >
                      <div className="relative aspect-16/10 overflow-hidden rounded-sm bg-[#E4EBE6]">
                        {itemCover ? (
                          <Image
                            src={itemCover}
                            alt=""
                            fill
                            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                          />
                        ) : null}
                      </div>
                      <p className="mt-4 text-xs text-charcoal/55">
                        {itemMins} min read
                      </p>
                      <h3 className="mt-2 max-w-sm font-display text-[1.15rem] leading-snug tracking-tight text-charcoal transition-colors group-hover:text-forest md:text-[1.25rem]">
                        {item.title}
                      </h3>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ) : null}
      </div>
    </>
  );
}

function InsightBlockView({ block }: { block: InsightBlock }) {
  switch (block.type) {
    case "h2":
      return (
        <h2
          id={block.id}
          className="scroll-mt-28 font-display text-[1.45rem] leading-[1.15] tracking-tight text-charcoal md:text-[1.6rem]"
        >
          {block.text}
        </h2>
      );
    case "h3":
      return (
        <h3
          id={block.id}
          className="scroll-mt-28 font-display text-[1.15rem] leading-snug tracking-tight text-charcoal md:text-[1.25rem]"
        >
          {block.text}
        </h3>
      );
    case "quote":
      return (
        <blockquote className="my-7 border-l-[3px] border-forest py-1 pl-5 md:pl-6">
          <p className="font-display text-[1.05rem] leading-snug text-forest-dark md:text-[1.15rem]">
            “{block.text}”
          </p>
          {block.attribution ? (
            <cite className="mt-3 block text-[0.8125rem] not-italic text-charcoal/55">
              — {block.attribution}
            </cite>
          ) : null}
        </blockquote>
      );
    case "ul":
      return (
        <ul className="my-4 list-disc space-y-2 pl-5 text-[0.95rem] leading-[1.65] text-charcoal">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    default:
      return (
        <p className="mb-[1em] text-[0.95rem] leading-[1.65] text-charcoal md:text-[0.98rem]">
          {block.text}
        </p>
      );
  }
}
