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
import {
  mergeContactSections,
  type ContactPageSections,
} from "@/lib/contact-page";
import {
  ensureBlockIds,
  parseInsightBlocks,
  type InsightBlock,
} from "@/lib/insight-content";
import { hasPermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
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

export async function saveCaseStudy(
  card: CaseStudyCard,
  options?: { previousSlug?: string },
) {
  const session = await requireContentEditor();
  if (!session) return { ok: false as const, message: "Unauthorized" };

  if (!card.slug?.trim() || !card.title?.trim()) {
    return { ok: false as const, message: "Title and slug are required." };
  }

  const slug = slugify(card.slug);
  if (!slug) {
    return { ok: false as const, message: "Slug must include letters or numbers." };
  }

  const row = caseStudyCardToRow({
    ...card,
    slug,
  });
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
    revalidatePath(`/case-studies/${previousSlug}`);
    revalidatePath(`/admin/case-studies/${previousSlug}`);
  }
  revalidatePath("/case-studies");
  revalidatePath(`/case-studies/${slug}`);
  revalidatePath("/admin/case-studies");
  revalidatePath(`/admin/case-studies/${slug}`);
  return { ok: true as const, message: "Case study saved.", slug };
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
  revalidatePath("/case-studies");
  revalidatePath(`/case-studies/${slug}`);
  revalidatePath("/admin/case-studies");
  return { ok: true as const, message: "Case study deleted." };
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
