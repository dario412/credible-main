import Link from "next/link";
import { redirect } from "next/navigation";

import { AdminLegalPagesEditor } from "@/components/admin-legal-pages-editor";
import {
  getLegalPageSections,
  saveLegalPages,
} from "@/lib/actions/admin-cms";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Edit Legal Pages",
  path: "/admin/pages/legal",
  noIndex: true,
});

export default async function AdminLegalPagesEditorPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (!hasPermission(session.user.role, "MANAGE_CONTENT")) redirect("/admin");

  const sections = await getLegalPageSections();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link
          href="/admin/pages"
          className="text-sm text-charcoal/55 hover:text-charcoal"
        >
          ← Pages
        </Link>
        <h1 className="mt-3 font-display text-3xl">Legal pages</h1>
        <p className="mt-2 text-sm text-muted">
          Privacy policy, terms of service, and accessibility statement on{" "}
          <a
            href="/privacy"
            className="font-medium text-forest hover:text-forest-dark"
          >
            /privacy
          </a>
          ,{" "}
          <a
            href="/terms"
            className="font-medium text-forest hover:text-forest-dark"
          >
            /terms
          </a>
          , and{" "}
          <a
            href="/accessibility"
            className="font-medium text-forest hover:text-forest-dark"
          >
            /accessibility
          </a>
          .
        </p>
      </div>
      <AdminLegalPagesEditor initial={sections} saveAction={saveLegalPages} />
    </div>
  );
}
