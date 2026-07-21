import Image from "next/image";
import Link from "next/link";

import { PatternField } from "@/components/pattern-field";
import { StatCounter } from "@/components/stat-counter";

const CREAM_RGB = { r: 249, g: 243, b: 239 };

const metrics = [
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

export function KeyStudy() {
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
              className="size-12 object-contain md:size-14"
            />

            <h2 className="mt-7 max-w-2xl font-display text-[2.3rem] leading-[1.06] tracking-tight text-cream sm:text-[2.8rem] md:text-[3.25rem]">
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

            <Link
              href="/case-studies"
              className="mt-8 inline-flex items-center justify-center rounded-sm border border-cream/30 px-5 py-2.5 text-[0.8125rem] font-medium text-cream transition-colors hover:border-cream hover:bg-cream hover:text-charcoal"
            >
              Read the case study
              <span aria-hidden className="ml-2">
                →
              </span>
            </Link>
          </div>

          <ul className="grid grid-cols-2 gap-3 md:gap-4">
            {metrics.map((metric) => (
              <li
                key={metric.label}
                className="flex min-h-36 flex-col justify-between rounded-sm bg-[#E4EBE6] px-5 pb-5 pt-6 md:min-h-40 md:px-6 md:pb-6 md:pt-7"
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
