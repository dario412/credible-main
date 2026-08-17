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
import { V2_BRIEF, V2_WHAT_WE_DO } from "@/lib/v2-links";

export const dynamic = "force-dynamic";

export const metadata = createMetadata({
  title: "What we do v2",
  path: V2_WHAT_WE_DO,
  noIndex: true,
  description:
    "Four ways to put an expert voice behind your brand — content, brand partnerships, speaking, and live events.",
});

const FORMATS = [
  { title: "Content", note: "expert-led series and editorial programs" },
  { title: "Brand partnerships", note: "sponsored formats with credible fit" },
  { title: "Speaking", note: "keynotes, firesides, and category POV" },
  { title: "Live", note: "hosted events and executive programming" },
];

const MOMENTS = [
  {
    label: "Launch or reposition",
    title: "Borrow category trust",
    body: "Use expert-led content and partnerships to make a new idea feel understood and credible.",
  },
  {
    label: "Educate buyers",
    title: "Create useful authority",
    body: "Build repeatable formats that help prospects think through problems before a sales conversation.",
  },
  {
    label: "Move a room",
    title: "Make live moments matter",
    body: "Use speakers, hosts, and programming to turn events into trusted buyer experiences.",
  },
];

const SERVICES = [
  {
    n: "01",
    title: "Expert content series",
    body: "Newsletters, video, reports, webinars, and editorial franchises that turn expert POV into repeatable demand assets.",
  },
  {
    n: "02",
    title: "Brand partnerships",
    body: "Creator-led campaigns, integrations, and ambassador terms scoped around fit, not reach alone.",
  },
  {
    n: "03",
    title: "Speaking & keynotes",
    body: "Keynotes, panels, firesides, and category briefings delivered by credible operators and specialists.",
  },
  {
    n: "04",
    title: "Live events & programming",
    body: "Hosted roundtables, executive forums, community moments, and custom stages with an expert voice at the center.",
  },
];

const DELIVERY = [
  { title: "Brief shaping", body: "Translate goals into the right voice, format, and scope." },
  { title: "Talent matching", body: "Shortlist experts by audience, authority, and category fit." },
  { title: "Commercial terms", body: "Scope, pricing, usage, and deliverables handled clearly." },
  { title: "Production support", body: "Timelines, approvals, logistics, and delivery managed end to end." },
];

const DECISIONS = [
  {
    q: "Keep one page while buyers are exploring.",
    a: "It lets brand, event, and content buyers understand the whole operating model before choosing a route.",
  },
  {
    q: "Add child pages when a service has proof.",
    a: "Dedicated pages should earn their place with case studies, search intent, and specific conversion offers.",
  },
  {
    q: "Use campaigns to test demand first.",
    a: "If speaking, content, or partnerships start converting independently, split them into landing pages later.",
  },
];

const PROOF = [
  {
    image: "/images/insights/operator-creator.jpg",
    label: "Content",
    title: "A recurring expert series buyers save.",
    body: "Use when the goal is education, category creation, or pipeline nurture.",
  },
  {
    image: "/images/case-studies/hubspot.jpg",
    label: "Partnerships",
    title: "A credible voice attached to the right story.",
    body: "Use when your message needs trust transfer, not just media reach.",
  },
  {
    image: "/images/experts/alex-lieberman-stage.png",
    label: "Speaking",
    title: "A room anchored by operator credibility.",
    body: "Use for executive audiences, category moments, and customer events.",
  },
  {
    image: "/images/case-studies/stripe.jpg",
    label: "Live",
    title: "A programmed moment people talk about after.",
    body: "Use for launches, private forums, field events, and hosted salons.",
  },
];

export default function V2WhatWeDoPage() {
  return (
    <V2Chrome>
      <V2PageHero
        badge="One page, four ways to work"
        live
        headline="Put an expert voice behind the moments that move buyers."
        subhead="Credible helps B2B teams work with founders, operators, investors, and specialists across content, partnerships, speaking, and live programming — with strategy, scope, pricing, and delivery managed end to end."
        actions={
          <div className="flex flex-wrap items-center gap-3.5">
            <V2PrimaryLink href={V2_BRIEF}>Send a brand brief</V2PrimaryLink>
            <V2GhostLink href="/roster">Explore the roster</V2GhostLink>
          </div>
        }
        aside={
          <V2AsideCard
            label="CRO architecture"
            title="Keep the offer together until demand splits it apart."
          >
            {[
              "Buyers can compare services without choosing a path too early.",
              "Proof, positioning, and CTAs compound on one page.",
              "Service landing pages can come later for SEO and paid campaigns.",
            ].map((item, index) => (
              <div
                key={item}
                className="grid grid-cols-[32px_1fr] gap-3 border-b border-[var(--v2-rule-evergreen)] py-[18px] last:border-b-0"
              >
                <p className="text-[16px] leading-5 font-semibold text-[var(--v2-snow)]">
                  0{index + 1}
                </p>
                <p className="text-[15px] leading-6 text-[var(--v2-on-dark)]">{item}</p>
              </div>
            ))}
          </V2AsideCard>
        }
      />

      <section className="bg-[var(--v2-snow)] pb-6">
        <div className="v2-container grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {FORMATS.map((item, index) => (
            <div
              key={item.title}
              className={`flex min-h-[200px] flex-col justify-between rounded-[16px] px-7 py-8 ${
                index % 2 === 0
                  ? "bg-[var(--v2-glacier)]"
                  : "border border-[var(--v2-rule-light)] bg-[var(--v2-snow)]"
              }`}
            >
              <p className="text-[13px] leading-4 font-medium tracking-[0.08em] text-[var(--v2-ember)]">
                {String(index + 1).padStart(2, "0")}
              </p>
              <div>
                <p className="v2-display text-[32px] leading-10 tracking-[-0.02em] text-[var(--v2-timberline)]">
                  {item.title}
                </p>
                <p className="mt-2.5 text-[14px] leading-[22px] text-[var(--v2-lichen)]">
                  {item.note}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[var(--v2-timberline)] py-[130px]">
        <div className="v2-container flex flex-col gap-[54px]">
          <div className="grid items-end gap-10 lg:grid-cols-[1fr_450px] lg:gap-[90px]">
            <h2 className="v2-display text-[clamp(2.2rem,3.5vw,3.35rem)] leading-[1.03] text-[var(--v2-snow)]">
              {["Choose by business moment,", "not by content format."].map(
                (line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ),
              )}
            </h2>
            <p className="text-[18px] leading-[30px] text-[var(--v2-on-dark)]">
              The page should help a buyer recognize their goal first, then understand the right service mix.
            </p>
          </div>
          <div className="grid overflow-hidden rounded-[16px] border border-[var(--v2-rule-evergreen)] bg-[var(--v2-rule-evergreen)] md:grid-cols-3">
            {MOMENTS.map((item) => (
              <div key={item.title} className="flex flex-col gap-5 bg-[var(--v2-surface)] p-8">
                <p className="text-[13px] leading-4 font-semibold tracking-[0.08em] text-[var(--v2-snow)] uppercase">
                  {item.label}
                </p>
                <p className="text-[26px] leading-8 font-semibold text-[var(--v2-snow)]">
                  {item.title}
                </p>
                <p className="text-[15px] leading-[25px] text-[var(--v2-on-dark)]">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--v2-snow)] py-[150px]">
        <div className="v2-container grid items-start gap-16 lg:grid-cols-[430px_1fr]">
          <div>
            <V2Eyebrow>Services</V2Eyebrow>
            <h2 className="v2-display mt-3.5 text-[clamp(2.2rem,3.2vw,2.85rem)] leading-[1.03] text-[var(--v2-timberline)]">
              {["Four ways to put", "credibility to work."].map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
            <p className="mt-6 text-[18px] leading-[30px] text-[var(--v2-lichen)]">
              One page lets a buyer see the full menu and understand that most strong programs combine more than one format.
            </p>
          </div>
          <div className="grid gap-[18px] sm:grid-cols-2">
            {SERVICES.map((item) => (
              <div
                key={item.n}
                className="rounded-[16px] border border-[var(--v2-rule-light)] bg-[var(--v2-snow)] p-[30px] shadow-[0_1px_2px_rgba(14,26,20,0.06),0_16px_40px_rgba(14,26,20,0.08)]"
              >
                <p className="text-[13px] leading-4 font-semibold tracking-[0.08em] text-[var(--v2-ember)] uppercase">
                  {item.n}
                </p>
                <p className="mt-3.5 text-[26px] leading-8 font-semibold text-[var(--v2-timberline)]">
                  {item.title}
                </p>
                <p className="mt-3.5 text-[15px] leading-[25px] text-[var(--v2-lichen)]">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--v2-snow)] pb-[150px]">
        <div className="v2-container grid gap-8 lg:grid-cols-[1fr_408px]">
          <div className="overflow-hidden rounded-[16px] border border-[var(--v2-rule-light)] shadow-[0_1px_2px_rgba(14,26,20,0.06),0_16px_40px_rgba(14,26,20,0.08)]">
            <div className="border-b border-[var(--v2-rule-light)] px-10 py-8">
              <V2Eyebrow>Managed delivery</V2Eyebrow>
              <h2 className="v2-display mt-3 text-[clamp(2rem,3vw,3.5rem)] leading-[1.07] text-[var(--v2-timberline)]">
                The value is not just access. It is everything around the access.
              </h2>
            </div>
            <div className="grid sm:grid-cols-2">
              {DELIVERY.map((item, index) => (
                <div
                  key={item.title}
                  className={`px-[34px] py-7 ${index < 2 ? "border-b border-[var(--v2-rule-light)]" : ""} ${index % 2 === 0 ? "sm:border-r sm:border-[var(--v2-rule-light)]" : ""}`}
                >
                  <p className="text-[20px] leading-7 font-semibold text-[var(--v2-timberline)]">
                    {item.title}
                  </p>
                  <p className="mt-2.5 text-[15px] leading-[25px] text-[var(--v2-lichen)]">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <aside className="flex flex-col gap-6 rounded-[16px] border border-[var(--v2-rule-light)] bg-[var(--v2-glacier)] p-[30px] shadow-[0_1px_2px_rgba(14,26,20,0.06),0_16px_40px_rgba(14,26,20,0.08)]">
            <V2Eyebrow>Best next step</V2Eyebrow>
            <p className="v2-display text-[24px] leading-[30px] tracking-[-0.02em] text-[var(--v2-timberline)]">
              {["Send one brief.", "We recommend the service mix."].map(
                (line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ),
              )}
            </p>
            <p className="text-[15px] leading-[25px] text-[var(--v2-lichen)]">
              The buyer should not need to self-diagnose perfectly before starting.
            </p>
            <V2PrimaryLink href={V2_BRIEF} className="mt-auto w-full">
              Send a brand brief
            </V2PrimaryLink>
          </aside>
        </div>
      </section>

      <section className="bg-[var(--v2-glacier)] py-[130px]">
        <div className="v2-container grid items-start gap-16 lg:grid-cols-[430px_1fr] lg:gap-[110px]">
          <div>
            <V2Eyebrow>How we decide</V2Eyebrow>
            <h2 className="v2-display mt-3.5 text-[clamp(2.2rem,3.2vw,2.85rem)] leading-[1.03] text-[var(--v2-timberline)]">
              {["When child pages", "become useful."].map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
            <p className="mt-6 text-[18px] leading-[30px] text-[var(--v2-lichen)]">
              This keeps the growth path clear without fragmenting the first buying journey.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {DECISIONS.map((item, index) => (
              <div
                key={item.q}
                className="grid grid-cols-[1fr_auto] items-start gap-6 rounded-[16px] border border-[var(--v2-rule-light)] bg-[var(--v2-snow)] px-7 py-7 shadow-[0_1px_2px_rgba(14,26,20,0.06),0_10px_28px_rgba(14,26,20,0.06)]"
              >
                <div>
                  <p className="text-[13px] leading-4 font-medium tracking-[0.08em] text-[var(--v2-ember)]">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <p className="v2-display mt-2.5 text-[24px] leading-[30px] tracking-[-0.02em] text-[var(--v2-timberline)]">
                    {item.q}
                  </p>
                  <p className="mt-3 text-[16px] leading-[26px] text-[var(--v2-timberline)]/70">
                    {item.a}
                  </p>
                </div>
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--v2-evergreen)] text-[15px] font-medium text-[var(--v2-snow)]">
                  ✓
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--v2-snow)] py-[150px]">
        <div className="v2-container flex flex-col gap-[42px]">
          <div className="grid items-end gap-10 lg:grid-cols-[510px_1fr] lg:gap-[92px]">
            <div>
              <p className="text-[13px] leading-4 font-bold tracking-[0.08em] text-[var(--v2-evergreen)] uppercase">
                Proof by service
              </p>
              <h2 className="v2-display mt-3.5 text-[clamp(2.2rem,3.2vw,2.75rem)] leading-[1.03] text-[var(--v2-timberline)]">
                {["Make the offer tangible", "before the brief."].map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h2>
            </div>
            <p className="max-w-[560px] text-[18px] leading-[30px] text-[var(--v2-lichen)]">
              A stronger What We Do page needs examples of what each service becomes in market. These modules create enough specificity for conversion without forcing separate service pages yet.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PROOF.map((item) => (
              <article
                key={item.label}
                className="overflow-hidden rounded-[16px] border border-[var(--v2-rule-light)] bg-[var(--v2-snow)] shadow-[0_1px_2px_rgba(14,26,20,0.06),0_16px_40px_rgba(14,26,20,0.08)]"
              >
                <div className="relative h-[188px] bg-[var(--v2-glacier)]">
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-[22px]">
                  <p className="text-[13px] leading-4 font-bold tracking-[0.08em] text-[var(--v2-evergreen)] uppercase">
                    {item.label}
                  </p>
                  <p className="mt-2.5 text-[22px] leading-7 font-semibold text-[var(--v2-timberline)]">
                    {item.title}
                  </p>
                  <p className="mt-3 text-[14px] leading-[23px] text-[var(--v2-lichen)]">
                    {item.body}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </V2Chrome>
  );
}
