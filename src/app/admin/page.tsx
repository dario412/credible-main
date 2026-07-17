import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";
import { cn } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (!session.user.totpEnabled) redirect("/admin/setup-2fa");

  const [leadCount, newLeads, contactLeads, waitlistLeads, recent, userCount] =
    await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({ where: { status: "NEW" } }),
      prisma.lead.count({ where: { source: "CONTACT" } }),
      prisma.lead.count({ where: { source: "WAITLIST" } }),
      prisma.lead.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
      }),
      prisma.user.count({ where: { active: true } }),
    ]);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-muted">
            Overview of inbound leads and account activity
          </p>
        </div>
        {hasPermission(session.user.role, "VIEW_LEADS") ? (
          <Link
            href="/admin/leads"
            className="inline-flex h-9 items-center rounded-md bg-forest px-3.5 text-sm font-medium text-cream transition-colors hover:bg-forest-dark"
          >
            Open leads
          </Link>
        ) : null}
      </div>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total submissions" value={leadCount} />
        <StatCard label="Needs review" value={newLeads} accent={newLeads > 0} />
        <StatCard label="Waitlist" value={waitlistLeads} />
        <StatCard label="Contact form" value={contactLeads} />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="overflow-hidden rounded-lg border border-charcoal/10 bg-white lg:col-span-2">
          <div className="flex h-12 items-center justify-between border-b border-charcoal/10 px-4">
            <h2 className="text-sm font-semibold">Recent submissions</h2>
            {hasPermission(session.user.role, "VIEW_LEADS") ? (
              <Link
                href="/admin/leads"
                className="text-xs font-medium text-forest hover:text-forest-dark"
              >
                View all
              </Link>
            ) : null}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="border-b border-charcoal/8 bg-[#faf9f7] text-[11px] font-medium uppercase tracking-wide text-muted">
                  <th className="px-4 py-2.5">Contact</th>
                  <th className="px-4 py-2.5">Source</th>
                  <th className="px-4 py-2.5">Status</th>
                  <th className="px-4 py-2.5">Received</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b border-charcoal/5 last:border-0 hover:bg-[#faf9f7]"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/leads/${lead.id}`}
                        className="font-medium hover:text-forest"
                      >
                        {lead.email}
                      </Link>
                      {lead.name ? (
                        <p className="text-xs text-muted">{lead.name}</p>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 capitalize text-muted">
                      {lead.source.toLowerCase()}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={lead.status} />
                    </td>
                    <td className="px-4 py-3 tabular-nums text-muted">
                      {lead.createdAt.toLocaleString("en-GB", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
                {recent.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-10 text-center text-sm text-muted">
                      No submissions yet.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-charcoal/10 bg-white p-4">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
              Active users
            </p>
            <p className="mt-2 text-3xl font-semibold tabular-nums tracking-tight">
              {userCount}
            </p>
            {hasPermission(session.user.role, "MANAGE_USERS") ? (
              <Link
                href="/admin/users"
                className="mt-4 inline-block text-sm font-medium text-forest hover:text-forest-dark"
              >
                Manage users
              </Link>
            ) : null}
          </div>

          <div className="rounded-lg border border-charcoal/10 bg-white p-4">
            <p className="text-sm font-semibold">Shortcuts</p>
            <ul className="mt-3 space-y-2 text-sm text-charcoal/75">
              <li>
                <Link href="/" className="hover:text-forest">
                  Public website
                </Link>
              </li>
              <li>
                <Link href="/admin/style-guide" className="hover:text-forest">
                  Style guide
                </Link>
              </li>
              {hasPermission(session.user.role, "VIEW_LEADS") ? (
                <li>
                  <Link href="/admin/leads?status=NEW" className="hover:text-forest">
                    New leads queue
                  </Link>
                </li>
              ) : null}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="rounded-lg border border-charcoal/10 bg-white p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
          {label}
        </p>
        {accent ? (
          <span className="h-1.5 w-1.5 rounded-full bg-forest" aria-hidden />
        ) : null}
      </div>
      <p className="mt-3 text-3xl font-semibold tabular-nums tracking-tight">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-5 items-center rounded px-1.5 text-[10px] font-semibold uppercase tracking-wide",
        status === "NEW" && "bg-forest/10 text-forest",
        status === "READ" && "bg-charcoal/5 text-charcoal/65",
        status === "ARCHIVED" && "bg-taupe/50 text-muted",
      )}
    >
      {status}
    </span>
  );
}
