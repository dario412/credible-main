import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "@phosphor-icons/react/ssr";

import { ArticleSidebarCtaEditorProvider } from "@/components/article-sidebar-cta-editor";
import { InsightArticleCta } from "@/components/insight-article-cta";
import { InsightHeroCoverEditable } from "@/components/insight-hero-cover-editable";
import { InsightShare } from "@/components/insight-share";
import { RelatedInsightsGrid } from "@/components/related-insights-grid";
import { SiteImage } from "@/components/site-image";
import { ViewMoreLink } from "@/components/view-more-link";
import {
  DEFAULT_INSIGHT_AUTHOR_SLUG,
  getInsightAuthor,
} from "@/lib/insight-authors";
import {
  insightCover,
  readingTimeFromBlocks,
  resolveInsightContent,
  type InsightBlock,
} from "@/lib/insight-content";
import { saveInsight, saveSiteChrome } from "@/lib/actions/admin-cms";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";
import { absoluteUrl, createMetadata } from "@/lib/seo";
import { resolveImageAlt } from "@/lib/image-alt";

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
  const { blocks, toc } = resolveInsightContent(insight);
  const mins = readingTimeFromBlocks(blocks);
  const shareUrl = absoluteUrl(`/insights/${insight.slug}`);
  const author = getInsightAuthor(DEFAULT_INSIGHT_AUTHOR_SLUG);

  const [related, session] = await Promise.all([
    prisma.insight.findMany({
      where: {
        category: insight.category,
        NOT: { id: insight.id },
      },
      orderBy: { publishedAt: "desc" },
      take: 3,
    }),
    auth(),
  ]);
  const canEdit = Boolean(
    session?.user && hasPermission(session.user.role, "MANAGE_CONTENT"),
  );
  const publishedLocal = new Date(
    insight.publishedAt.getTime() -
      insight.publishedAt.getTimezoneOffset() * 60000,
  )
    .toISOString()
    .slice(0, 16);

  return (
    <>
      <section className="overflow-hidden bg-cream-dark px-6 py-10 md:px-10 md:py-12 lg:px-12 lg:py-14">
        <div className="mx-auto grid max-w-352 items-stretch lg:grid-cols-2">
          <div className="flex min-w-0 flex-col justify-center pb-10 md:pb-12 lg:pb-0 lg:pr-12">
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

            {insight.excerpt ? (
              <p className="mt-4 max-w-xl text-[0.98rem] leading-relaxed text-charcoal/65 md:mt-5 md:text-[1.02rem]">
                {insight.excerpt}
              </p>
            ) : null}

            <Link
              href={`/insights/authors/${author.slug}`}
              className="mt-6 flex w-fit items-center gap-3 md:mt-7"
            >
              <span
                aria-hidden
                className="flex size-9 shrink-0 items-center justify-center rounded-sm bg-[#FBF8F5] font-display text-sm text-forest"
              >
                C
              </span>
              <div>
                <p className="text-sm font-medium text-charcoal">
                  {author.name}
                </p>
                <p className="text-xs text-charcoal/50">{author.role}</p>
              </div>
            </Link>
          </div>

          <div className="lg:flex lg:items-center">
            <InsightHeroCoverEditable
              insightId={insight.id}
              insightSlug={insight.slug}
              title={insight.title}
              cover={cover}
              initialMeta={{
                title: insight.title,
                slug: insight.slug,
                excerpt: insight.excerpt,
                category: insight.category,
                coverImage: insight.coverImage ?? "",
                coverImageAlt: insight.coverImageAlt ?? "",
                seoTitle: insight.seoTitle ?? "",
                seoDescription: insight.seoDescription ?? "",
                publishedAt: publishedLocal,
              }}
              initialBlocks={blocks}
              canEdit={canEdit}
              saveAction={saveInsight}
            />
          </div>
        </div>
      </section>

      <ArticleSidebarCtaEditorProvider
        canEdit={canEdit}
        saveAction={saveSiteChrome}
      >
      <div className="px-6 py-10 md:px-10 md:py-12 lg:px-12 lg:py-14">
        <div className="mx-auto max-w-352">
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
              <div className="prose-credible w-full ![max-width:none]">
                {blocks.map((block, index) => (
                  <InsightBlockView
                    key={`${block.type}-${index}`}
                    block={block}
                  />
                ))}
              </div>

              <div className="mt-12 rounded-sm bg-[#FBF8F5] px-5 py-6 md:mt-14 md:px-7 md:py-7">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-5">
                  <span
                    aria-hidden
                    className="flex size-14 shrink-0 items-center justify-center rounded-sm bg-cream-dark font-display text-xl text-forest sm:size-16 sm:text-2xl"
                  >
                    C
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.65rem] font-medium tracking-[0.16em] text-charcoal/45 uppercase">
                      {author.role}
                    </p>
                    <p className="mt-1.5 font-display text-[1.2rem] leading-snug tracking-tight text-charcoal md:text-[1.3rem]">
                      {author.name}
                    </p>
                    <p className="mt-3 text-[0.875rem] leading-relaxed text-charcoal/65">
                      {author.shortBio}
                    </p>
                    <Link
                      href={`/insights/authors/${author.slug}`}
                      className="group mt-5 inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-forest transition-colors hover:text-forest-dark"
                    >
                      Read more about the author
                      <ArrowRight
                        weight="bold"
                        className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                        aria-hidden
                      />
                    </Link>
                  </div>
                </div>
              </div>

              <div className="mt-10 lg:hidden">
                <InsightArticleCta />
              </div>
            </div>
          </div>

          {related.length > 0 ? (
            <section className="mt-20 md:mt-24">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <h2 className="font-display text-[1.75rem] leading-[1.12] tracking-tight text-charcoal sm:text-[2rem]">
                  More in {insight.category}
                </h2>
                <ViewMoreLink
                  href={`/insights?category=${encodeURIComponent(insight.category)}`}
                />
              </div>

              <RelatedInsightsGrid items={related} />
            </section>
          ) : null}
        </div>
      </div>
      </ArticleSidebarCtaEditorProvider>
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
          {block.items.map((item, i) => (
            <li key={`${i}-${item}`}>{item}</li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="my-4 list-decimal space-y-2 pl-5 text-[0.95rem] leading-[1.65] text-charcoal">
          {block.items.map((item, i) => (
            <li key={`${i}-${item}`}>{item}</li>
          ))}
        </ol>
      );
    case "image":
      return (
        <figure className="my-8 md:my-10">
          <div className="relative aspect-16/10 w-full overflow-hidden rounded-sm bg-forest/10">
            <SiteImage
              src={block.src}
              alt={resolveImageAlt(block.alt, block.caption)}
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover"
            />
          </div>
          {block.caption ? (
            <figcaption className="mt-3 text-[0.8125rem] leading-relaxed text-charcoal/55">
              {block.caption}
            </figcaption>
          ) : null}
        </figure>
      );
    case "callout":
      return (
        <aside className="my-7 rounded-sm border border-charcoal/8 bg-[#FBF8F5] px-5 py-5 md:px-6 md:py-6">
          {block.label ? (
            <p className="text-[0.65rem] font-medium tracking-[0.14em] text-charcoal/45 uppercase">
              {block.label}
            </p>
          ) : null}
          <p
            className={`text-[0.95rem] leading-[1.65] text-charcoal md:text-[0.98rem] ${
              block.label ? "mt-2" : ""
            }`}
          >
            {block.text}
          </p>
        </aside>
      );
    case "hr":
      return <hr className="my-10 border-0 border-t border-charcoal/12" />;
    case "p":
      return (
        <p className="mb-[1em] text-[0.95rem] leading-[1.65] text-charcoal md:text-[0.98rem]">
          {block.text}
        </p>
      );
  }
}
