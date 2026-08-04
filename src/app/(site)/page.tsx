import { HomeVisualEditor } from "@/components/home-visual-editor";
import { LatestInsights } from "@/components/latest-insights";
import { loadRosterPreviewCards } from "@/lib/roster-preview-server";
import {
  getHomePageSections,
  saveHomePage,
} from "@/lib/actions/admin-cms";
import { saveTrustedClientsList } from "@/lib/actions/admin-trusted-by";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { createMetadata } from "@/lib/seo";
import { loadTrustedClients } from "@/lib/trusted-by-server";

export const dynamic = "force-dynamic";

export const metadata = createMetadata({
  path: "/",
  description:
    "Book B2B creators for your brand. Credible represents the founders, operators, investors and specialists whose voices your buyers already trust.",
});

export default async function HomePage() {
  const [home, session, rosterCards, trustedClients] = await Promise.all([
    getHomePageSections(),
    auth(),
    loadRosterPreviewCards(),
    loadTrustedClients(),
  ]);
  const canEdit = Boolean(
    session?.user && hasPermission(session.user.role, "MANAGE_CONTENT"),
  );

  return (
    <>
      <HomeVisualEditor
        initial={home}
        initialTrustedClients={trustedClients}
        canEdit={canEdit}
        rosterCards={rosterCards}
        saveAction={saveHomePage}
        saveTrustedByAction={saveTrustedClientsList}
      />
      <LatestInsights />
    </>
  );
}
