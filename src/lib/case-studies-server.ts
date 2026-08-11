import {
  CASE_STUDIES,
  filterCaseStudies,
  normalizeCaseStudyPillars,
  type CaseStudyCard,
} from "@/lib/case-studies";
import { caseStudyToCard } from "@/lib/cms";
import { prisma } from "@/lib/prisma";

/** Prefer CMS DB rows; keep unique static fallbacks that aren't in the DB yet. */
export async function loadCaseStudies(): Promise<CaseStudyCard[]> {
  try {
    const rows = await prisma.caseStudy.findMany({
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
    });
    if (rows.length === 0) return CASE_STUDIES;

    const fromDb = rows.map(caseStudyToCard);
    const dbSlugs = new Set(fromDb.map((study) => study.slug));
    const staticOnly = CASE_STUDIES.filter((study) => !dbSlugs.has(study.slug));
    return [...fromDb, ...staticOnly];
  } catch {
    return CASE_STUDIES;
  }
}

export async function loadCaseStudy(
  slug: string,
): Promise<CaseStudyCard | undefined> {
  const all = await loadCaseStudies();
  return all.find((study) => study.slug === slug);
}

export async function loadFeaturedCaseStudy() {
  const all = await loadCaseStudies();
  return all.find((study) => study.featured) ?? all[0];
}

export async function loadSecondaryCaseStudies() {
  const all = await loadCaseStudies();
  return all.filter((study) => !study.featured).slice(0, 4);
}

export async function loadSimilarCaseStudies(slug: string, limit = 3) {
  const all = await loadCaseStudies();
  const current = all.find((study) => study.slug === slug);
  const others = all.filter((study) => study.slug !== slug);
  if (!current) return others.slice(0, limit);
  const currentPillars = new Set(normalizeCaseStudyPillars(current));
  const samePillar = others.filter((study) =>
    normalizeCaseStudyPillars(study).some((p) => currentPillars.has(p)),
  );
  const rest = others.filter(
    (study) =>
      !normalizeCaseStudyPillars(study).some((p) => currentPillars.has(p)),
  );
  return [...samePillar, ...rest].slice(0, limit);
}

export async function loadFilteredCaseStudies(filters: {
  clientType?: string;
  pillar?: string;
  q?: string;
}) {
  return filterCaseStudies(filters, await loadCaseStudies());
}
