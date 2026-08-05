import { SiteChromeProvider } from "@/components/site-chrome-context";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { getSiteChrome } from "@/lib/actions/admin-cms";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const chrome = await getSiteChrome();

  return (
    <SiteChromeProvider initialChrome={chrome}>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </SiteChromeProvider>
  );
}
