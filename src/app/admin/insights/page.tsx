import Link from "next/link";
import { redirect } from "next/navigation";

import { AdminDeleteButton } from "@/components/admin-delete-button";
import { AdminEditorialGuideLink } from "@/components/admin-editorial-guide-link";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Insights CMS",
  path: "/admin/insights",
  noIndex: true,
});

export default async function AdminInsightsPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (!hasPermission(session.user.role, "MANAGE_CONTENT")) redirect("/admin");

  const insights = await prisma.insight.findMany({
    orderBy: { publishedAt: "desc" },
    select: {
      id: true,
      slug: true,
      title: true,
      category: true,
      publishedAt: true,
      updatedAt: true,
    },
  });

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">Insights</h1>
          <p className="mt-2 text-sm text-muted">
            Write and publish articles with structured content blocks.
          </p>
          <p className="mt-2">
            <AdminEditorialGuideLink kind="insight" />
          </p>
        </div>
        <Link
          href="/admin/insights/new"
          className="inline-flex items-center rounded-sm bg-forest px-4 py-2.5 text-sm font-medium text-cream hover:bg-forest-dark"
        >
          New insight
        </Link>
      </div>

      <div className="overflow-hidden rounded-sm border border-charcoal/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-charcoal/10 bg-[#f4f2ef] text-[0.7rem] tracking-[0.08em] text-charcoal/50 uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Published</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {insights.map((insight) => (
              <tr
                key={insight.id}
                className="border-b border-charcoal/8 last:border-0"
              >
                <td className="px-4 py-3 font-medium text-charcoal">
                  {insight.title}
                </td>
                <td className="px-4 py-3 text-charcoal/60">{insight.category}</td>
                <td className="px-4 py-3 text-charcoal/60">
                  {insight.publishedAt.toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex items-center gap-4">
                    <Link
                      href={`/admin/insights/${insight.slug}`}
                      className="font-medium text-forest hover:text-forest-dark"
                    >
                      Edit
                    </Link>
                    <AdminDeleteButton
                      kind="insight"
                      value={insight.id}
                      label={insight.title}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {insights.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-10 text-center text-sm text-muted"
                >
                  No insights yet. Create the first one.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
