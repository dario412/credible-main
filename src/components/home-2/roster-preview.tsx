import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/ssr";

import { RosterPreviewGrid } from "@/components/home-2/roster-preview-grid";
import type { RosterCardExpert } from "@/components/roster-card";
import { parseExpertChannels } from "@/lib/expert-channels";
import { prisma } from "@/lib/prisma";

const PREVIEW_COUNT = 4;

export async function RosterPreview() {
  const experts = await prisma.expert.findMany({
    orderBy: { name: "asc" },
    take: PREVIEW_COUNT,
  });

  if (experts.length === 0) return null;

  const cards: RosterCardExpert[] = experts.map((expert) => ({
    id: expert.id,
    slug: expert.slug,
    name: expert.name,
    shortBio: expert.shortBio,
    image: expert.image,
    role: expert.categories[0] ?? null,
    topics: expert.topics ?? [],
    combinedReach: expert.combinedReach,
    growth90d: expert.growth90d,
    audienceWho: expert.audienceWho,
    audienceWhere: expert.audienceWhere,
    channels: parseExpertChannels(expert.channels),
  }));

  return (
    <section className="bg-cream px-6 py-16 md:px-10 md:py-20 lg:px-12">
      <div className="mx-auto max-w-352">
        <div className="flex flex-col items-center text-center">
          <h2 className="max-w-3xl font-display text-[2.6rem] leading-[1.08] tracking-tight text-charcoal sm:text-[3.15rem] md:text-[3.65rem]">
            The roster, ready to brief.
          </h2>

          <p className="mt-5 max-w-xl text-[0.9rem] leading-relaxed text-charcoal/65 md:text-[0.95rem]">
            Twenty-four founders, operators, investors and specialists. Each
            profile carries reach data, past work and format-level pricing.
          </p>

          <Link
            href="/roster"
            className="group mt-8 inline-flex items-center justify-center gap-2 rounded-sm bg-forest px-6 py-3.5 text-[0.875rem] font-medium text-cream transition-colors hover:bg-forest-dark"
          >
            See all 24 creators
            <ArrowRight
              weight="bold"
              aria-hidden
              className="size-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        <RosterPreviewGrid cards={cards} />
      </div>
    </section>
  );
}
