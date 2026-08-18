import { ApplyVisualEditor } from "@/components/apply-visual-editor";
import { getApplyPageSections, saveApplyPage } from "@/lib/actions/admin-cms";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { createMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = createMetadata({
  title: "Apply for representation",
  description:
    "Apply to join Credible Creators — commercial management for founders, operators, and expert voices with real B2B audiences.",
  path: "/apply-for-representation",
});

export default async function ApplyForRepresentationPage() {
  const [sections, session] = await Promise.all([
    getApplyPageSections(),
    auth(),
  ]);
  const canEdit = Boolean(
    session?.user && hasPermission(session.user.role, "MANAGE_CONTENT"),
  );

  return (
    <ApplyVisualEditor
      initial={sections}
      canEdit={canEdit}
      saveAction={saveApplyPage}
    />
  );
}
