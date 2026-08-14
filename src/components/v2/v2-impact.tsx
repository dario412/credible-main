import { TwoToneDisplay } from "@/components/v2/v2-hero";
import { V2ImpactStats } from "@/components/v2/v2-impact-stats";
import type { HomePageSections } from "@/lib/cms";

export function V2Impact({ content }: { content: HomePageSections["impact"] }) {
  return (
    <section className="bg-[var(--v2-snow)] py-28">
      <div className="v2-container flex flex-col gap-20">
        <TwoToneDisplay
          as="h2"
          text={content.headline}
          className="max-w-[760px] text-[clamp(2.4rem,5vw,4rem)] leading-[1.03]"
        />
        <V2ImpactStats stats={content.stats} />
      </div>
    </section>
  );
}
