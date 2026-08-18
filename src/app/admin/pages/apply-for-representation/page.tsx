import Link from "next/link";
import { redirect } from "next/navigation";

import { ApplyPageEditorForm } from "@/components/admin-apply-page-editor";
import { getApplyPageSections, saveApplyPage } from "@/lib/actions/admin-cms";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Edit Apply for representation",
  path: "/admin/pages/apply-for-representation",
  noIndex: true,
});

export default async function AdminApplyPageEditor() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (!hasPermission(session.user.role, "MANAGE_CONTENT")) redirect("/admin");

  const sections = await getApplyPageSections();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          href="/admin/pages"
          className="text-sm text-charcoal/55 hover:text-charcoal"
        >
          ← Pages
        </Link>
        <h1 className="mt-3 font-display text-3xl">Apply for representation</h1>
        <p className="mt-2 text-sm text-muted">
          Marketing copy on{" "}
          <a
            href="/apply-for-representation"
            className="font-medium text-forest hover:text-forest-dark"
          >
            /apply-for-representation
          </a>
          . The application form itself is not edited here. Or edit live with{" "}
          <a
            href="/apply-for-representation"
            className="font-medium text-forest hover:text-forest-dark"
          >
            Edit page
          </a>
          .
        </p>
      </div>
      <ApplyPageEditorForm initial={sections} saveAction={saveApplyPage} />
    </div>
  );
}
