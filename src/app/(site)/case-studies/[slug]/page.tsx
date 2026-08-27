import { notFound } from "next/navigation";

import { CaseStudyArticleWithSidebarCta } from "@/components/case-study-article-with-sidebar-cta";
import { SimilarCaseStudiesGrid } from "@/components/similar-case-studies-grid";
import { SiteImage } from "@/components/site-image";
import { ViewMoreLink } from "@/components/view-more-link";
import {
  CASE_STUDIES,
  CASE_STUDY_LOGO,
  caseStudyHero,
} from "@/lib/case-studies";
import { resolveCaseStudyBlocks } from "@/lib/case-study-content";
import {
  loadCaseStudy,
  loadSimilarCaseStudies,
} from "@/lib/case-studies-server";
import { saveSiteChrome } from "@/lib/actions/admin-cms";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { absoluteUrl, createMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

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

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const study = await loadCaseStudy(slug);
  if (!study) notFound();

  const hero = caseStudyHero(study);
  const logo = study.logo ?? CASE_STUDY_LOGO;
  const { blocks, toc } = resolveCaseStudyBlocks(study);
  const shareUrl = absoluteUrl(`/case-studies/${study.slug}`);
  const [similar, session] = await Promise.all([
    loadSimilarCaseStudies(study.slug, 3),
    auth(),
  ]);
  const canEdit = Boolean(
    session?.user && hasPermission(session.user.role, "MANAGE_CONTENT"),
  );
  const hasBody = blocks.length > 0;

  return (
    <>
      <section className="relative isolate min-h-[min(92vh,52rem)] w-full -mt-[7.25rem] overflow-hidden md:min-h-[min(94vh,56rem)] md:-mt-[5.5rem]">
        <SiteImage
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
              <SiteImage
                src={logo}
                alt={study.client}
                width={96}
                height={96}
                className="size-16 object-contain brightness-0 invert md:size-20"
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

            <div className="mt-14 border-t border-cream/15 pt-8 md:mt-16 md:pt-9">
              <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between sm:gap-12">
                <div className="min-w-0">
                  <p className="text-[0.65rem] font-medium tracking-[0.18em] text-cream/45 uppercase">
                    Client
                  </p>
                  <p className="mt-2.5 font-display text-[1.65rem] leading-none tracking-tight text-cream sm:text-[1.85rem] md:text-[2.05rem]">
                    {hero.client}
                  </p>
                </div>

                {hero.pillars.length > 0 ? (
                  <div className="min-w-0 sm:text-right">
                    <p className="text-[0.65rem] font-medium tracking-[0.18em] text-cream/45 uppercase">
                      Pillars
                    </p>
                    <ul className="mt-3 flex flex-wrap items-center gap-x-0 gap-y-2 sm:justify-end">
                      {hero.pillars.map((pillar, index) => (
                        <li
                          key={pillar}
                          className="flex items-center text-[0.9375rem] leading-none text-cream/90 md:text-[1rem]"
                        >
                          {index > 0 ? (
                            <span
                              aria-hidden
                              className="mx-3 h-3.5 w-px bg-cream/25 sm:mx-3.5"
                            />
                          ) : null}
                          <span>{pillar}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      {hasBody ? (
        <CaseStudyArticleWithSidebarCta
          canEdit={canEdit}
          saveAction={saveSiteChrome}
          blocks={blocks}
          toc={toc}
          shareUrl={shareUrl}
          title={study.title}
          ctaCreator={study.ctaCreator ?? null}
        />
      ) : null}

      <div className="bg-cream px-6 md:px-10 lg:px-12">
        <div className="mx-auto max-w-352">
          {similar.length > 0 ? (
            <section className="mt-16 pb-10 md:mt-20 md:pb-12 lg:pb-14">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <h2 className="font-display text-[1.65rem] leading-tight tracking-tight text-charcoal md:text-[1.85rem]">
                  Similar projects
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
    </>
  );
}
