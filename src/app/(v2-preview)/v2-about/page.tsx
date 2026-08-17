import Image from "next/image";

import { V2Chrome } from "@/components/v2/v2-chrome";
import {
  V2AsideCard,
  V2Eyebrow,
  V2GhostLink,
  V2PageHero,
  V2PrimaryLink,
} from "@/components/v2/v2-page-ui";
import { createMetadata } from "@/lib/seo";
import { V2_ABOUT, V2_APPLY, V2_BRIEF } from "@/lib/v2-links";

export const dynamic = "force-dynamic";

export const metadata = createMetadata({
  title: "About v2",
  path: V2_ABOUT,
  noIndex: true,
  description:
    "Credible Creators is a management agency for founders, operators and trusted voices in the expert economy.",
});

const STATS = [
  {
    value: "24",
    accent: false,
    title: "represented expert voices",
    note: "Founders, operators, investors, and category specialists.",
  },
  {
    value: "4",
    accent: true,
    title: "formats managed end to end",
    note: "The work is packaged around trust, not inventory.",
  },
  {
    value: "B2B",
    accent: false,
    title: "audiences and buyer contexts",
    note: "Built for professional decisions, not passive reach.",
  },
  {
    value: "1:1",
    accent: false,
    title: "manager attention",
    note: "No self-serve listings, no marketplace inbox.",
  },
];

const MODEL = [
  {
    title: "Talent management",
    body: "Named managers protect positioning, bandwidth, and deal quality.",
  },
  {
    title: "Brand strategy",
    body: "Briefs are shaped around audience trust, not forced into generic creator formats.",
  },
  {
    title: "Commercial operations",
    body: "Scope, pricing, contracts, timelines, and delivery stay managed end to end.",
  },
  {
    title: "PepTalk infrastructure",
    body: "Backed by the same team placing expert voices into high-stakes brand and event moments.",
  },
];

const ARCHETYPES = [
  {
    image: "/images/experts/alex-lieberman-stage.png",
    label: "Founders & operators",
    title: "Commercial work shaped around judgment.",
  },
  {
    image: "/images/experts/amara-chen.jpg",
    label: "Category specialists",
    title: ["Expertise that can hold a room", "and a buying committee."],
    featured: true,
  },
  {
    image: "/images/experts/lena-weiss.jpg",
    label: "Speakers & hosts",
    title: "Presence for high-trust moments.",
  },
];

export default function V2AboutPage() {
  return (
    <V2Chrome>
      <V2PageHero
        badge="A PepTalk company"
        headline={
          <>
            <span className="block">We represent the people</span>
            <span className="block">buyers already trust.</span>
          </>
        }
        headlineClassName="text-[clamp(2.6rem,5vw,4rem)]"
        subhead="Credible Creators is a management agency for the expert economy: founders, operators, investors, and specialists whose voices shape how professional audiences think, buy, and build."
        actions={
          <div className="flex flex-wrap items-center gap-3.5">
            <V2PrimaryLink href="/roster">Work with our roster</V2PrimaryLink>
            <V2GhostLink href={V2_APPLY}>Apply for representation</V2GhostLink>
          </div>
        }
        aside={
          <V2AsideCard label="The thesis" title="Expertise is the new distribution.">
            <p className="pt-4 text-[15px] leading-[25px] text-[var(--v2-on-dark)]">
              Reach is easy to buy. Credibility is not. We help brands work with operators who already have trust in the room, and help creators turn that trust into durable commercial work.
            </p>
          </V2AsideCard>
        }
      />

      <section className="bg-[var(--v2-snow)] pt-28 pb-[118px]">
        <div className="v2-container flex flex-col gap-[74px]">
          <div className="grid items-end gap-12 lg:grid-cols-[minmax(0,760px)_minmax(320px,408px)] lg:gap-20">
            <h2 className="v2-display max-w-[760px] text-[clamp(2.2rem,4vw,4rem)] leading-[1.03] text-[var(--v2-timberline)]">
              Credible gives expert voices{" "}
              <span className="text-[var(--v2-evergreen)]">commercial leverage.</span>
            </h2>
            <div className="pt-[26px]">
              <p className="text-[11px] leading-[14px] font-bold tracking-[0.08em] text-[var(--v2-ember)] uppercase">
                Operating model
              </p>
              <p className="mt-3.5 text-[18px] leading-7 font-medium text-[var(--v2-evergreen)]">
                A smaller roster creates better fit, better pricing, and more credible work for both sides of the market.
              </p>
            </div>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((stat) => (
              <div
                key={stat.title}
                className="flex min-h-[190px] flex-col border-t border-[var(--v2-rule-light)] pt-7 pr-8"
              >
                <p
                  className={`v2-display text-[clamp(3rem,6vw,4.75rem)] leading-none tracking-[-0.02em] ${stat.accent ? "text-[var(--v2-ember)]" : "text-[var(--v2-timberline)]"}`}
                >
                  {stat.value}
                </p>
                <p className="mt-[18px] max-w-[250px] text-[15px] leading-[22px] font-semibold text-[var(--v2-timberline)]">
                  {stat.title}
                </p>
                <p className="mt-2 max-w-[250px] text-[13px] leading-5 text-[var(--v2-lichen)]">
                  {stat.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--v2-timberline)] py-[130px]">
        <div className="v2-container flex flex-col gap-14">
          <div className="max-w-[40rem]">
            <p className="text-[13px] leading-4 font-semibold tracking-[0.08em] text-[var(--v2-snow)] uppercase">
              Why we exist
            </p>
            <h2 className="v2-display mt-4 text-[clamp(1.85rem,3vw,2.6rem)] leading-[1.12] text-[var(--v2-snow)]">
              <span className="block">The creator economy grew up.</span>
              <span className="block">Representation has to grow up with it.</span>
            </h2>
          </div>
          <div className="grid gap-10 md:grid-cols-3 md:gap-12">
            <p className="text-[17px] leading-[30px] text-[var(--v2-on-dark)]">
              The most valuable creators in B2B are not entertainers chasing attention. They are practitioners with judgment: people who have built companies, led functions, allocated capital, or shaped a category.
            </p>
            <p className="text-[17px] leading-[30px] text-[var(--v2-on-dark)]">
              That kind of trust deserves a different commercial model. Credible gives expert voices the management layer they need — strategy, pricing, negotiation, delivery, and brand fit — without turning them into a marketplace profile.
            </p>
            <p className="text-[17px] leading-[30px] text-[var(--v2-snow)]">
              For brands, it means access to voices their buyers already respect. For creators, it means commercial work that compounds instead of interrupting the work that made them credible.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[var(--v2-snow)] py-[150px]">
        <div className="v2-container grid items-start gap-16 lg:grid-cols-[430px_1fr]">
          <div>
            <V2Eyebrow>Our model</V2Eyebrow>
            <h2 className="v2-display mt-3.5 text-[clamp(2.2rem,3.2vw,2.85rem)] leading-[1.03] text-[var(--v2-timberline)]">
              {["Selective by design,", "commercial by default."].map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
            <p className="mt-6 text-[18px] leading-[30px] text-[var(--v2-lichen)]">
              The business case is simple: a smaller roster creates better fit, better pricing, and better delivery.
            </p>
          </div>
          <div className="grid gap-[18px] sm:grid-cols-2">
            {MODEL.map((item) => (
              <div
                key={item.title}
                className="rounded-[16px] border border-[var(--v2-rule-light)] bg-[var(--v2-snow)] p-7 shadow-[0_1px_2px_rgba(14,26,20,0.06),0_16px_40px_rgba(14,26,20,0.08)]"
              >
                <p className="text-[22px] leading-7 font-semibold text-[var(--v2-timberline)]">
                  {item.title}
                </p>
                <p className="mt-3 text-[15px] leading-[25px] text-[var(--v2-lichen)]">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--v2-snow)] pb-[150px]">
        <div className="v2-container grid gap-8 lg:grid-cols-2">
          <div className="rounded-[16px] bg-[var(--v2-glacier)] p-[46px] shadow-[0_1px_2px_rgba(14,26,20,0.06),0_16px_40px_rgba(14,26,20,0.08)]">
            <p className="text-[13px] leading-4 font-semibold tracking-[0.08em] text-[var(--v2-evergreen-deep)] uppercase">
              For brands
            </p>
            <h2 className="v2-display mt-[18px] text-[clamp(2rem,3vw,3rem)] leading-[1.08] text-[var(--v2-timberline)]">
              Find the voice your buyers already believe.
            </h2>
            <p className="mt-[22px] text-[17px] leading-[29px] text-[var(--v2-lichen)]">
              We help teams turn expert trust into campaigns, content, speaking, and live moments that feel credible because they are.
            </p>
            <V2PrimaryLink href={V2_BRIEF} className="mt-[30px]">
              Send a brand brief
            </V2PrimaryLink>
          </div>
          <div className="rounded-[16px] bg-[var(--v2-evergreen)] p-[46px] shadow-[0_1px_2px_rgba(14,26,20,0.06),0_16px_40px_rgba(14,26,20,0.08)]">
            <p className="text-[13px] leading-4 font-semibold tracking-[0.08em] text-[var(--v2-glacier)] uppercase">
              For creators
            </p>
            <h2 className="v2-display mt-[18px] text-[clamp(2rem,3vw,3rem)] leading-[1.08] text-[var(--v2-snow)]">
              Turn authority into managed opportunity.
            </h2>
            <p className="mt-[22px] text-[17px] leading-[29px] text-[var(--v2-on-dark)]">
              If your audience trusts your judgment, we can help protect your time and build a more deliberate commercial path.
            </p>
            <V2GhostLink href={V2_APPLY} className="mt-[30px]">
              Apply for representation
            </V2GhostLink>
          </div>
        </div>
      </section>

      <section className="bg-[var(--v2-snow)] pb-[150px]">
        <div className="v2-container flex flex-col gap-[46px]">
          <div className="grid items-end gap-10 lg:grid-cols-[470px_1fr] lg:gap-[110px]">
            <div>
              <p className="text-[13px] leading-4 font-bold tracking-[0.08em] text-[var(--v2-evergreen)] uppercase">
                How credibility compounds
              </p>
              <h2 className="v2-display mt-3.5 text-[clamp(2.2rem,3.2vw,2.75rem)] leading-[1.03] text-[var(--v2-timberline)]">
                {["A roster with range,", "managed with restraint."].map(
                  (line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ),
                )}
              </h2>
            </div>
            <p className="max-w-[560px] text-[18px] leading-[30px] text-[var(--v2-lichen)]">
              The agency only works if the roster stays credible. That means every partnership, stage, and content program has to protect the expert&apos;s point of view while making the commercial opportunity easier to execute.
            </p>
          </div>
          <div className="grid gap-[18px] md:grid-cols-3">
            {ARCHETYPES.map((item) => (
              <div
                key={item.label}
                className="relative h-[430px] overflow-hidden rounded-[16px] bg-[var(--v2-glacier)] shadow-[0_1px_2px_rgba(14,26,20,0.06),0_16px_40px_rgba(14,26,20,0.08)]"
              >
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover object-top"
                />
                <div className="absolute inset-x-[18px] bottom-[18px] rounded-[8px] bg-[#0E1A14D1] p-[18px]">
                  <p className="text-[13px] leading-[18px] text-[var(--v2-on-dark)]">
                    {item.label}
                  </p>
                  <p
                    className={
                      item.featured
                        ? "v2-display mt-2 text-[22px] leading-7 tracking-[-0.02em] text-[var(--v2-snow)]"
                        : "mt-1.5 text-[22px] leading-7 font-semibold text-[var(--v2-snow)]"
                    }
                  >
                    {(Array.isArray(item.title) ? item.title : [item.title]).map(
                      (line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ),
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </V2Chrome>
  );
}
