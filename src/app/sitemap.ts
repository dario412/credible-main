import type { MetadataRoute } from "next";
import { projectHref } from "@/lib/case-studies";
import { prisma } from "@/lib/prisma";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [experts, studies, insights] = await Promise.all([
    prisma.expert.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.caseStudy.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.insight.findMany({ select: { slug: true, updatedAt: true } }),
  ]);

  const staticRoutes = [
    "",
    "/roster",
    "/how-we-work",
    "/projects",
    "/insights",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
    "/accessibility",
  ].map((path) => ({
    url: absoluteUrl(path),
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  return [
    ...staticRoutes,
    ...experts.map((e) => ({
      url: absoluteUrl(`/roster/${e.slug}`),
      lastModified: e.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...studies.map((s) => ({
      url: absoluteUrl(projectHref(s.slug)),
      lastModified: s.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...insights.map((i) => ({
      url: absoluteUrl(`/insights/${i.slug}`),
      lastModified: i.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
  ];
}
