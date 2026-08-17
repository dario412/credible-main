import Link from "next/link";
import { redirect } from "next/navigation";

import { AdminAirtableSyncPanel } from "@/components/admin-airtable-sync-panel";
import { getAirtableSyncStatus } from "@/lib/actions/admin-airtable-sync";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Sync",
  path: "/admin/sync",
  noIndex: true,
});

export default async function AdminSyncPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (!hasPermission(session.user.role, "MANAGE_CONTENT")) redirect("/admin");

  const [status, expertCount, linkedCount, latest] = await Promise.all([
    getAirtableSyncStatus(),
    prisma.expert.count(),
    prisma.expert.count({ where: { airtableId: { not: null } } }),
    prisma.expert.findFirst({
      where: { airtableId: { not: null } },
      orderBy: { updatedAt: "desc" },
      select: { updatedAt: true },
    }),
  ]);

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="font-display text-3xl">Sync</h1>
        <p className="mt-2 text-sm text-muted">
          Match the website roster to Airtable. Sync adds new creators, updates
          existing ones, and removes anyone who is missing or archived.
        </p>
      </div>

      <section className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Creators on site" value={String(expertCount)} />
        <StatCard label="Linked to Airtable" value={String(linkedCount)} />
        <StatCard
          label="Last roster update"
          value={
            latest
              ? latest.updatedAt.toLocaleString("en-GB", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Never"
          }
        />
      </section>

      <AdminAirtableSyncPanel configured={status.configured} />

      <p className="text-sm text-muted">
        After a sync, review creators on{" "}
        <Link href="/admin/roster" className="font-medium text-forest hover:text-forest-dark">
          Roster
        </Link>{" "}
        or the public{" "}
        <Link href="/roster" className="font-medium text-forest hover:text-forest-dark">
          roster page
        </Link>
        .
      </p>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-charcoal/10 bg-white p-4">
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
        {label}
      </p>
      <p className="mt-2 text-lg font-semibold tracking-tight">{value}</p>
    </div>
  );
}
