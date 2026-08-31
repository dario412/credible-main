"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { auth } from "@/lib/auth";
import {
  blocksFromLegacyBody,
  caseStudyCardToRow,
  caseStudyToCard,
  insightBlocksForSave,
  mergeHomeSections,
  type HomePageSections,
} from "@/lib/cms";
import type { CaseStudyCard } from "@/lib/case-studies";
import { projectHref, PROJECTS_PATH } from "@/lib/case-studies";
import { validateProjectCmsFields } from "@/lib/project-cms-limits";
import {
  mergeContactSections,
  type ContactPageSections,
} from "@/lib/contact-page";
import {
  mergeWhatWeDoSections,
  type WhatWeDoPageSections,
} from "@/lib/what-we-do";
import {
  mergeAboutSections,
  type AboutPageSections,
} from "@/lib/about-page";
import {
  mergeApplySections,
  type ApplyPageSections,
} from "@/lib/apply-page";
import {
  mergeRosterSections,
  type RosterPageSections,
} from "@/lib/roster-page";
import {
  mergeCaseStudiesSections,
  type CaseStudiesPageSections,
} from "@/lib/case-studies-page";
import {
  ensureBlockIds,
  parseInsightBlocks,
  type InsightBlock,
} from "@/lib/insight-content";
import { hasPermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import {
  mergeLegalSections,
  type LegalPagesSections,
} from "@/lib/legal-pages";
import {
  mergeSiteChrome,
  type SiteChromeSections,
} from "@/lib/site-chrome";

async function requireContentEditor() {
  const session = await auth();
  if (!session?.user || !hasPermission(session.user.role, "MANAGE_CONTENT")) {
    return null;
  }
  // Exempt Lloyd-style accounts may have totpEnabled true in JWT without setup;
  // still require an active session user.
  return session;
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const insightMetaSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(120),
  excerpt: z.string().min(1).max(600),
  category: z.string().min(1).max(80),
  coverImage: z.string().max(500).optional().nullable(),
  coverImageAlt: z.string().max(200).optional().nullable(),
  seoTitle: z.string().max(200).optional().nullable(),
  seoDescription: z.string().max(400).optional().nullable(),
  publishedAt: z.string().min(1),
});

export async function saveInsight(input: {
  id?: string;
  meta: z.infer<typeof insightMetaSchema>;
  blocks: InsightBlock[];
}) {
  const session = await requireContentEditor();
  if (!session) return { ok: false as const, message: "Unauthorized" };

  const parsed = insightMetaSchema.safeParse(input.meta);
  if (!parsed.success) {
    return { ok: false as const, message: "Check the form fields and try again." };
  }

  const slug = slugify(parsed.data.slug);
  const { blocks, body } = insightBlocksForSave(input.blocks);
  const publishedAt = new Date(parsed.data.publishedAt);
  if (Number.isNaN(publishedAt.getTime())) {
    return { ok: false as const, message: "Invalid publish date." };
  }

  const data = {
    title: parsed.data.title,
    slug,
    excerpt: parsed.data.excerpt,
    category: parsed.data.category,
    coverImage: parsed.data.coverImage || null,
    coverImageAlt: parsed.data.coverImageAlt?.trim() || null,
    seoTitle: parsed.data.seoTitle || null,
    seoDescription: parsed.data.seoDescription || null,
    publishedAt,
    body,
    blocks,
  };

  try {
    if (input.id) {
      await prisma.insight.update({ where: { id: input.id }, data });
    } else {
      const existing = await prisma.insight.findUnique({ where: { slug } });
      if (existing) {
        return { ok: false as const, message: "That slug is already in use." };
      }
      await prisma.insight.create({ data });
    }
  } catch {
    return { ok: false as const, message: "Could not save insight." };
  }

  revalidatePath("/insights");
  revalidatePath(`/insights/${slug}`);
  revalidatePath("/admin/insights");
  return { ok: true as const, message: "Insight saved.", slug };
}

export async function deleteInsight(id: string) {
  const session = await requireContentEditor();
  if (!session) return { ok: false as const, message: "Unauthorized" };

  const insight = await prisma.insight.findUnique({ where: { id } });
  if (!insight) return { ok: false as const, message: "Not found." };

  await prisma.insight.delete({ where: { id } });
  revalidatePath("/insights");
  revalidatePath(`/insights/${insight.slug}`);
  revalidatePath("/admin/insights");
  return { ok: true as const, message: "Insight deleted." };
}

export async function ensureInsightBlocks(id: string) {
  const insight = await prisma.insight.findUnique({ where: { id } });
  if (!insight) return [] as InsightBlock[];
  const existing = parseInsightBlocks(insight.blocks);
  if (existing) return existing;
  const fromBody = blocksFromLegacyBody(insight.body);
  if (fromBody.length > 0) {
    const { blocks, body } = insightBlocksForSave(fromBody);
    await prisma.insight.update({
      where: { id },
      data: { blocks, body },
    });
    return blocks;
  }
  return ensureBlockIds([{ type: "p", text: "" }]);
}

type CaseStudyRowPayload = ReturnType<typeof caseStudyCardToRow>;

/** Keep sidebar CTA aligned with the Speakers field (relatedExperts). */
async function syncCaseStudySpeakers(
  row: CaseStudyRowPayload,
): Promise<CaseStudyRowPayload> {
  const data = row.data as Partial<CaseStudyCard>;
  const speakers = row.relatedExperts;

  if (speakers.length === 0) {
    return {
      ...row,
      data: {
        ...row.data,
        ctaCreator: undefined,
      },
    };
  }

  const primarySlug = speakers[0]!;
  const existing = data.ctaCreator;
  if (existing?.slug === primarySlug) {
    return row;
  }

  const expert = await prisma.expert.findUnique({
    where: { slug: primarySlug },
  });
  if (!expert) {
    return row;
  }

  return {
    ...row,
    data: {
      ...row.data,
      ctaCreator: {
        slug: expert.slug,
        name: expert.name,
        shortBio: expert.shortBio?.trim() || expert.bio,
        image: expert.image || "",
        role: expert.title,
        topics: expert.topics,
        combinedReach: expert.combinedReach || "",
        growth90d: expert.growth90d || "",
        audienceWho: expert.audienceWho || "",
        audienceWhere: expert.audienceWhere || "",
        channels: Array.isArray(expert.channels)
          ? (expert.channels as NonNullable<CaseStudyCard["ctaCreator"]>["channels"])
          : [],
      },
    },
  };
}

export async function saveCaseStudy(
  card: CaseStudyCard,
  options?: { previousSlug?: string },
) {
  const session = await requireContentEditor();
  if (!session) return { ok: false as const, message: "Unauthorized" };

  if (!card.slug?.trim() || !card.title?.trim()) {
    return { ok: false as const, message: "Title and slug are required." };
  }

  const cmsLimitError = validateProjectCmsFields({
    summary: card.summary,
    heroSummary: card.heroSummary,
    seoTitle: card.seoTitle,
    seoDescription: card.seoDescription,
    title: card.title,
  });
  if (cmsLimitError) {
    return { ok: false as const, message: cmsLimitError };
  }

  const slug = slugify(card.slug);
  if (!slug) {
    return { ok: false as const, message: "Slug must include letters or numbers." };
  }

  let row = caseStudyCardToRow({
    ...card,
    slug,
  });
  row = await syncCaseStudySpeakers(row);
  const previousSlug = options?.previousSlug
    ? slugify(options.previousSlug)
    : "";

  try {
    if (card.id) {
      const conflict = await prisma.caseStudy.findFirst({
        where: { slug, NOT: { id: card.id } },
        select: { id: true },
      });
      if (conflict) {
        return {
          ok: false as const,
          message: "That slug is already used by another case study.",
        };
      }
      await prisma.caseStudy.update({
        where: { id: card.id },
        data: row,
      });
    } else if (previousSlug && previousSlug !== slug) {
      const existing = await prisma.caseStudy.findUnique({
        where: { slug: previousSlug },
        select: { id: true },
      });
      if (existing) {
        const conflict = await prisma.caseStudy.findFirst({
          where: { slug, NOT: { id: existing.id } },
          select: { id: true },
        });
        if (conflict) {
          return {
            ok: false as const,
            message: "That slug is already used by another case study.",
          };
        }
        await prisma.caseStudy.update({
          where: { id: existing.id },
          data: row,
        });
      } else {
        await prisma.caseStudy.upsert({
          where: { slug },
          create: row,
          update: row,
        });
      }
    } else {
      await prisma.caseStudy.upsert({
        where: { slug },
        create: row,
        update: row,
      });
    }
  } catch {
    return { ok: false as const, message: "Could not save case study." };
  }

  if (previousSlug && previousSlug !== slug) {
    revalidatePath(projectHref(previousSlug));
    revalidatePath(`/case-studies/${previousSlug}`);
    revalidatePath(`/admin/case-studies/${previousSlug}`);
  }
  revalidatePath(PROJECTS_PATH);
  revalidatePath(projectHref(slug));
  revalidatePath("/case-studies");
  revalidatePath(`/case-studies/${slug}`);
  revalidatePath("/admin/case-studies");
  revalidatePath(`/admin/case-studies/${slug}`);
  revalidatePath("/roster");
  for (const expertSlug of row.relatedExperts) {
    revalidatePath(`/roster/${expertSlug}`);
  }
  return { ok: true as const, message: "Project saved.", slug };
}

export async function deleteCaseStudy(slug: string) {
  const session = await requireContentEditor();
  if (!session) return { ok: false as const, message: "Unauthorized" };

  try {
    await prisma.caseStudy.delete({ where: { slug } });
  } catch {
    return { ok: false as const, message: "Could not delete case study." };
  }

  revalidatePath("/");
  revalidatePath(PROJECTS_PATH);
  revalidatePath(projectHref(slug));
  revalidatePath("/case-studies");
  revalidatePath(`/case-studies/${slug}`);
  revalidatePath("/admin/case-studies");
  return { ok: true as const, message: "Project deleted." };
}

export async function getCaseStudyCard(slug: string): Promise<CaseStudyCard | null> {
  const row = await prisma.caseStudy.findUnique({ where: { slug } });
  if (!row) return null;
  return caseStudyToCard(row);
}

export async function listCaseStudyCards(): Promise<CaseStudyCard[]> {
  const rows = await prisma.caseStudy.findMany({
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
  });
  return rows.map(caseStudyToCard);
}

export async function saveHomePage(sections: HomePageSections) {
  const session = await requireContentEditor();
  if (!session) return { ok: false as const, message: "Unauthorized" };

  const merged = mergeHomeSections(sections);

  await prisma.pageContent.upsert({
    where: { slug: "home" },
    create: {
      slug: "home",
      title: "Home",
      sections: merged,
    },
    update: {
      title: "Home",
      sections: merged,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/pages");
  revalidatePath("/admin/pages/home");
  return { ok: true as const, message: "Home page saved." };
}

export async function getHomePageSections(): Promise<HomePageSections> {
  const page = await prisma.pageContent.findUnique({ where: { slug: "home" } });
  return mergeHomeSections(page?.sections);
}

export async function getSiteChrome(): Promise<SiteChromeSections> {
  const page = await prisma.pageContent.findUnique({ where: { slug: "site" } });
  if (page?.sections) {
    return mergeSiteChrome(page.sections);
  }

  // Migrate tagline / company / email from older home-page footer CMS if present.
  const home = await prisma.pageContent.findUnique({ where: { slug: "home" } });
  const homeSections =
    home?.sections && typeof home.sections === "object"
      ? (home.sections as { footer?: Record<string, unknown> })
      : null;
  const legacyFooter = homeSections?.footer;

  if (legacyFooter && typeof legacyFooter === "object") {
    return mergeSiteChrome({
      footer: {
        tagline: legacyFooter.tagline,
        companyLine: legacyFooter.companyLine,
        email: legacyFooter.email,
      },
    });
  }

  return mergeSiteChrome(null);
}

export async function saveSiteChrome(sections: SiteChromeSections) {
  const session = await requireContentEditor();
  if (!session) return { ok: false as const, message: "Unauthorized" };

  const merged = mergeSiteChrome(sections);

  await prisma.pageContent.upsert({
    where: { slug: "site" },
    create: {
      slug: "site",
      title: "Header & footer",
      sections: merged,
    },
    update: {
      title: "Header & footer",
      sections: merged,
    },
  });

  revalidatePath("/", "layout");
  revalidatePath("/insights");
  revalidatePath("/admin/pages");
  revalidatePath("/admin/pages/site");
  return { ok: true as const, message: "Header & footer saved." };
}

export async function getContactPageSections(): Promise<ContactPageSections> {
  const page = await prisma.pageContent.findUnique({
    where: { slug: "contact" },
  });
  return mergeContactSections(page?.sections);
}

export async function saveContactPage(sections: ContactPageSections) {
  const session = await requireContentEditor();
  if (!session) return { ok: false as const, message: "Unauthorized" };

  const merged = mergeContactSections(sections);

  await prisma.pageContent.upsert({
    where: { slug: "contact" },
    create: {
      slug: "contact",
      title: "Contact",
      sections: merged,
    },
    update: {
      title: "Contact",
      sections: merged,
    },
  });

  revalidatePath("/contact");
  revalidatePath("/admin/pages");
  revalidatePath("/admin/pages/contact");
  return { ok: true as const, message: "Contact page saved." };
}

export async function getWhatWeDoSections(): Promise<WhatWeDoPageSections> {
  const page = await prisma.pageContent.findUnique({
    where: { slug: "what-we-do" },
  });
  return mergeWhatWeDoSections(page?.sections);
}

export async function saveWhatWeDoPage(sections: WhatWeDoPageSections) {
  const session = await requireContentEditor();
  if (!session) return { ok: false as const, message: "Unauthorized" };

  const merged = mergeWhatWeDoSections(sections);

  await prisma.pageContent.upsert({
    where: { slug: "what-we-do" },
    create: {
      slug: "what-we-do",
      title: "What we do",
      sections: merged,
    },
    update: {
      title: "What we do",
      sections: merged,
    },
  });

  revalidatePath("/what-we-do");
  revalidatePath("/admin/pages");
  revalidatePath("/admin/pages/what-we-do");
  return { ok: true as const, message: "What we do page saved." };
}

export async function getAboutPageSections(): Promise<AboutPageSections> {
  const page = await prisma.pageContent.findUnique({
    where: { slug: "about" },
  });
  return mergeAboutSections(page?.sections);
}

export async function saveAboutPage(sections: AboutPageSections) {
  const session = await requireContentEditor();
  if (!session) return { ok: false as const, message: "Unauthorized" };

  const merged = mergeAboutSections(sections);

  await prisma.pageContent.upsert({
    where: { slug: "about" },
    create: {
      slug: "about",
      title: "About",
      sections: merged,
    },
    update: {
      title: "About",
      sections: merged,
    },
  });

  revalidatePath("/about");
  revalidatePath("/admin/pages");
  revalidatePath("/admin/pages/about");
  return { ok: true as const, message: "About page saved." };
}

export async function getApplyPageSections(): Promise<ApplyPageSections> {
  const page = await prisma.pageContent.findUnique({
    where: { slug: "apply-for-representation" },
  });
  return mergeApplySections(page?.sections);
}

export async function saveApplyPage(sections: ApplyPageSections) {
  const session = await requireContentEditor();
  if (!session) return { ok: false as const, message: "Unauthorized" };

  const merged = mergeApplySections(sections);

  await prisma.pageContent.upsert({
    where: { slug: "apply-for-representation" },
    create: {
      slug: "apply-for-representation",
      title: "Apply for representation",
      sections: merged,
    },
    update: {
      title: "Apply for representation",
      sections: merged,
    },
  });

  revalidatePath("/apply-for-representation");
  revalidatePath("/admin/pages");
  revalidatePath("/admin/pages/apply-for-representation");
  return { ok: true as const, message: "Apply page saved." };
}

export async function getRosterPageSections(): Promise<RosterPageSections> {
  const page = await prisma.pageContent.findUnique({
    where: { slug: "roster" },
  });
  return mergeRosterSections(page?.sections);
}

export async function saveRosterPage(sections: RosterPageSections) {
  const session = await requireContentEditor();
  if (!session) return { ok: false as const, message: "Unauthorized" };

  const merged = mergeRosterSections(sections);

  await prisma.pageContent.upsert({
    where: { slug: "roster" },
    create: {
      slug: "roster",
      title: "Roster",
      sections: merged,
    },
    update: {
      title: "Roster",
      sections: merged,
    },
  });

  revalidatePath("/roster");
  revalidatePath("/admin/pages");
  revalidatePath("/admin/pages/roster");
  return { ok: true as const, message: "Roster page saved." };
}

export async function getCaseStudiesPageSections(): Promise<CaseStudiesPageSections> {
  const page = await prisma.pageContent.findUnique({
    where: { slug: "case-studies" },
  });
  return mergeCaseStudiesSections(page?.sections);
}

export async function saveCaseStudiesPage(sections: CaseStudiesPageSections) {
  const session = await requireContentEditor();
  if (!session) return { ok: false as const, message: "Unauthorized" };

  const merged = mergeCaseStudiesSections(sections);

  await prisma.pageContent.upsert({
    where: { slug: "case-studies" },
    create: {
      slug: "case-studies",
      title: "Projects",
      sections: merged,
    },
    update: {
      title: "Projects",
      sections: merged,
    },
  });

  revalidatePath(PROJECTS_PATH);
  revalidatePath("/case-studies");
  revalidatePath("/admin/pages");
  revalidatePath("/admin/pages/case-studies");
  return { ok: true as const, message: "Projects page saved." };
}

export async function getLegalPageSections(): Promise<LegalPagesSections> {
  const page = await prisma.pageContent.findUnique({
    where: { slug: "legal" },
  });
  return mergeLegalSections(page?.sections);
}

export async function saveLegalPages(sections: LegalPagesSections) {
  const session = await requireContentEditor();
  if (!session) return { ok: false as const, message: "Unauthorized" };

  const merged = mergeLegalSections(sections);

  await prisma.pageContent.upsert({
    where: { slug: "legal" },
    create: {
      slug: "legal",
      title: "Legal pages",
      sections: merged,
    },
    update: {
      title: "Legal pages",
      sections: merged,
    },
  });

  revalidatePath("/privacy");
  revalidatePath("/terms");
  revalidatePath("/accessibility");
  revalidatePath("/accessibility-statement");
  revalidatePath("/admin/pages");
  revalidatePath("/admin/pages/legal");
  return { ok: true as const, message: "Legal pages saved." };
}
