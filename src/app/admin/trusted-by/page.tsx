import Link from "next/link";
import { redirect } from "next/navigation";

import { listTrustedClientCards } from "@/lib/actions/admin-trusted-by";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { createMetadata } from "@/lib/seo";
import { hasTrustedByStory } from "@/lib/trusted-by";

export const metadata = createMetadata({
  title: "Homepage logos",
  path: "/admin/trusted-by",
  noIndex: true,
});

export default async function AdminTrustedByPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (!hasPermission(session.user.role, "MANAGE_CONTENT")) redirect("/admin");

  const clients = await listTrustedClientCards();

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">Homepage logos</h1>
          <p className="mt-2 text-sm text-muted">
            Client logos and optional stories for the homepage Trusted by grid.
          </p>
        </div>
        <Link
          href="/admin/trusted-by/new"
          className="inline-flex items-center rounded-sm bg-forest px-4 py-2.5 text-sm font-medium text-cream hover:bg-forest-dark"
        >
          New client
        </Link>
      </div>

      <div className="overflow-hidden rounded-sm border border-charcoal/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-charcoal/10 bg-[#f4f2ef] text-[0.7rem] tracking-[0.08em] text-charcoal/50 uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Client</th>
              <th className="px-4 py-3 font-medium">Logo</th>
              <th className="px-4 py-3 font-medium">Testimonial</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {clients.map((client, index) => (
              <tr
                key={client.id ?? `${client.name}-${index}`}
                className="border-b border-charcoal/8 last:border-0"
              >
                <td className="px-4 py-3 font-medium">{client.name || "Untitled"}</td>
                <td className="max-w-[14rem] truncate px-4 py-3 text-charcoal/60">
                  {client.logoSrc || "—"}
                </td>
                <td className="px-4 py-3 text-charcoal/60">
                  {hasTrustedByStory(client) ? "Yes" : "Logo only"}
                </td>
                <td className="px-4 py-3 text-right">
                  {client.id ? (
                    <Link
                      href={`/admin/trusted-by/${client.id}`}
                      className="font-medium text-forest hover:text-forest-dark"
                    >
                      Edit
                    </Link>
                  ) : (
                    <span className="text-xs text-muted">Seed defaults</span>
                  )}
                </td>
              </tr>
            ))}
            {clients.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-10 text-center text-sm text-muted"
                >
                  No clients yet.{" "}
                  <Link href="/admin/trusted-by/new" className="text-forest">
                    Add one
                  </Link>
                  .
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
