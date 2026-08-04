import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { InsightEditorForm } from "@/components/admin-insight-editor";
import { ensureInsightBlocks, saveInsight } from "@/lib/actions/admin-cms";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { createMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return createMetadata({
    title: `Edit insight · ${slug}`,
    path: `/admin/insights/${slug}`,
    noIndex: true,
  });
}

export default async function AdminEditInsightPage({ params }: Props) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (!hasPermission(session.user.role, "MANAGE_CONTENT")) redirect("/admin");

  const { slug } = await params;
  const insight = await prisma.insight.findUnique({ where: { slug } });
  if (!insight) notFound();

  const blocks = await ensureInsightBlocks(insight.id);
  const local = new Date(
    insight.publishedAt.getTime() - insight.publishedAt.getTimezoneOffset() * 60000,
  )
    .toISOString()
    .slice(0, 16);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link
          href="/admin/insights"
          className="text-sm text-charcoal/55 hover:text-charcoal"
        >
          ← Insights
        </Link>
        <h1 className="mt-3 font-display text-3xl">Edit insight</h1>
        <p className="mt-1 text-sm text-muted">{insight.slug}</p>
      </div>
      <InsightEditorForm
        id={insight.id}
        initialMeta={{
          title: insight.title,
          slug: insight.slug,
          excerpt: insight.excerpt,
          category: insight.category,
          coverImage: insight.coverImage ?? "",
          seoTitle: insight.seoTitle ?? "",
          seoDescription: insight.seoDescription ?? "",
          publishedAt: local,
        }}
        initialBlocks={blocks}
        saveAction={saveInsight}
      />
    </div>
  );
}
