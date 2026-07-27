import Image from "next/image";
import Link from "next/link";

import { PatternField } from "@/components/pattern-field";
import { StatCounter } from "@/components/stat-counter";
import { cn } from "@/lib/utils";

const CREAM_RGB = { r: 249, g: 243, b: 239 };

const boxedMetrics = [
  {
    label: "Episodes shipped",
    value: "12",
    caption: "Video + audio + written",
  },
  {
    label: "Total downloads",
    value: "4.1M",
    caption: "Across all channels",
  },
  {
    label: "Pipeline attributed",
    value: "$18.4M",
    caption: "Notion, first-touch attribution",
  },
  {
    label: "Partnership term",
    value: "22mo",
    caption: "Currently renewed through 2027",
  },
] as const;

const fullMetrics = [
  {
    value: "12",
    label: "Episodes shipped end-to-end — zero studio overhead",
  },
  {
    value: "4.1M",
    label: "Downloads across video, audio, and written",
  },
  {
    value: "$18.4M",
    label: "Pipeline attributed in the first partnership term",
    note: "Renewed through 2027",
  },
] as const;

const CASE_STUDY_HREF = "/case-studies/notion-founders-journal";

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z" />
    </svg>
  );
}

function CaseStudyCta({
  className,
  tone = "cream",
}: {
  className?: string;
  tone?: "cream" | "solid" | "charcoal";
}) {
  return (
    <Link
      href={CASE_STUDY_HREF}
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-2 rounded-sm px-5 py-2.5 text-[0.8125rem] font-medium transition-colors",
        tone === "charcoal"
          ? "bg-charcoal text-cream hover:bg-forest"
          : tone === "solid"
            ? "bg-cream text-charcoal hover:bg-cream-dark"
            : "border border-cream/30 text-cream hover:border-cream hover:bg-cream hover:text-charcoal",
        className,
      )}
    >
      Read the full case study
      <ArrowIcon className="size-3 shrink-0" />
    </Link>
  );
}

function FullKeyStudy() {
  return (
    <section className="bg-cream-dark">
      <div className="mx-auto max-w-352 px-6 py-16 md:px-10 md:py-20 lg:px-12 lg:py-24">
        <div className="flex flex-col gap-8 border-b border-charcoal/12 pb-10 md:flex-row md:items-end md:justify-between md:gap-12 md:pb-12">
          <div className="max-w-3xl">
            <img
              src="/brand/clients/notion-lockup.png"
              alt="Notion"
              className="h-8 w-auto object-contain md:h-9"
            />

            <h2 className="mt-7 font-display text-[2rem] leading-[1.08] tracking-tight text-charcoal sm:text-[2.45rem] md:text-[2.85rem]">
              How Notion built B2B&apos;s defining founder series —{" "}
              <span className="text-forest">without a studio.</span>
            </h2>

            <p className="mt-5 max-w-xl text-[0.95rem] leading-relaxed text-charcoal/70 md:text-base">
              One operator voice. Twelve episodes. End-to-end casting, format,
              and distribution — so Notion owned the category without standing
              up an in-house media team.
            </p>

            <dl className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-[0.8125rem] md:gap-x-7">
              <div className="flex items-baseline gap-2">
                <dt className="font-medium text-charcoal/50">Pillar</dt>
                <dd className="font-medium text-charcoal">Content</dd>
              </div>
              <span
                aria-hidden
                className="hidden h-3.5 w-px bg-charcoal/20 sm:block"
              />
              <div className="flex items-baseline gap-2">
                <dt className="font-medium text-charcoal/50">Lead</dt>
                <dd className="font-medium text-charcoal">Alex Lieberman</dd>
              </div>
              <span
                aria-hidden
                className="hidden h-3.5 w-px bg-charcoal/20 sm:block"
              />
              <div className="flex items-baseline gap-2">
                <dt className="font-medium text-charcoal/50">Term</dt>
                <dd className="font-medium text-charcoal">22 months</dd>
              </div>
            </dl>
          </div>

          <CaseStudyCta tone="charcoal" className="self-start md:self-end" />
        </div>

        <ul>
          {fullMetrics.map((metric) => (
            <li
              key={metric.value}
              className="border-b border-charcoal/12 py-8 md:py-10"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-10">
                <p className="font-display text-[4.25rem] leading-none tracking-tight text-charcoal sm:text-[5rem] md:text-[5.75rem]">
                  <StatCounter value={metric.value} duration={1400} />
                </p>
                <div className="max-w-md sm:text-right">
                  <p className="text-[1.05rem] leading-snug font-medium text-charcoal md:text-[1.2rem]">
                    {metric.label}
                  </p>
                  {"note" in metric && metric.note ? (
                    <p className="mt-1.5 text-sm text-charcoal/55">
                      ({metric.note})
                    </p>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function BoxedKeyStudy() {
  return (
    <section className="bg-cream px-6 py-8 md:px-10 md:py-10 lg:px-12">
      <div className="relative mx-auto max-w-352 overflow-hidden rounded-sm bg-forest px-6 py-14 md:px-10 md:py-16 lg:px-12 lg:py-20">
        <PatternField
          color={CREAM_RGB}
          className="opacity-[0.14]"
          mask="linear-gradient(to left, black 0%, rgba(0,0,0,0.55) 35%, rgba(0,0,0,0.12) 65%, transparent 85%)"
        />

        <div className="relative z-2 grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-end lg:gap-14 xl:gap-16">
          <div>
            <Image
              src="/brand/notion-logo.png"
              alt="Notion"
              width={200}
              height={200}
              className="size-12 object-contain brightness-0 invert md:size-14"
            />

            <p className="mt-6 text-[0.7rem] font-medium tracking-[0.18em] text-cream/55 uppercase">
              Case study
            </p>

            <h2 className="mt-3 max-w-2xl font-display text-[2.3rem] leading-[1.06] tracking-tight text-cream sm:text-[2.8rem] md:text-[3.25rem]">
              How Notion built B2B&apos;s defining founder series —{" "}
              <em className="font-display italic text-[#E4EBE6]">
                without a studio.
              </em>
            </h2>

            <p className="mt-6 max-w-lg text-[0.9rem] leading-relaxed text-cream/75 md:text-base">
              One trusted voice, twelve episodes, zero production overhead. We
              paired Notion with Alex Lieberman as editorial lead and ran
              everything end-to-end — casting, format, distribution.
              Twenty-two months in, it&apos;s the highest-performing brand
              series in its category.
            </p>

            <CaseStudyCta className="mt-8" />
          </div>

          <ul className="grid grid-cols-2 gap-3 md:gap-4">
            {boxedMetrics.map((metric) => (
              <li
                key={metric.label}
                className="flex min-h-36 flex-col justify-between rounded-sm bg-cream/95 px-5 pb-5 pt-6 md:min-h-40 md:px-6 md:pb-6 md:pt-7"
              >
                <div>
                  <p className="text-sm font-medium text-charcoal/65">
                    {metric.label}
                  </p>
                  <p className="mt-3 font-display text-[2.15rem] leading-none tracking-tight text-charcoal md:text-[2.5rem]">
                    <StatCounter value={metric.value} />
                  </p>
                </div>
                <p className="mt-4 text-[0.75rem] leading-relaxed text-charcoal/65">
                  {metric.caption}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function KeyStudy({
  variant = "boxed",
}: {
  variant?: "boxed" | "full";
}) {
  if (variant === "full") return <FullKeyStudy />;
  return <BoxedKeyStudy />;
}
