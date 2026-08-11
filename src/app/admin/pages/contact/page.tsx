import Link from "next/link";
import { redirect } from "next/navigation";

import { ContactPageEditorForm } from "@/components/admin-contact-page-editor";
import {
  getContactPageSections,
  saveContactPage,
} from "@/lib/actions/admin-cms";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Edit Contact",
  path: "/admin/pages/contact",
  noIndex: true,
});

export default async function AdminContactPageEditor() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (!hasPermission(session.user.role, "MANAGE_CONTENT")) redirect("/admin");

  const sections = await getContactPageSections();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          href="/admin/pages"
          className="text-sm text-charcoal/55 hover:text-charcoal"
        >
          ← Pages
        </Link>
        <h1 className="mt-3 font-display text-3xl">Contact</h1>
        <p className="mt-2 text-sm text-muted">
          Sidebar cards on{" "}
          <a
            href="/contact"
            className="font-medium text-forest hover:text-forest-dark"
          >
            /contact
          </a>
          — briefed-by logos and what happens next. Or edit live with{" "}
          <a
            href="/contact"
            className="font-medium text-forest hover:text-forest-dark"
          >
            Edit page
          </a>
          .
        </p>
      </div>
      <ContactPageEditorForm
        initial={sections}
        saveAction={saveContactPage}
      />
    </div>
  );
}
