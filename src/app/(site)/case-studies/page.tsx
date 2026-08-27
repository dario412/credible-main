import { CaseStudyArchiveCard } from "@/components/case-study-archive-card";
import {
  CASE_STUDIES_FEATURED_LAYOUT,
  CaseStudiesFeatured,
} from "@/components/case-studies-featured";
import { CaseStudiesVisualEditor } from "@/components/case-studies-visual-editor";
import { CaseStudyFilters } from "@/components/case-study-filters";
import {
  getCaseStudiesPageSections,
  saveCaseStudiesPage,
} from "@/lib/actions/admin-cms";
import { auth } from "@/lib/auth";
import { filterCaseStudies } from "@/lib/case-studies";
import { loadCaseStudies } from "@/lib/case-studies-server";
import { hasPermission } from "@/lib/permissions";
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
  title: "Projects",
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

  const [all, pageSections, session] = await Promise.all([
    loadCaseStudies(),
    getCaseStudiesPageSections(),
    auth(),
  ]);
  const canEdit = Boolean(
    session?.user && hasPermission(session.user.role, "MANAGE_CONTENT"),
  );
  const lead = featuredLeadCount(CASE_STUDIES_FEATURED_LAYOUT);
  const rest = all.slice(lead);
  const stories = SHOW_CASE_STUDY_FILTERS
    ? filterCaseStudies({ clientType, pillar, q }, rest)
    : rest;

  return (
    <CaseStudiesVisualEditor
      initial={pageSections}
      canEdit={canEdit}
      saveAction={saveCaseStudiesPage}
      hasAnyStudies={all.length > 0}
      featured={<CaseStudiesFeatured studies={all} />}
      filters={
        SHOW_CASE_STUDY_FILTERS ? (
          <div className="mx-auto mt-8 max-w-4xl md:mt-10">
            <CaseStudyFilters
              currentClientType={clientType}
              currentPillar={pillar}
              currentQuery={q}
            />
          </div>
        ) : undefined
      }
      stories={
        stories.length > 0 ? (
          <ul className="mt-10 grid gap-8 sm:grid-cols-2 md:mt-12 lg:grid-cols-3 lg:gap-10">
            {stories.map((study) => (
              <li key={study.slug}>
                <CaseStudyArchiveCard study={study} />
              </li>
            ))}
          </ul>
        ) : null
      }
    />
  );
}
