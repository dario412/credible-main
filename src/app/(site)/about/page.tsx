import { AboutVisualEditor } from "@/components/about-visual-editor";
import { getAboutPageSections, saveAboutPage } from "@/lib/actions/admin-cms";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { loadHeroCast } from "@/lib/roster-preview-server";
import { createMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = createMetadata({
  title: "About",
  description:
    "Credible Creators is a management agency for founders, operators and trusted voices in the expert economy.",
  path: "/about",
});

export default async function AboutPage() {
  const [sections, session, members] = await Promise.all([
    getAboutPageSections(),
    auth(),
    loadHeroCast(),
  ]);
  const canEdit = Boolean(
    session?.user && hasPermission(session.user.role, "MANAGE_CONTENT"),
  );

  return (
    <AboutVisualEditor
      initial={sections}
      members={members}
      canEdit={canEdit}
      saveAction={saveAboutPage}
    />
  );
}
