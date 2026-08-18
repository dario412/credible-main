import Link from "next/link";
import { redirect } from "next/navigation";

import { AboutPageEditorForm } from "@/components/admin-about-page-editor";
import { getAboutPageSections, saveAboutPage } from "@/lib/actions/admin-cms";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Edit About",
  path: "/admin/pages/about",
  noIndex: true,
});

export default async function AdminAboutPageEditor() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (!hasPermission(session.user.role, "MANAGE_CONTENT")) redirect("/admin");

  const sections = await getAboutPageSections();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          href="/admin/pages"
          className="text-sm text-charcoal/55 hover:text-charcoal"
        >
          ← Pages
        </Link>
        <h1 className="mt-3 font-display text-3xl">About</h1>
        <p className="mt-2 text-sm text-muted">
          All copy on{" "}
          <a
            href="/about"
            className="font-medium text-forest hover:text-forest-dark"
          >
            /about
          </a>
          . Or edit live with{" "}
          <a
            href="/about"
            className="font-medium text-forest hover:text-forest-dark"
          >
            Edit page
          </a>
          .
        </p>
      </div>
      <AboutPageEditorForm initial={sections} saveAction={saveAboutPage} />
    </div>
  );
}
