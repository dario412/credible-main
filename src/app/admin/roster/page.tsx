import { redirect } from "next/navigation";

import { AdminAirtableSyncPanel } from "@/components/admin-airtable-sync-panel";
import { getAirtableSyncStatus } from "@/lib/actions/admin-airtable-sync";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Roster sync",
  path: "/admin/roster",
  noIndex: true,
});

export default async function AdminRosterSyncPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (!hasPermission(session.user.role, "MANAGE_CONTENT")) redirect("/admin");

  const [status, expertCount, linkedCount] = await Promise.all([
    getAirtableSyncStatus(),
    prisma.expert.count(),
    prisma.expert.count({ where: { airtableId: { not: null } } }),
  ]);

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="font-display text-3xl">Roster</h1>
        <p className="mt-2 text-sm text-muted">
          Connect speakers from Airtable. {expertCount} experts in the database
          ({linkedCount} linked to Airtable).
        </p>
      </div>

      <AdminAirtableSyncPanel configured={status.configured} />
    </div>
  );
}
