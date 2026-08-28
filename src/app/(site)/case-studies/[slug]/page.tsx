import { notFound } from "next/navigation";

import { CaseStudyArticleWithSidebarCta } from "@/components/case-study-article-with-sidebar-cta";
import { CaseStudyHeroEditable } from "@/components/case-study-hero-editable";
import { SimilarCaseStudiesGrid } from "@/components/similar-case-studies-grid";
import { ViewMoreLink } from "@/components/view-more-link";
import {
  CASE_STUDIES,
  caseStudyHero,
} from "@/lib/case-studies";
import { resolveCaseStudyBlocks } from "@/lib/case-study-content";
import {
  loadCaseStudy,
  loadSimilarCaseStudies,
} from "@/lib/case-studies-server";
import { saveCaseStudy, saveSiteChrome } from "@/lib/actions/admin-cms";
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
  const shareImage = study.ogImage?.trim() || study.coverImage;
  return createMetadata({
    title: study.seoTitle?.trim() || study.title,
    description:
      study.seoDescription?.trim() || hero.summary || study.summary,
    path: `/case-studies/${study.slug}`,
    image: shareImage,
  });
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const study = await loadCaseStudy(slug);
  if (!study) notFound();

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
      <CaseStudyHeroEditable
        initial={study}
        blocks={blocks}
        canEdit={canEdit}
        saveAction={saveCaseStudy}
      />

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
