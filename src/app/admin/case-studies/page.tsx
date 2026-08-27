import Link from "next/link";
import { redirect } from "next/navigation";

import { AdminDeleteButton } from "@/components/admin-delete-button";
import { auth } from "@/lib/auth";
import { listCaseStudyCards } from "@/lib/actions/admin-cms";
import { formatCaseStudyPillars } from "@/lib/case-studies";
import { hasPermission } from "@/lib/permissions";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Projects CMS",
  path: "/admin/case-studies",
  noIndex: true,
});

export default async function AdminCaseStudiesPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (!hasPermission(session.user.role, "MANAGE_CONTENT")) redirect("/admin");

  const studies = await listCaseStudyCards();

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">Projects</h1>
          <p className="mt-2 text-sm text-muted">
            Edit project pages shown on the marketing site.
          </p>
        </div>
        <Link
          href="/admin/case-studies/new"
          className="inline-flex items-center rounded-sm bg-forest px-4 py-2.5 text-sm font-medium text-cream hover:bg-forest-dark"
        >
          New project
        </Link>
      </div>

      <div className="overflow-hidden rounded-sm border border-charcoal/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-charcoal/10 bg-[#f4f2ef] text-[0.7rem] tracking-[0.08em] text-charcoal/50 uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Client</th>
              <th className="px-4 py-3 font-medium">Pillars</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {studies.map((study) => (
              <tr
                key={study.slug}
                className="border-b border-charcoal/8 last:border-0"
              >
                <td className="px-4 py-3 font-medium">
                  {study.title}
                  {study.featured ? (
                    <span className="ml-2 text-[0.65rem] tracking-wide text-forest uppercase">
                      Featured
                    </span>
                  ) : null}
                </td>
                <td className="px-4 py-3 text-charcoal/60">{study.client}</td>
                <td className="px-4 py-3 text-charcoal/60">
                  {formatCaseStudyPillars(study)}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex items-center gap-4">
                    <Link
                      href={`/admin/case-studies/${study.slug}`}
                      className="font-medium text-forest hover:text-forest-dark"
                    >
                      Edit
                    </Link>
                    <AdminDeleteButton
                      kind="caseStudy"
                      value={study.slug}
                      label={study.title}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {studies.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-10 text-center text-sm text-muted"
                >
                  No projects in the database yet. Run seed or create one.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
