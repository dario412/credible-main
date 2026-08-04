import Link from "next/link";
import { redirect } from "next/navigation";

import { HomePageEditorForm } from "@/components/admin-home-page-editor";
import { getHomePageSections, saveHomePage } from "@/lib/actions/admin-cms";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
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

  const sections = await getHomePageSections();

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
      </div>
      <HomePageEditorForm initial={sections} saveAction={saveHomePage} />
    </div>
  );
}
