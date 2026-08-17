import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Roster",
  path: "/admin/roster",
  noIndex: true,
});

export default async function AdminRosterPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (!hasPermission(session.user.role, "MANAGE_CONTENT")) redirect("/admin");

  const experts = await prisma.expert.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      title: true,
      airtableId: true,
      updatedAt: true,
    },
  });

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">Roster</h1>
          <p className="mt-2 text-sm text-muted">
            Creators currently on the website. Pull the latest records from
            Airtable with Sync.
          </p>
        </div>
        <Link
          href="/admin/sync"
          className="inline-flex items-center rounded-sm bg-forest px-4 py-2.5 text-sm font-medium text-cream hover:bg-forest-dark"
        >
          Sync from Airtable
        </Link>
      </div>

      <div className="overflow-hidden rounded-sm border border-charcoal/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-charcoal/10 bg-[#f4f2ef] text-[0.7rem] tracking-[0.08em] text-charcoal/50 uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Creator</th>
              <th className="px-4 py-3 font-medium">Source</th>
              <th className="px-4 py-3 font-medium">Updated</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {experts.map((expert) => (
              <tr
                key={expert.id}
                className="border-b border-charcoal/8 last:border-0"
              >
                <td className="px-4 py-3">
                  <p className="font-medium text-charcoal">{expert.name}</p>
                  <p className="text-xs text-muted">{expert.title}</p>
                </td>
                <td className="px-4 py-3 text-charcoal/60">
                  {expert.airtableId ? "Airtable" : "Local"}
                </td>
                <td className="px-4 py-3 text-charcoal/60">
                  {expert.updatedAt.toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/roster/${expert.slug}`}
                    className="font-medium text-forest hover:text-forest-dark"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
            {experts.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-10 text-center text-sm text-muted"
                >
                  No creators yet.{" "}
                  <Link
                    href="/admin/sync"
                    className="font-medium text-forest hover:text-forest-dark"
                  >
                    Sync from Airtable
                  </Link>{" "}
                  to pull the roster.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
