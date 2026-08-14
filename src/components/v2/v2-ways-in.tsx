import Link from "next/link";

import { TwoToneDisplay } from "@/components/v2/v2-hero";
import { ArrowUpRightIcon } from "@/components/v2/v2-icons";
import type { HomePageSections } from "@/lib/cms";

export function V2WaysIn({ content }: { content: HomePageSections["waysIn"] }) {
  return (
    <section className="bg-[var(--v2-snow)] py-28">
      <div className="v2-container flex flex-col gap-16 lg:flex-row lg:items-start lg:gap-24">
      <div className="flex max-w-[432px] shrink-0 flex-col gap-7 lg:sticky lg:top-28 lg:self-start">
        <TwoToneDisplay
          as="h2"
          text={content.headline}
          className="text-[clamp(2.4rem,5vw,4rem)] leading-[1.03]"
        />
        {content.subhead.trim() ? (
          <p className="text-[17px] leading-7 text-[var(--v2-lichen)]">
            {content.subhead}
          </p>
        ) : null}
      </div>

      <ol className="flex min-w-0 flex-1 flex-col">
        {content.items.map((item, index) => (
          <li key={`${item.title}-${index}`}>
            <Link
              href="/what-we-do"
              className="group flex items-start gap-8 py-[34px]"
            >
              <span className="w-11 shrink-0 pt-2 text-[13px] leading-4 font-medium tracking-[0.08em] text-[var(--v2-ember)]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-2.5">
                <span className="v2-display text-[32px] leading-10 tracking-[-0.01em] text-[var(--v2-timberline)]">
                  {item.title}
                </span>
                <span className="text-[17px] leading-7 text-[var(--v2-lichen)]">
                  {item.body}
                </span>
              </span>
              <span className="relative mt-3 size-5 shrink-0 overflow-hidden text-[var(--v2-timberline)]">
                <span className="absolute inset-0 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-full group-hover:-translate-y-full group-focus-visible:translate-x-full group-focus-visible:-translate-y-full">
                  <ArrowUpRightIcon className="size-5" />
                </span>
                <span className="absolute inset-0 translate-x-[-100%] translate-y-full transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0 group-hover:translate-y-0 group-focus-visible:translate-x-0 group-focus-visible:translate-y-0">
                  <ArrowUpRightIcon className="size-5" />
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
      </div>
    </section>
  );
}
