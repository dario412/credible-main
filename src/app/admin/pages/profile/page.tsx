import Link from "next/link";
import { redirect } from "next/navigation";

import { SiteChromeEditorForm } from "@/components/admin-site-chrome-editor";
import { getSiteChrome, saveSiteChrome } from "@/lib/actions/admin-cms";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Edit Creator profile",
  path: "/admin/pages/profile",
  noIndex: true,
});

export default async function AdminCreatorProfilePage() {
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
        <h1 className="mt-3 font-display text-3xl">Creator profile</h1>
        <p className="mt-2 text-sm text-muted">
          Template for every roster profile — section order, headings, sidebar,
          formats, and closing CTA. Or open any creator and use{" "}
          <a
            href="/roster"
            className="font-medium text-forest hover:text-forest-dark"
          >
            Edit profile template
          </a>
          .
        </p>
      </div>
      <SiteChromeEditorForm
        initial={sections}
        saveAction={saveSiteChrome}
        focus="profile"
      />
    </div>
  );
}
