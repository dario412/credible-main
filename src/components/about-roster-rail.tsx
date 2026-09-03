import Link from "next/link";

import type { HeroCastMember } from "@/components/home-2/hero-cast";
import { SiteImage } from "@/components/site-image";
import { portraitAltFor } from "@/lib/image-alt";
import { cn } from "@/lib/utils";

type CardSize = {
  frame: string;
  height: string;
  name: string;
};

/** About page — uniform size (client request: all cards same height/width). */
const CARD_SIZES_SKYLINE: readonly CardSize[] = [
  {
    frame: "w-[12rem] md:w-[14.5rem]",
    height: "h-[16rem] md:h-[20rem]",
    name: "text-[1rem] md:text-[1.0625rem]",
  },
];

/** Homepage hero — uniform size to match skyline. */
const CARD_SIZES_SUBTLE: readonly CardSize[] = [
  {
    frame: "w-[12rem] md:w-[14.5rem]",
    height: "h-[16rem] md:h-[20rem]",
    name: "text-[1rem] md:text-[1.0625rem]",
  },
];

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
  sizeScale = "skyline",
  className,
}: {
  members: readonly HeroCastMember[];
  /** `skyline` = About page drama; `subtle` = homepage soft mix. */
  sizeScale?: "skyline" | "subtle";
  className?: string;
}) {
  const original = members.filter((member) => member.name.trim());
  const base = padBase(original);
  const loop = [...base, ...base];
  const sizes = sizeScale === "subtle" ? CARD_SIZES_SUBTLE : CARD_SIZES_SKYLINE;
  const trackClass =
    sizeScale === "subtle" ? "cast-marquee-track" : "about-roster-track";

  if (original.length === 0) return null;

  return (
    <div
      className={cn(
        "cast-marquee-window relative w-full overflow-hidden",
        sizeScale === "skyline" ? "mt-12 pt-3" : "pt-3",
        className,
      )}
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
      <ul
        className={cn(
          "flex w-max items-stretch gap-3 md:gap-4",
          trackClass,
        )}
      >
        {loop.map((member, index) => {
          const sourceIndex = index % original.length;
          const size = sizes[sourceIndex % sizes.length]!;
          const imageSrc =
            member.image?.trim() || "/images/creator-placeholder.png";
          return (
            <li
              key={`${member.id}-${index}`}
              aria-hidden={index >= original.length || undefined}
              className={cn(
                "relative shrink-0 origin-bottom transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                "hover:z-10 hover:-translate-y-2 hover:scale-[1.03]",
                "focus-within:z-10 focus-within:-translate-y-2 focus-within:scale-[1.03]",
                size.frame,
              )}
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
                    alt={portraitAltFor(member.name, member.role)}
                    fill
                    sizes="360px"
                    className="object-cover object-[center_16%]"
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
