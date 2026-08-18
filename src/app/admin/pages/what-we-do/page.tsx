import Link from "next/link";
import { redirect } from "next/navigation";

import { WhatWeDoPageEditorForm } from "@/components/admin-what-we-do-editor";
import {
  getWhatWeDoSections,
  saveWhatWeDoPage,
} from "@/lib/actions/admin-cms";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Edit What we do",
  path: "/admin/pages/what-we-do",
  noIndex: true,
});

export default async function AdminWhatWeDoPageEditor() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (!hasPermission(session.user.role, "MANAGE_CONTENT")) redirect("/admin");

  const sections = await getWhatWeDoSections();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          href="/admin/pages"
          className="text-sm text-charcoal/55 hover:text-charcoal"
        >
          ← Pages
        </Link>
        <h1 className="mt-3 font-display text-3xl">What we do</h1>
        <p className="mt-2 text-sm text-muted">
          All copy on{" "}
          <a
            href="/what-we-do"
            className="font-medium text-forest hover:text-forest-dark"
          >
            /what-we-do
          </a>
          . Or edit live with{" "}
          <a
            href="/what-we-do"
            className="font-medium text-forest hover:text-forest-dark"
          >
            Edit page
          </a>
          .
        </p>
      </div>
      <WhatWeDoPageEditorForm
        initial={sections}
        saveAction={saveWhatWeDoPage}
      />
    </div>
  );
}
