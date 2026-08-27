import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { AdminTrustedByEditor } from "@/components/admin-trusted-by-editor";
import {
  deleteTrustedClient,
  getTrustedClientCard,
  saveTrustedClient,
} from "@/lib/actions/admin-trusted-by";
import { auth } from "@/lib/auth";
import { loadCaseStudyLinkOptions } from "@/lib/case-studies-server";
import { hasPermission } from "@/lib/permissions";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Edit homepage logo",
  path: "/admin/trusted-by",
  noIndex: true,
});

export default async function AdminTrustedByEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (!hasPermission(session.user.role, "MANAGE_CONTENT")) redirect("/admin");

  const { id } = await params;
  const [client, caseStudyOptions] = await Promise.all([
    getTrustedClientCard(id),
    loadCaseStudyLinkOptions(),
  ]);
  if (!client) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          href="/admin/trusted-by"
          className="text-sm text-charcoal/55 hover:text-charcoal"
        >
          ← Homepage logos
        </Link>
        <h1 className="mt-3 font-display text-3xl">{client.name || "Client"}</h1>
      </div>
      <AdminTrustedByEditor
        initial={client}
        caseStudyOptions={caseStudyOptions}
        saveAction={saveTrustedClient}
        deleteAction={deleteTrustedClient}
      />
    </div>
  );
}
