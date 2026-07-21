import Link from "next/link";
import Image from "next/image";

type Testimonial = {
  quote: string;
  name: string;
  title: string;
};

type Brand = {
  name: string;
  caseStudySlug?: string;
  testimonial?: Testimonial;
};

const brands: Brand[] = [
  { name: "Notion" },
  {
    name: "Stripe",
    caseStudySlug: "stage-to-boardroom",
    testimonial: {
      quote:
        "Credible turned a single keynote into a year-long advisory partnership — exactly the kind of credibility our buyers trust.",
      name: "Maya Chen",
      title: "Head of Brand Partnerships, Stripe",
    },
  },
  { name: "Linear" },
  {
    name: "Figma",
    caseStudySlug: "creator-led-launch",
    testimonial: {
      quote:
        "They assembled operators and trusted voices into one coherent launch narrative — stage, media, and everything in between.",
      name: "Jordan Hale",
      title: "Director of Marketing, Figma",
    },
  },
  { name: "Vercel" },
  { name: "Intercom" },
  { name: "Ramp" },
  {
    name: "Retool",
    caseStudySlug: "stage-to-boardroom",
    testimonial: {
      quote:
        "The creators we booked felt like peers to our audience — not sponsors. That authenticity moved the deal cycle.",
      name: "Sam Okonkwo",
      title: "VP Marketing, Retool",
    },
  },
  { name: "Loom" },
  { name: "Cursor" },
];

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

export function TrustedBy() {
  return (
    <section className="bg-cream px-6 py-8 md:px-10 md:py-10 lg:px-12">
      <div className="mx-auto max-w-352 overflow-visible rounded-sm bg-charcoal px-6 py-14 md:px-10 md:py-16 lg:px-12 lg:py-20">
        <ul className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 md:grid-cols-5 md:gap-x-8 md:gap-y-14">
          {brands.map((brand) => {
            const hasStory = Boolean(brand.caseStudySlug && brand.testimonial);

            return (
              <li
                key={brand.name}
                className="group relative flex flex-col items-center gap-3"
              >
                {hasStory && brand.testimonial ? (
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
                        {brand.testimonial.quote}
                      </p>
                      <div className="mt-3.5 border-t border-charcoal/15 pt-3">
                        <div className="flex items-center gap-2.5">
                          <Image
                            src="/images/creator-placeholder.png"
                            alt=""
                            width={32}
                            height={32}
                            className="size-8 rounded-full object-cover"
                          />
                          <div className="min-w-0">
                            <p className="truncate text-[12px] font-medium leading-tight text-charcoal">
                              {brand.testimonial.name}
                            </p>
                            <p className="truncate text-[11px] leading-tight text-charcoal/60">
                              {brand.testimonial.title}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}

                <span className="font-display text-[1.35rem] leading-none tracking-tight text-cream/90 transition-colors duration-200 group-hover:text-cream md:text-[1.55rem]">
                  {brand.name}
                </span>

                {hasStory && brand.caseStudySlug ? (
                  <Link
                    href={`/case-studies/${brand.caseStudySlug}`}
                    className="inline-flex items-center overflow-hidden rounded-full bg-cream/10 px-2.5 py-1 text-[10px] font-medium tracking-wide text-cream/80 transition-colors duration-200 hover:bg-cream/16 hover:text-cream focus-visible:bg-cream/16 focus-visible:text-cream focus-visible:outline-none"
                  >
                    <span className="relative inline-grid grid-cols-1 grid-rows-1 items-center justify-items-center">
                      {/* Default: text + trailing arrow */}
                      <span className="col-start-1 row-start-1 inline-flex items-center gap-1 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1.5 group-hover:opacity-0">
                        <span className="whitespace-nowrap">Customer story</span>
                        <ArrowIcon className="size-2.5 shrink-0" />
                      </span>
                      {/* Hover: leading arrow + text */}
                      <span className="col-start-1 row-start-1 inline-flex -translate-x-1.5 items-center gap-1 opacity-0 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0 group-hover:opacity-100">
                        <ArrowIcon className="size-2.5 shrink-0" />
                        <span className="whitespace-nowrap">Customer story</span>
                      </span>
                    </span>
                  </Link>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
