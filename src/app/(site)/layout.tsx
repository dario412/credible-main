import { CreatorMarqueeFacesProvider } from "@/components/creator-faces-marquee-context";
import { PeptalkTrackingCapture } from "@/components/peptalk-tracking";
import { SiteChromeProvider } from "@/components/site-chrome-context";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { getSiteChrome } from "@/lib/actions/admin-cms";
import { loadCreatorMarqueeFaces } from "@/lib/roster-preview-server";

export const dynamic = "force-dynamic";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const chrome = await getSiteChrome();
  const marqueeFaces = await loadCreatorMarqueeFaces();

  return (
    <SiteChromeProvider initialChrome={chrome}>
      <CreatorMarqueeFacesProvider faces={marqueeFaces}>
        <PeptalkTrackingCapture />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </CreatorMarqueeFacesProvider>
    </SiteChromeProvider>
  );
}
