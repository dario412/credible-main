import { createMetadata } from "@/lib/seo";
import { TrustedBy } from "@/components/trusted-by";
import { LatestInsights } from "@/components/latest-insights";
import { Home2Hero } from "@/components/home-2/home-2-hero";
import { WaysInAccordion } from "@/components/home-2/ways-in-accordion";
import { RosterPreview } from "@/components/home-2/roster-preview";
import { ImpactStats } from "@/components/impact-stats";
import { KeyStudy } from "@/components/key-study";
import { BrandBrief } from "@/components/brand-brief";

export const dynamic = "force-dynamic";

export const metadata = createMetadata({
  path: "/",
  description:
    "Book B2B creators for your brand. Credible represents the founders, operators, investors and specialists whose voices your buyers already trust.",
});

export default function HomePage() {
  return (
    <>
      <Home2Hero />
      <TrustedBy />
      <WaysInAccordion />
      <RosterPreview />
      <ImpactStats />
      <KeyStudy variant="full" />
      <BrandBrief variant="boxed" />
      <LatestInsights />
    </>
  );
}
