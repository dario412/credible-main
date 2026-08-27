import Link from "next/link";
import { redirect } from "next/navigation";

import { HomePageEditorForm } from "@/components/admin-home-page-editor";
import { getHomePageSections, saveHomePage } from "@/lib/actions/admin-cms";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { loadHeroCast } from "@/lib/roster-preview-server";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Edit Home",
  path: "/admin/pages/home",
  noIndex: true,
});

export default async function AdminHomePageEditor() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (!hasPermission(session.user.role, "MANAGE_CONTENT")) redirect("/admin");

  const [sections, rosterOptions] = await Promise.all([
    getHomePageSections(),
    loadHeroCast(),
  ]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          href="/admin/pages"
          className="text-sm text-charcoal/55 hover:text-charcoal"
        >
          ← Pages
        </Link>
        <h1 className="mt-3 font-display text-3xl">Home</h1>
        <p className="mt-2 text-sm text-muted">
          Or edit live on the site with{" "}
          <a href="/" className="font-medium text-forest hover:text-forest-dark">
            Edit page
          </a>
          . Header, footer, and nav live under{" "}
          <a
            href="/admin/pages/site"
            className="font-medium text-forest hover:text-forest-dark"
          >
            Header & footer
          </a>
          . Client logos are managed in{" "}
          <a
            href="/admin/trusted-by"
            className="font-medium text-forest hover:text-forest-dark"
          >
            Homepage logos
          </a>
          .
        </p>
      </div>
      <HomePageEditorForm
        initial={sections}
        rosterOptions={rosterOptions.map((member) => ({
          slug: member.slug,
          name: member.name,
        }))}
        saveAction={saveHomePage}
      />
    </div>
  );
}
