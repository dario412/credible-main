import Link from "next/link";
import { redirect } from "next/navigation";

import { RosterPageEditorForm } from "@/components/admin-roster-page-editor";
import {
  getRosterPageSections,
  saveRosterPage,
} from "@/lib/actions/admin-cms";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Edit Roster",
  path: "/admin/pages/roster",
  noIndex: true,
});

export default async function AdminRosterPageEditor() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (!hasPermission(session.user.role, "MANAGE_CONTENT")) redirect("/admin");

  const sections = await getRosterPageSections();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          href="/admin/pages"
          className="text-sm text-charcoal/55 hover:text-charcoal"
        >
          ← Pages
        </Link>
        <h1 className="mt-3 font-display text-3xl">Roster</h1>
        <p className="mt-2 text-sm text-muted">
          Intro copy on{" "}
          <a
            href="/roster"
            className="font-medium text-forest hover:text-forest-dark"
          >
            /roster
          </a>
          . Or edit live with{" "}
          <a
            href="/roster"
            className="font-medium text-forest hover:text-forest-dark"
          >
            Edit page
          </a>
          .
        </p>
      </div>
      <RosterPageEditorForm
        initial={sections}
        saveAction={saveRosterPage}
      />
    </div>
  );
}
