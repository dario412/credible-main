import { SiteImage } from "@/components/site-image";
import type { AboutRosterLane } from "@/lib/about-page";
import { cn } from "@/lib/utils";

const LANE_HEIGHTS = [
  "h-[22rem] md:h-[28.75rem]",
  "h-[24rem] md:h-[32.5rem]",
  "h-[21rem] md:h-[27.5rem]",
  "h-[23rem] md:h-[31.25rem]",
  "h-[20rem] md:h-[25rem]",
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
  lanes,
}: {
  lanes: readonly AboutRosterLane[];
}) {
  const original = lanes.filter(
    (lane) => lane.title.trim() || lane.body.trim() || lane.image.trim(),
  );
  const base = padBase(original);
  const loop = [...base, ...base];

  if (original.length === 0) return null;

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
        {loop.map((lane, index) => {
          const sourceIndex = index % original.length;
          return (
            <li
              key={`${lane.title}-${lane.image}-${index}`}
              aria-hidden={index >= original.length || undefined}
              className="relative w-[17.5rem] shrink-0 overflow-hidden rounded-sm md:w-[21.25rem]"
            >
              <div
                className={cn("relative", LANE_HEIGHTS[sourceIndex % LANE_HEIGHTS.length])}
              >
                {lane.image.trim() ? (
                  <SiteImage
                    src={lane.image}
                    alt=""
                    fill
                    sizes="340px"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-charcoal" />
                )}
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
          );
        })}
      </ul>
    </div>
  );
}
