import Image from "next/image";
import { notFound } from "next/navigation";

import { CaseStudyCreatorCta } from "@/components/case-study-creator-cta";
import { InsightArticleCta } from "@/components/insight-article-cta";
import { InsightShare } from "@/components/insight-share";
import { SimilarCaseStudiesGrid } from "@/components/similar-case-studies-grid";
import { StatCounter } from "@/components/stat-counter";
import { ViewMoreLink } from "@/components/view-more-link";
import {
  CASE_STUDIES,
  CASE_STUDY_LOGO,
  caseStudyHero,
} from "@/lib/case-studies";
import {
  loadCaseStudy,
  loadSimilarCaseStudies,
} from "@/lib/case-studies-server";
import { absoluteUrl, createMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

const STORY_TOC = [
  { id: "challenge", text: "The challenge" },
  { id: "approach", text: "Our approach" },
  { id: "outcomes", text: "Outcomes" },
  { id: "deliverables", text: "Deliverables" },
] as const;

export function generateStaticParams() {
  return CASE_STUDIES.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const study = await loadCaseStudy(slug);
  if (!study) return {};

  const hero = caseStudyHero(study);
  return createMetadata({
    title: study.title,
    description: hero.summary,
    path: `/case-studies/${study.slug}`,
  });
}

function StoryBlock({
  id,
  title,
  children,
  className,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("scroll-mt-24", className)}>
      <h2 className="font-display text-[1.65rem] leading-tight tracking-tight text-charcoal md:text-[1.85rem]">
        {title}
      </h2>
      <div className="mt-5 md:mt-6">{children}</div>
    </section>
  );
}

function StoryToc({ className }: { className?: string }) {
  return (
    <nav aria-label="On this page" className={className}>
      <p className="font-display text-[1.05rem] font-medium leading-snug tracking-tight text-charcoal">
        In this case study
      </p>
      <ol className="mt-3 space-y-2.5">
        {STORY_TOC.map((item) => (
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
  );
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const study = await loadCaseStudy(slug);
  if (!study) notFound();

  const hero = caseStudyHero(study);
  const logo = study.logo ?? CASE_STUDY_LOGO;
  const quote = study.quote;
  const story = study.story;
  const results = hero.results;
  const shareUrl = absoluteUrl(`/case-studies/${study.slug}`);
  const similar = await loadSimilarCaseStudies(study.slug, 3);

  return (
    <>
      <section className="relative isolate min-h-[min(92vh,52rem)] w-full -mt-[7.25rem] overflow-hidden md:min-h-[min(94vh,56rem)] md:-mt-[5.5rem]">
        <Image
          src={study.coverImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-t from-charcoal via-charcoal/78 to-charcoal/55"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-b from-charcoal/75 via-charcoal/35 to-transparent"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-[55%] backdrop-blur-[8px]"
          style={{
            maskImage:
              "linear-gradient(to bottom, black 0%, black 35%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0%, black 35%, transparent 100%)",
          }}
        />

        <div className="relative flex min-h-[min(92vh,52rem)] flex-col px-6 pt-36 pb-12 md:min-h-[min(94vh,56rem)] md:px-10 md:pb-14 lg:px-12 lg:pb-16">
          <div className="mx-auto flex w-full max-w-352 flex-1 flex-col justify-between">
            <div>
              <Image
                src={logo}
                alt={study.client}
                width={48}
                height={48}
                className="size-10 object-contain brightness-0 invert md:size-11"
                priority
              />

              <h1 className="mt-8 max-w-[18ch] font-display text-[2.4rem] leading-[1.08] tracking-tight text-cream sm:text-[3rem] md:mt-10 md:text-[3.5rem] lg:text-[4rem]">
                {hero.titleEmphasis ? (
                  <>
                    {hero.title}{" "}
                    <em className="font-display italic">
                      {hero.titleEmphasis}
                    </em>
                  </>
                ) : (
                  hero.title
                )}
              </h1>

              <p className="mt-6 max-w-2xl text-[1.05rem] leading-relaxed text-cream/75 md:mt-7 md:text-[1.125rem]">
                {hero.summary}
              </p>
            </div>

            <dl className="mt-14 grid gap-8 border-t border-cream/20 pt-8 sm:grid-cols-2 md:mt-16 md:gap-10 lg:grid-cols-4">
              {hero.meta.map((item) => (
                <div key={item.label}>
                  <dt className="font-mono text-[10px] tracking-[0.14em] text-cream/55 uppercase">
                    {item.label}
                  </dt>
                  <dd className="mt-2.5 text-[0.95rem] leading-snug text-cream md:text-[1rem]">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {quote ? (
        <section className="bg-cream px-6 py-20 md:px-10 md:py-28 lg:px-12 lg:py-32">
          <div className="mx-auto flex max-w-352 flex-col items-center text-center">
            <blockquote className="max-w-[38rem] text-[1.35rem] leading-[1.35] font-medium tracking-tight text-charcoal sm:text-[1.55rem] md:text-[1.75rem] md:leading-[1.3]">
              “{quote.text}”
            </blockquote>

            <div className="mt-10 md:mt-12">
              <p className="text-[0.95rem] font-medium tracking-tight text-charcoal">
                {quote.name}
              </p>
              <p className="mt-1 text-[0.875rem] text-charcoal/50">
                {quote.role}
              </p>
            </div>
          </div>
        </section>
      ) : null}

      {story ? (
        <div className="bg-cream px-6 pt-10 pb-0 md:px-10 md:pt-12 lg:px-12 lg:pt-14">
          <div className="mx-auto max-w-352">
            <InsightShare
              url={shareUrl}
              title={study.title}
              className="mb-8 lg:hidden"
            />

            <StoryToc className="mb-8 rounded-sm border border-charcoal/8 bg-[#FBF8F5] px-5 py-5 md:mb-10 md:px-6 lg:hidden" />

            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-stretch lg:gap-12 xl:grid-cols-[minmax(0,1fr)_19rem] xl:gap-14">
              <div className="min-w-0 w-full">
                <StoryBlock id="challenge" title="The challenge">
                  <div className="space-y-5 text-[0.98rem] leading-relaxed text-charcoal/65 md:text-[1.02rem]">
                    {story.challenge.map((paragraph) => (
                      <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                    ))}
                  </div>
                </StoryBlock>

                <StoryBlock
                  id="approach"
                  title="Our approach"
                  className="mt-10 md:mt-12"
                >
                  <div className="space-y-5 text-[0.98rem] leading-relaxed text-charcoal/65 md:text-[1.02rem]">
                    {story.approach.map((paragraph) => (
                      <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                    ))}
                  </div>
                </StoryBlock>

                <section id="outcomes" className="mt-10 scroll-mt-24 md:mt-12">
                  <h2 className="font-display text-[1.65rem] leading-tight tracking-tight text-charcoal whitespace-nowrap md:text-[1.85rem]">
                    {story.outcomesHeadline ?? "Outcomes"}
                  </h2>

                  {story.outcomes.length > 0 ? (
                    <div className="mt-5 space-y-4 text-[0.98rem] leading-relaxed text-charcoal/65 md:mt-6 md:text-[1.02rem]">
                      {story.outcomes.map((paragraph) => (
                        <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                      ))}
                    </div>
                  ) : null}

                  {results.length > 0 ? (
                    <ul className="mt-8 border-t border-charcoal/12 md:mt-10">
                      {results.map((result) => (
                        <li
                          key={result.value + (result.label ?? "")}
                          className="border-b border-charcoal/12 py-8 md:py-10"
                        >
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-10">
                            <p className="font-display text-[3.75rem] leading-none tracking-tight text-charcoal sm:text-[4.5rem] md:text-[5.25rem]">
                              <StatCounter value={result.value} duration={1400} />
                            </p>
                            <div className="max-w-md sm:text-right">
                              {result.label ? (
                                <p className="text-[1.05rem] leading-snug font-medium text-charcoal md:text-[1.2rem]">
                                  {result.label}
                                </p>
                              ) : null}
                              <p
                                className={cn(
                                  "text-sm leading-relaxed text-charcoal/55",
                                  result.label ? "mt-1.5" : undefined,
                                )}
                              >
                                {result.caption}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </section>

                <section id="deliverables" className="mt-10 scroll-mt-24 md:mt-12">
                  <h2 className="font-display text-[1.65rem] leading-tight tracking-tight text-charcoal whitespace-nowrap md:text-[1.85rem]">
                    {story.deliverablesHeadline ?? "Deliverables"}
                  </h2>

                  {story.deliverablesIntro && story.deliverablesIntro.length > 0 ? (
                    <div className="mt-5 space-y-4 text-[0.98rem] leading-relaxed text-charcoal/65 md:mt-6 md:text-[1.02rem]">
                      {story.deliverablesIntro.map((paragraph) => (
                        <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                      ))}
                    </div>
                  ) : null}

                  <ul className="mt-8 grid gap-3 sm:grid-cols-2 md:mt-10 md:gap-4 lg:grid-cols-3">
                    {story.deliverables.map((item) => (
                      <li
                        key={item.title}
                        className="flex min-h-40 flex-col justify-between rounded-sm bg-cream-dark px-5 pb-5 pt-6 md:min-h-44 md:px-6 md:pb-6 md:pt-7"
                      >
                        <div>
                          <Image
                            src={item.logo}
                            alt={item.label}
                            width={120}
                            height={28}
                            className="h-6 w-auto max-w-[7.5rem] object-contain object-left"
                          />
                          <p className="mt-4 font-display text-[1.15rem] leading-snug tracking-tight text-charcoal md:text-[1.25rem]">
                            {item.title}
                          </p>
                        </div>
                        <p className="mt-6 text-[0.875rem] leading-relaxed text-charcoal/70">
                          {item.meta}
                        </p>
                      </li>
                    ))}
                  </ul>
                </section>

                {study.ctaCreator ? (
                  <CaseStudyCreatorCta
                    className="mt-10 md:mt-12"
                    creatorName={study.ctaCreator.name}
                    expert={{
                      slug: study.ctaCreator.slug,
                      name: study.ctaCreator.name,
                    }}
                  />
                ) : null}

                <div className="pt-2 lg:hidden">
                  <InsightArticleCta />
                </div>
              </div>

              <aside className="hidden lg:block">
                <InsightShare url={shareUrl} title={study.title} />

                <div className="sticky top-28 mt-8 self-start">
                  <StoryToc />
                  <div className="mt-8">
                    <InsightArticleCta />
                  </div>
                </div>
              </aside>
            </div>

            {similar.length > 0 ? (
              <section className="mt-16 pb-10 md:mt-20 md:pb-12 lg:pb-14">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <h2 className="font-display text-[1.65rem] leading-tight tracking-tight text-charcoal md:text-[1.85rem]">
                    Similar case studies
                  </h2>
                  <ViewMoreLink href="/case-studies">View all</ViewMoreLink>
                </div>

                <SimilarCaseStudiesGrid studies={similar} />
              </section>
            ) : (
              <div className="pb-10 md:pb-12 lg:pb-14" aria-hidden />
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
