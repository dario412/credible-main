import { HomeVisualEditor } from "@/components/home-visual-editor";
import { LatestInsights } from "@/components/latest-insights";
import { loadRosterPreviewCards } from "@/components/home-2/roster-preview";
import {
  getHomePageSections,
  saveHomePage,
} from "@/lib/actions/admin-cms";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { createMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = createMetadata({
  path: "/",
  description:
    "Book B2B creators for your brand. Credible represents the founders, operators, investors and specialists whose voices your buyers already trust.",
});

export default async function HomePage() {
  const [home, session, rosterCards] = await Promise.all([
    getHomePageSections(),
    auth(),
    loadRosterPreviewCards(),
  ]);
  const canEdit = Boolean(
    session?.user && hasPermission(session.user.role, "MANAGE_CONTENT"),
  );

  return (
    <>
      <HomeVisualEditor
        initial={home}
        canEdit={canEdit}
        rosterCards={rosterCards}
        saveAction={saveHomePage}
      />
      <LatestInsights />
    </>
  );
}
