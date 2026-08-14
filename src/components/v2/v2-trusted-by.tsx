import Image from "next/image";
import Link from "next/link";

import { hasTrustedByStory, type TrustedByClient } from "@/lib/trusted-by";

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

function BrandMark({ client }: { client: TrustedByClient }) {
  if (client.logoSrc) {
    return (
      <>
        <span className="sr-only">{client.name}</span>
        <img
          src={client.logoSrc}
          alt=""
          className="h-full w-auto max-w-full object-contain object-center brightness-0 invert transition-opacity duration-200"
        />
      </>
    );
  }

  return (
    <span className="v2-display text-[1.35rem] leading-none tracking-tight">
      {client.name || "Client"}
    </span>
  );
}

export function V2TrustedBy({ clients }: { clients: TrustedByClient[] }) {
  if (clients.length === 0) return null;

  return (
    <section className="bg-[var(--v2-timberline)] py-28">
      <div className="v2-container flex flex-col items-center gap-14 overflow-visible">
        <p className="text-center text-[13px] leading-4 font-medium tracking-[0.08em] text-[var(--v2-on-dark-muted)] uppercase">
          Our creators shape buying decisions at
        </p>
        <ul className="grid w-full grid-cols-2 items-start gap-x-8 gap-y-14 overflow-visible sm:grid-cols-3 lg:grid-cols-5">
          {clients.map((client) => {
            const story = hasTrustedByStory(client);
            const testimonial = client.testimonial;
            const storyHref = client.caseStudySlug
              ? `/case-studies/${client.caseStudySlug}`
              : null;

            return (
              <li
                key={client.id ?? client.name}
                className="group relative flex flex-col items-center gap-3"
              >
                {story && testimonial ? (
                  <div
                    className="pointer-events-none absolute bottom-[calc(100%+0.75rem)] left-1/2 z-20 w-[min(18.5rem,calc(100vw-3rem))] -translate-x-1/2 scale-[0.96] opacity-0 transition-all duration-300 ease-out group-hover:pointer-events-auto group-hover:scale-100 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:scale-100 group-focus-within:opacity-100"
                    role="tooltip"
                  >
                    <div className="rounded-[12px] bg-[var(--v2-glacier)] px-5 py-4 text-left shadow-[0_16px_40px_rgba(14,26,20,0.35)]">
                      <span
                        className="v2-display text-3xl leading-none text-[var(--v2-evergreen)]"
                        aria-hidden
                      >
                        “
                      </span>
                      <p className="v2-display mt-1 text-[0.95rem] leading-snug text-[var(--v2-timberline)] italic">
                        {testimonial.quote}
                      </p>
                      <div className="mt-3.5 border-t border-[var(--v2-timberline)]/15 pt-3">
                        <div className="flex items-center gap-2.5">
                          <Image
                            src={
                              testimonial.imageSrc ||
                              "/images/creator-placeholder.png"
                            }
                            alt=""
                            width={32}
                            height={32}
                            className="size-8 rounded-full object-cover"
                          />
                          <div className="min-w-0">
                            <p className="truncate text-[12px] font-medium leading-tight text-[var(--v2-timberline)]">
                              {testimonial.name}
                            </p>
                            <p className="truncate text-[11px] leading-tight text-[var(--v2-timberline)]/60">
                              {testimonial.title}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}

                <span className="flex h-7 w-full max-w-[9.5rem] items-center justify-center">
                  <BrandMark client={client} />
                </span>

                {story && storyHref ? (
                  <Link
                    href={storyHref}
                    className="inline-flex items-center overflow-hidden rounded-full bg-[var(--v2-snow)]/10 px-2.5 py-1 text-[10px] font-medium tracking-wide text-[var(--v2-snow)]/80 transition-colors duration-200 hover:bg-[var(--v2-snow)]/16 hover:text-[var(--v2-snow)] focus-visible:bg-[var(--v2-snow)]/16 focus-visible:text-[var(--v2-snow)] focus-visible:outline-none"
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
                ) : story ? (
                  <span className="inline-flex items-center rounded-full bg-[var(--v2-snow)]/10 px-2.5 py-1 text-[10px] font-medium tracking-wide text-[var(--v2-snow)]/80">
                    Customer story
                  </span>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
