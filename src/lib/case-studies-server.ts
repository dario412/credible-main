import {
  CASE_STUDIES,
  filterCaseStudies,
  normalizeCaseStudyPillars,
  projectHref,
  type CaseStudyCard,
} from "@/lib/case-studies";
import { caseStudyToCard } from "@/lib/cms";
import type { ExpertRecentWork } from "@/lib/expert-profiles";
import { prisma } from "@/lib/prisma";

const WORK_TONES: ExpertRecentWork["tone"][] = ["forest", "rust", "sage"];

export function caseStudyToExpertWork(
  study: CaseStudyCard,
  index = 0,
): ExpertRecentWork {
  const pillars = normalizeCaseStudyPillars(study);
  return {
    client: study.client,
    meta: pillars[0] ?? study.pillar,
    title: study.title,
    description: study.summary,
    href: projectHref(study.slug),
    coverImage: study.coverImage || undefined,
    tone: WORK_TONES[index % WORK_TONES.length]!,
  };
}

/** CMS database is the source of truth. Static catalog is first-run / outage fallback only. */
export async function loadCaseStudies(): Promise<CaseStudyCard[]> {
  try {
    const rows = await prisma.caseStudy.findMany({
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
    });
    if (rows.length === 0) return CASE_STUDIES;
    return rows.map(caseStudyToCard);
  } catch {
    return CASE_STUDIES;
  }
}

/** Slim options for linking a homepage logo to a case study. */
export async function loadCaseStudyLinkOptions(): Promise<
  Array<{ slug: string; label: string }>
> {
  const studies = await loadCaseStudies();
  return studies.map((study) => ({
    slug: study.slug,
    label: `${study.client} — ${study.title}`,
  }));
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

/** Case studies linked to a roster expert via relatedExperts. */
export async function loadCaseStudiesForExpert(
  expertSlug: string,
): Promise<CaseStudyCard[]> {
  const slug = expertSlug.trim();
  if (!slug) return [];

  try {
    const rows = await prisma.caseStudy.findMany({
      where: { relatedExperts: { has: slug } },
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
    });
    return rows.map(caseStudyToCard);
  } catch {
    return [];
  }
}
