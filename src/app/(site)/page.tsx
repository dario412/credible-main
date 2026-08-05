import { HomeVisualEditor } from "@/components/home-visual-editor";
import { LatestInsights } from "@/components/latest-insights";
import {
  loadHeroCast,
  loadRosterPreviewCards,
} from "@/lib/roster-preview-server";
import {
  getHomePageSections,
  getSiteChrome,
  saveHomePage,
  saveSiteChrome,
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
  const [home, chrome, session, rosterCards, heroCast, trustedClients] =
    await Promise.all([
      getHomePageSections(),
      getSiteChrome(),
      auth(),
      loadRosterPreviewCards(),
      loadHeroCast(),
      loadTrustedClients(),
    ]);
  const canEdit = Boolean(
    session?.user && hasPermission(session.user.role, "MANAGE_CONTENT"),
  );

  return (
    <>
      <HomeVisualEditor
        initial={home}
        initialChrome={chrome}
        initialTrustedClients={trustedClients}
        canEdit={canEdit}
        rosterCards={rosterCards}
        heroCast={heroCast}
        saveAction={saveHomePage}
        saveChromeAction={saveSiteChrome}
        saveTrustedByAction={saveTrustedClientsList}
      />
      <LatestInsights />
    </>
  );
}
