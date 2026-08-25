import { CaseStudyArchiveCard } from "@/components/case-study-archive-card";
import {
  CASE_STUDIES_FEATURED_LAYOUT,
  CaseStudiesFeatured,
} from "@/components/case-studies-featured";
import { CaseStudyFilters } from "@/components/case-study-filters";
import { FadeUp } from "@/components/fade-up";
import { EYEBROW } from "@/components/inner-page";
import { RepresentationFaq } from "@/components/representation-faq";
import { getCaseStudiesPageSections } from "@/lib/actions/admin-cms";
import { filterCaseStudies } from "@/lib/case-studies";
import { loadCaseStudies } from "@/lib/case-studies-server";
import { createMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

/**
 * Search / client type / pillar bar under “All stories”.
 * Flip to true when the catalogue is large enough to need filtering.
 */
const SHOW_CASE_STUDY_FILTERS = false;

/** How many CMS stories lead the featured hero (pair = 2, rail = 5). */
function featuredLeadCount(
  layout: typeof CASE_STUDIES_FEATURED_LAYOUT,
) {
  return layout === "featured-rail" ? 5 : 2;
}

export const metadata = createMetadata({
  title: "Case studies",
  description:
    "Work that ran — deals Credible structured, delivered, and measured across content, brand, speaking, and live events.",
  path: "/case-studies",
});

type SearchParams = Promise<{
  clientType?: string;
  pillar?: string;
  q?: string;
}>;

export default async function CaseStudiesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const clientType = SHOW_CASE_STUDY_FILTERS
    ? params.clientType?.trim()
    : undefined;
  const pillar = SHOW_CASE_STUDY_FILTERS ? params.pillar?.trim() : undefined;
  const q = SHOW_CASE_STUDY_FILTERS ? params.q?.trim() : undefined;

  const [all, pageSections] = await Promise.all([
    loadCaseStudies(),
    getCaseStudiesPageSections(),
  ]);
  const lead = featuredLeadCount(CASE_STUDIES_FEATURED_LAYOUT);
  const rest = all.slice(lead);
  const stories = SHOW_CASE_STUDY_FILTERS
    ? filterCaseStudies({ clientType, pillar, q }, rest)
    : rest;
  const faqItems = pageSections.faq.items.filter(
    (item) => item.q.trim() && item.a.trim(),
  );

  return (
    <>
      <section className="px-6 pt-16 pb-0 md:px-10 md:pt-20 lg:px-12 lg:pt-24">
        <div className="mx-auto max-w-352">
          <h1 className="max-w-[16ch] font-display text-[2.6rem] leading-[1.05] tracking-tight text-charcoal sm:text-[3.25rem] md:text-[3.75rem] lg:text-[4.15rem]">
            Work that ran, and
            <br />
            what happened <span className="text-forest">next.</span>
          </h1>
          <p className="mt-6 max-w-xl text-[1.05rem] leading-relaxed text-charcoal/65 md:text-[1.125rem]">
            Not decks or promises — deals we structured, delivered, and measured
            with expert creators your buyers already trust.
          </p>
        </div>
      </section>

      <section className="px-6 pb-16 md:px-10 md:pb-20 lg:px-12 lg:pb-24">
        <CaseStudiesFeatured studies={all} />
      </section>

      <section
        id="all-case-studies"
        className="scroll-mt-8 bg-cream px-6 py-16 md:px-10 md:py-20 lg:px-12 lg:py-24"
      >
        <div className="mx-auto max-w-352">
          <h2 className="text-center font-display text-[2rem] leading-[1.12] tracking-tight text-charcoal sm:text-[2.4rem] md:text-[2.75rem]">
            All stories
          </h2>

          {SHOW_CASE_STUDY_FILTERS ? (
            <div className="mx-auto mt-8 max-w-4xl md:mt-10">
              <CaseStudyFilters
                currentClientType={clientType}
                currentPillar={pillar}
                currentQuery={q}
              />
            </div>
          ) : null}

          {stories.length > 0 ? (
            <ul className="mt-10 grid gap-8 sm:grid-cols-2 md:mt-12 lg:grid-cols-3 lg:gap-10">
              {stories.map((study) => (
                <li key={study.slug}>
                  <CaseStudyArchiveCard study={study} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-10 text-sm text-charcoal/50 md:mt-12">
              {all.length > 0
                ? "More stories will land here as the catalogue grows."
                : "No case studies yet."}
            </p>
          )}
        </div>
      </section>

      {faqItems.length > 0 ? (
        <section
          id="case-studies-faq"
          className="scroll-mt-8 bg-cream px-6 py-16 md:px-10 md:py-20 lg:px-12 lg:py-24"
        >
          <div className="mx-auto max-w-352">
            <FadeUp>
              <div className="mx-auto max-w-[52.5rem] text-center">
                <p className={EYEBROW}>{pageSections.faq.eyebrow}</p>
                <h2 className="mt-4 font-display text-[2rem] leading-[1.1] tracking-tight text-charcoal md:text-[3.25rem]">
                  {pageSections.faq.headline}
                </h2>
                <p className="mx-auto mt-5 max-w-[32.5rem] text-[1.0625rem] leading-relaxed text-charcoal/70">
                  {pageSections.faq.subhead}
                </p>
              </div>
            </FadeUp>
            <div className="mx-auto mt-14 max-w-[47.5rem]">
              <RepresentationFaq items={faqItems} />
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
