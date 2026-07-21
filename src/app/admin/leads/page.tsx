import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";
import { createMetadata } from "@/lib/seo";
import type { LeadStatus } from "@/generated/prisma/client";

export const metadata = createMetadata({
  title: "Leads",
  path: "/admin/leads",
  noIndex: true,
});

type SearchParams = Promise<{ status?: string; q?: string }>;

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (!hasPermission(session.user.role, "VIEW_LEADS")) redirect("/admin");

  const params = await searchParams;
  const status = params.status as LeadStatus | undefined;
  const q = params.q?.trim();

  const leads = await prisma.lead.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(q
        ? {
            OR: [
              { email: { contains: q, mode: "insensitive" } },
              { name: { contains: q, mode: "insensitive" } },
              { company: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-display text-3xl">Form submissions</h1>
      <p className="mt-2 text-sm text-muted">
        All waitlist and contact form entries.
      </p>

      <form className="mt-8 flex flex-wrap gap-3">
        <input
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search email, name, company"
          className="border border-charcoal/30 bg-white px-3 py-2 text-sm"
        />
        <select
          name="status"
          defaultValue={status ?? ""}
          className="border border-charcoal/30 bg-white px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          <option value="NEW">NEW</option>
          <option value="READ">READ</option>
          <option value="ARCHIVED">ARCHIVED</option>
        </select>
        <button
          type="submit"
          className="rounded-sm bg-forest px-4 py-2 text-sm text-white hover:bg-forest-dark"
        >
          Filter
        </button>
      </form>

      <div className="mt-6 overflow-x-auto border border-charcoal/10">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-charcoal/10 bg-cream-dark text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Source</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b border-charcoal/5">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/leads/${lead.id}`}
                    className="font-medium hover:text-forest"
                  >
                    {lead.email}
                  </Link>
                </td>
                <td className="px-4 py-3">{lead.name ?? "—"}</td>
                <td className="px-4 py-3 capitalize">
                  {lead.source.toLowerCase()}
                </td>
                <td className="px-4 py-3">{lead.status}</td>
                <td className="px-4 py-3 text-muted">
                  {lead.createdAt.toLocaleString("en-GB")}
                </td>
              </tr>
            ))}
            {leads.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-muted">
                  No submissions found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
