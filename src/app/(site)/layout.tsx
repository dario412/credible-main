import { HomeCmsProvider } from "@/components/home-cms-context";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { getHomePageSections } from "@/lib/actions/admin-cms";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const home = await getHomePageSections();

  return (
    <HomeCmsProvider initialFooter={home.footer}>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </HomeCmsProvider>
  );
}
