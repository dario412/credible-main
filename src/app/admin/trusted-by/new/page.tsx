import Link from "next/link";
import { redirect } from "next/navigation";

import { AdminTrustedByEditor } from "@/components/admin-trusted-by-editor";
import { saveTrustedClient } from "@/lib/actions/admin-trusted-by";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { createMetadata } from "@/lib/seo";
import { emptyTrustedByClient } from "@/lib/trusted-by";

export const metadata = createMetadata({
  title: "New trusted by client",
  path: "/admin/trusted-by/new",
  noIndex: true,
});

export default async function AdminTrustedByNewPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (!hasPermission(session.user.role, "MANAGE_CONTENT")) redirect("/admin");

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          href="/admin/trusted-by"
          className="text-sm text-charcoal/55 hover:text-charcoal"
        >
          ← Trusted by
        </Link>
        <h1 className="mt-3 font-display text-3xl">New client</h1>
      </div>
      <AdminTrustedByEditor
        initial={emptyTrustedByClient()}
        saveAction={saveTrustedClient}
      />
    </div>
  );
}
