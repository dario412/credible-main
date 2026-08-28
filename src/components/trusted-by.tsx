import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";

import {
  DEFAULT_TRUSTED_CLIENTS,
  hasTrustedByStory,
  type TrustedByClient,
} from "@/lib/trusted-by";
import { logoAltFor, portraitAltFor } from "@/lib/image-alt";

const LOGO_CLASS =
  "h-full w-auto max-w-full object-contain object-center brightness-0 invert transition-opacity duration-200";

function BrandMark({ client }: { client: TrustedByClient }) {
  if (client.logoSrc) {
    return (
      <img
        src={client.logoSrc}
        alt={logoAltFor(client.name)}
        className={LOGO_CLASS}
      />
    );
  }

  return (
    <span className="font-display text-[1.35rem] leading-none tracking-tight md:text-[1.55rem]">
      {client.name || "Client"}
    </span>
  );
}

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

export function TrustedBy({
  clients = DEFAULT_TRUSTED_CLIENTS,
  editSlots,
  disableStoryLinks = false,
}: {
  clients?: TrustedByClient[];
  editSlots?: {
    client?: (index: number, node: ReactNode) => ReactNode;
  };
  disableStoryLinks?: boolean;
}) {
  return (
    <section className="bg-cream px-6 py-8 md:px-10 md:py-10 lg:px-12">
      <div className="mx-auto max-w-352 overflow-visible rounded-sm bg-charcoal px-6 py-6 md:px-10 md:py-10 lg:px-12 lg:py-12">
        <ul className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 md:grid-cols-5 md:gap-x-8 md:gap-y-14">
          {clients.map((client, index) => {
            const hasTestimonial = hasTrustedByStory(client);
            const testimonial = client.testimonial;
            const storyHref = client.caseStudySlug.trim()
              ? `/case-studies/${client.caseStudySlug.trim()}`
              : null;
            // Pill only when a case study is linked; hover box only when a quote exists.
            const showStoryPill = Boolean(storyHref);
            const logo = (
              <span className="flex h-6 w-full max-w-[9.5rem] items-center justify-center md:h-7">
                <BrandMark client={client} />
              </span>
            );

            const item = (
              <li className="group relative flex flex-col items-center gap-3">
                {hasTestimonial && testimonial ? (
                  <div
                    className="pointer-events-none absolute bottom-[calc(100%+0.75rem)] left-1/2 z-20 w-[min(18.5rem,calc(100vw-3rem))] -translate-x-1/2 scale-[0.96] opacity-0 transition-all duration-300 ease-out group-hover:pointer-events-auto group-hover:scale-100 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:scale-100 group-focus-within:opacity-100"
                    role="tooltip"
                  >
                    <div className="rounded-sm bg-[#E4EBE6] px-5 py-4 text-left shadow-[0_16px_40px_rgba(28,26,23,0.35)]">
                      <span
                        className="font-display text-3xl leading-none text-forest"
                        aria-hidden
                      >
                        “
                      </span>
                      <p className="mt-1 font-display text-[0.95rem] leading-snug text-charcoal italic">
                        {testimonial.quote}
                      </p>
                      <div className="mt-3.5 border-t border-charcoal/15 pt-3">
                        <div className="flex items-center gap-2.5">
                          <Image
                            src={
                              testimonial.imageSrc ||
                              "/images/creator-placeholder.png"
                            }
                            alt={portraitAltFor(
                              testimonial.name,
                              testimonial.title,
                            )}
                            width={32}
                            height={32}
                            className="size-8 rounded-full object-cover"
                          />
                          <div className="min-w-0">
                            <p className="truncate text-[12px] font-medium leading-tight text-charcoal">
                              {testimonial.name}
                            </p>
                            <p className="truncate text-[11px] leading-tight text-charcoal/60">
                              {testimonial.title}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}

                {storyHref && !disableStoryLinks ? (
                  <Link
                    href={storyHref}
                    className="flex h-6 w-full max-w-[9.5rem] items-center justify-center transition-opacity hover:opacity-80 md:h-7"
                    aria-label={`${client.name} project`}
                  >
                    <BrandMark client={client} />
                  </Link>
                ) : (
                  logo
                )}

                {showStoryPill ? (
                  storyHref && !disableStoryLinks ? (
                    <Link
                      href={storyHref}
                      className="inline-flex items-center overflow-hidden rounded-full bg-cream/10 px-2.5 py-1 text-[10px] font-medium tracking-wide text-cream/80 transition-colors duration-200 hover:bg-cream/16 hover:text-cream focus-visible:bg-cream/16 focus-visible:text-cream focus-visible:outline-none"
                    >
                      <span className="relative inline-grid grid-cols-1 grid-rows-1 items-center justify-items-center">
                        <span className="col-start-1 row-start-1 inline-flex items-center gap-1 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1.5 group-hover:opacity-0">
                          <span className="whitespace-nowrap">Customer story</span>
                          <ArrowIcon className="size-2.5 shrink-0" />
                        </span>
                        <span className="col-start-1 row-start-1 inline-flex -translate-x-1.5 items-center gap-1 opacity-0 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0 group-hover:opacity-100">
                          <ArrowIcon className="size-2.5 shrink-0" />
                          <span className="whitespace-nowrap">Customer story</span>
                        </span>
                      </span>
                    </Link>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-cream/10 px-2.5 py-1 text-[10px] font-medium tracking-wide text-cream/80">
                      Customer story
                    </span>
                  )
                ) : null}
              </li>
            );

            return (
              <div key={client.id ?? `${client.name || "client"}-${index}`}>
                {editSlots?.client ? editSlots.client(index, item) : item}
              </div>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
