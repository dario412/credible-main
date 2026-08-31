import { CreatorMarqueeFacesProvider } from "@/components/creator-faces-marquee-context";
import { PeptalkTrackingCapture } from "@/components/peptalk-tracking";
import { SiteChromeProvider } from "@/components/site-chrome-context";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { getSiteChrome } from "@/lib/actions/admin-cms";
import { loadFooterRosterNavLinks } from "@/lib/footer-roster-links";
import { loadCreatorMarqueeFaces } from "@/lib/roster-preview-server";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const chrome = await getSiteChrome();
  const rosterColumn = chrome.footer.columns.find(
    (column) => column.title.trim().toLowerCase() === "roster",
  );
  const allCreatorsLabel =
    rosterColumn?.links.find((link) => link.href === "/roster")?.label ??
    "All creators";
  const [rosterNavLinks, marqueeFaces] = await Promise.all([
    loadFooterRosterNavLinks(allCreatorsLabel),
    loadCreatorMarqueeFaces(),
  ]);

  return (
    <SiteChromeProvider initialChrome={chrome}>
      <CreatorMarqueeFacesProvider faces={marqueeFaces}>
        <PeptalkTrackingCapture />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter rosterNavLinks={rosterNavLinks} />
      </CreatorMarqueeFacesProvider>
    </SiteChromeProvider>
  );
}
