import { createMetadata } from "@/lib/seo";
import { TrustedBy } from "@/components/trusted-by";
import { CreatorMapHero } from "@/components/creator-map-hero";
import { WaysIn } from "@/components/ways-in";
import { ImpactStats } from "@/components/impact-stats";
import { KeyStudy } from "@/components/key-study";
import { LatestInsights } from "@/components/latest-insights";
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
      <CreatorMapHero />

      <TrustedBy />

      <WaysIn />

      <ImpactStats />

      <KeyStudy />

      <BrandBrief />

      <LatestInsights />
    </>
  );
}
