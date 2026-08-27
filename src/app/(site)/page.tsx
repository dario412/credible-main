import { HomeVisualEditor } from "@/components/home-visual-editor";
import { LatestInsights } from "@/components/latest-insights";
import {
  loadHeroCast,
  loadRosterCards,
} from "@/lib/roster-preview-server";
import {
  getHomePageSections,
  getSiteChrome,
  saveHomePage,
  saveSiteChrome,
} from "@/lib/actions/admin-cms";
import { saveTrustedClientsList } from "@/lib/actions/admin-trusted-by";
import { auth } from "@/lib/auth";
import { loadCaseStudyLinkOptions } from "@/lib/case-studies-server";
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
  const [
    home,
    chrome,
    session,
    rosterCards,
    heroCast,
    trustedClients,
    caseStudyOptions,
  ] = await Promise.all([
    getHomePageSections(),
    getSiteChrome(),
    auth(),
    loadRosterCards(),
    loadHeroCast(),
    loadTrustedClients(),
    loadCaseStudyLinkOptions(),
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
        caseStudyOptions={caseStudyOptions}
        saveAction={saveHomePage}
        saveChromeAction={saveSiteChrome}
        saveTrustedByAction={saveTrustedClientsList}
      />
      <LatestInsights />
    </>
  );
}
