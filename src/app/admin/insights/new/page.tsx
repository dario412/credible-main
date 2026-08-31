import Link from "next/link";
import { redirect } from "next/navigation";

import { InsightEditorForm } from "@/components/admin-insight-editor";
import { AdminEditorialGuideLink } from "@/components/admin-editorial-guide-link";
import { saveInsight } from "@/lib/actions/admin-cms";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "New insight",
  path: "/admin/insights/new",
  noIndex: true,
});

export default async function AdminNewInsightPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (!hasPermission(session.user.role, "MANAGE_CONTENT")) redirect("/admin");

  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
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
        <h1 className="mt-3 font-display text-3xl">New insight</h1>
        <p className="mt-2">
          <AdminEditorialGuideLink kind="insight" />
        </p>
      </div>
      <InsightEditorForm
        initialMeta={{
          title: "",
          slug: "",
          excerpt: "",
          category: "Strategy",
          coverImage: "",
          coverImageAlt: "",
          seoTitle: "",
          seoDescription: "",
          publishedAt: local,
        }}
        initialBlocks={[{ type: "p", text: "" }]}
        saveAction={saveInsight}
      />
    </div>
  );
}
