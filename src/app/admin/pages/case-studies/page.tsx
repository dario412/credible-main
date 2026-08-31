import Link from "next/link";
import { redirect } from "next/navigation";

import { CaseStudiesPageEditorForm } from "@/components/admin-case-studies-page-editor";
import {
  getCaseStudiesPageSections,
  saveCaseStudiesPage,
} from "@/lib/actions/admin-cms";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { createMetadata } from "@/lib/seo";
import { PROJECTS_PATH } from "@/lib/case-studies";

export const metadata = createMetadata({
  title: "Edit Projects",
  path: "/admin/pages/case-studies",
  noIndex: true,
});

export default async function AdminCaseStudiesPageEditor() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (!hasPermission(session.user.role, "MANAGE_CONTENT")) redirect("/admin");

  const sections = await getCaseStudiesPageSections();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          href="/admin/pages"
          className="text-sm text-charcoal/55 hover:text-charcoal"
        >
          ← Pages
        </Link>
        <h1 className="mt-3 font-display text-3xl">Projects</h1>
        <p className="mt-2 text-sm text-muted">
          Intro and All stories heading on{" "}
          <a
            href={PROJECTS_PATH}
            className="font-medium text-forest hover:text-forest-dark"
          >
            /projects
          </a>
          . Or edit live with{" "}
          <a
            href={PROJECTS_PATH}
            className="font-medium text-forest hover:text-forest-dark"
          >
            Edit page
          </a>
          .
        </p>
      </div>
      <CaseStudiesPageEditorForm
        initial={sections}
        saveAction={saveCaseStudiesPage}
      />
    </div>
  );
}
