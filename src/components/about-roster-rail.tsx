import Link from "next/link";

import type { HeroCastMember } from "@/components/home-2/hero-cast";
import { SiteImage } from "@/components/site-image";
import { cn } from "@/lib/utils";

/** Skyline rhythm: size follows the person, so the marquee loop stays seamless. */
const CARD_SIZES = [
  {
    frame: "w-[13.5rem] md:w-[15.75rem]",
    height: "h-[17.5rem] md:h-[22.5rem]",
    name: "text-[1.0625rem] md:text-[1.125rem]",
  },
  {
    frame: "w-[18.5rem] md:w-[22.5rem]",
    height: "h-[23.5rem] md:h-[32.5rem]",
    name: "text-[1.25rem]",
  },
  {
    frame: "w-[12.25rem] md:w-[14.25rem]",
    height: "h-[15.75rem] md:h-[19.75rem]",
    name: "text-[1.0625rem]",
  },
  {
    frame: "w-[16.5rem] md:w-[19.5rem]",
    height: "h-[21rem] md:h-[28rem]",
    name: "text-[1.1875rem]",
  },
  {
    frame: "w-[14rem] md:w-[16.25rem]",
    height: "h-[18.25rem] md:h-[24rem]",
    name: "text-[1.125rem]",
  },
] as const;

function padBase<T>(items: readonly T[], min = 8): T[] {
  if (items.length === 0) return [];
  let base = [...items];
  while (base.length < min) {
    base = [...base, ...items];
  }
  return base;
}

export function AboutRosterRail({
  members,
}: {
  members: readonly HeroCastMember[];
}) {
  const original = members.filter((member) => member.name.trim());
  const base = padBase(original);
  const loop = [...base, ...base];

  if (original.length === 0) return null;

  return (
    <div
      className="cast-marquee-window relative mt-12 w-full overflow-hidden"
      aria-label="Featured creators"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-20 w-10 bg-linear-to-r from-cream via-cream/80 to-transparent md:w-16 lg:w-24"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-20 w-10 bg-linear-to-l from-cream via-cream/80 to-transparent md:w-16 lg:w-24"
      />
      <ul className="about-roster-track flex w-max items-end gap-3 md:gap-4">
        {loop.map((member, index) => {
          const sourceIndex = index % original.length;
          const size = CARD_SIZES[sourceIndex % CARD_SIZES.length];
          const imageSrc =
            member.image?.trim() || "/images/creator-placeholder.png";
          return (
            <li
              key={`${member.id}-${index}`}
              aria-hidden={index >= original.length || undefined}
              className={cn("relative shrink-0", size.frame)}
            >
              <Link
                href={`/roster/${member.slug}`}
                className="group relative block overflow-hidden rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
                tabIndex={index >= original.length ? -1 : undefined}
                aria-label={`${member.name}${member.role ? `, ${member.role}` : ""}`}
              >
                <span className={cn("relative block", size.height)}>
                  <SiteImage
                    src={imageSrc}
                    alt=""
                    fill
                    sizes="360px"
                    className="object-cover object-[center_16%] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-linear-to-t from-charcoal via-charcoal/35 to-transparent"
                  />
                  <span className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                    <span
                      className={cn(
                        "block font-display leading-snug tracking-tight text-cream",
                        size.name,
                      )}
                    >
                      {member.name}
                    </span>
                    {member.role ? (
                      <span className="mt-1 block text-[0.75rem] leading-snug text-cream/70 md:text-[0.8125rem]">
                        {member.role}
                      </span>
                    ) : null}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
