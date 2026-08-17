import { SiteImage } from "@/components/site-image";
import { cn } from "@/lib/utils";

export const ABOUT_ROSTER_LANES = [
  {
    title: "Founders & operators",
    body: "Commercial work shaped around judgment.",
    image: "/images/experts/alex-lieberman.png",
    height: "h-[22rem] md:h-[28.75rem]",
  },
  {
    title: "Category specialists",
    body: "Expertise that can hold a room and a buying committee.",
    image: "/images/experts/daniel-park.jpg",
    height: "h-[24rem] md:h-[32.5rem]",
  },
  {
    title: "Speakers & hosts",
    body: "Presence for high-trust moments.",
    image: "/images/experts/amara-chen.jpg",
    height: "h-[21rem] md:h-[27.5rem]",
  },
  {
    title: "Investors & analysts",
    body: "Markets, capital, and category thesis.",
    image: "/images/experts/noah-bennett.jpg",
    height: "h-[23rem] md:h-[31.25rem]",
  },
  {
    title: "Subject-matter experts",
    body: "Practitioner depth in a vertical.",
    image: "/images/experts/james-okafor.jpg",
    height: "h-[20rem] md:h-[25rem]",
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

export function AboutRosterRail() {
  const original = ABOUT_ROSTER_LANES;
  const base = padBase(original);
  const loop = [...base, ...base];

  return (
    <div
      className="cast-marquee-window relative mt-12 w-full overflow-hidden"
      aria-label="Roster archetypes"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-20 w-10 bg-linear-to-r from-cream via-cream/80 to-transparent md:w-16 lg:w-24"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-20 w-10 bg-linear-to-l from-cream via-cream/80 to-transparent md:w-16 lg:w-24"
      />
      <ul className="about-roster-track flex w-max items-end gap-4">
        {loop.map((lane, index) => (
          <li
            key={`${lane.title}-${index}`}
            aria-hidden={index >= original.length || undefined}
            className="relative w-[17.5rem] shrink-0 overflow-hidden rounded-sm md:w-[21.25rem]"
          >
            <div className={cn("relative", lane.height)}>
              <SiteImage
                src={lane.image}
                alt=""
                fill
                sizes="340px"
                className="object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-linear-to-t from-charcoal via-charcoal/35 to-transparent"
              />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 className="font-display text-[1.25rem] leading-snug tracking-tight text-cream">
                  {lane.title}
                </h3>
                <p className="mt-1 text-[0.8125rem] leading-snug text-cream/70">
                  {lane.body}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
