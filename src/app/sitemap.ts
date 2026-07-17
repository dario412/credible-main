import type { MetadataRoute } from "next";
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
    "/what-we-do",
    "/case-studies",
    "/insights",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
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
      url: absoluteUrl(`/case-studies/${s.slug}`),
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
