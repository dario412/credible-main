import Link from "next/link";
import { redirect } from "next/navigation";

import { SiteChromeEditorForm } from "@/components/admin-site-chrome-editor";
import { getSiteChrome, saveSiteChrome } from "@/lib/actions/admin-cms";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Edit Header & footer",
  path: "/admin/pages/site",
  noIndex: true,
});

export default async function AdminSiteChromePage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (!hasPermission(session.user.role, "MANAGE_CONTENT")) redirect("/admin");

  const sections = await getSiteChrome();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          href="/admin/pages"
          className="text-sm text-charcoal/55 hover:text-charcoal"
        >
          ← Pages
        </Link>
        <h1 className="mt-3 font-display text-3xl">Header, footer & profile sidebar</h1>
        <p className="mt-2 text-sm text-muted">
          Site-wide navigation, creator profile sidebar copy, footer content, and
          link columns. Changes apply on every page.
        </p>
      </div>
      <SiteChromeEditorForm initial={sections} saveAction={saveSiteChrome} />
    </div>
  );
}
