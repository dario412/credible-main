/** CMS character limits for project / case study fields. */
export const PROJECT_SUMMARY_MAX = 280;
export const PROJECT_HERO_SUMMARY_MAX = 320;
export const PROJECT_SEO_TITLE_MAX = 60;
export const PROJECT_SEO_DESCRIPTION_MAX = 160;

export function validateProjectCmsFields(fields: {
  summary?: string;
  heroSummary?: string;
  seoTitle?: string;
  seoDescription?: string;
  /** Used when meta title is left blank (same as page title). */
  title?: string;
}): string | null {
  const summary = fields.summary?.trim() ?? "";
  if (summary.length > PROJECT_SUMMARY_MAX) {
    return `Card summary must be ${PROJECT_SUMMARY_MAX} characters or fewer.`;
  }
  const heroSummary = fields.heroSummary?.trim() ?? "";
  if (heroSummary.length > PROJECT_HERO_SUMMARY_MAX) {
    return `Hero intro must be ${PROJECT_HERO_SUMMARY_MAX} characters or fewer.`;
  }
  const seoTitle = fields.seoTitle?.trim() ?? "";
  if (seoTitle.length > PROJECT_SEO_TITLE_MAX) {
    return `Meta title must be ${PROJECT_SEO_TITLE_MAX} characters or fewer.`;
  }
  const effectiveSeoTitle = seoTitle || fields.title?.trim() || "";
  if (!seoTitle && effectiveSeoTitle.length > PROJECT_SEO_TITLE_MAX) {
    return `Page title is ${effectiveSeoTitle.length} characters — shorten it or write a custom meta title (max ${PROJECT_SEO_TITLE_MAX}).`;
  }
  const seoDescription = fields.seoDescription?.trim() ?? "";
  if (seoDescription.length > PROJECT_SEO_DESCRIPTION_MAX) {
    return `Meta description must be ${PROJECT_SEO_DESCRIPTION_MAX} characters or fewer.`;
  }
  const effectiveSeoDescription = seoDescription || summary;
  if (!seoDescription && effectiveSeoDescription.length > PROJECT_SEO_DESCRIPTION_MAX) {
    return `Card summary is ${effectiveSeoDescription.length} characters — shorten it or write a custom meta description (max ${PROJECT_SEO_DESCRIPTION_MAX}).`;
  }
  return null;
}
