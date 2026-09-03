import Link from "next/link";

export const WAYS = [
  {
    index: "01",
    title: "Brand partnerships",
    body: "Campaign work with creators your buyers already trust — long-form and considered, not a one-post drop.",
    span: "lg:col-span-7",
    visual: "partnerships" as const,
    visualClass: "w-48 lg:w-60",
  },
  {
    index: "02",
    title: "Ambassador programs",
    body: "Category ambassadors and retainers that embed a credible voice into your brand for the long haul.",
    span: "lg:col-span-5",
    visual: "ambassadors" as const,
    visualClass: "w-40 lg:w-44",
  },
  {
    index: "03",
    title: "Speaking engagements",
    body: "Keynotes, panels, fireside chats and closed-door executive sessions. Bureau-quality booking.",
    span: "lg:col-span-5",
    visual: "speaking" as const,
    visualClass: "w-40 lg:w-44",
  },
  {
    index: "04",
    title: "Live events",
    body: "Creators attend and amplify your event — presence, content and credibility that give the room lasting reach.",
    span: "lg:col-span-7",
    visual: "live" as const,
    visualClass: "w-48 lg:w-60",
  },
] as const;

const INK = "var(--charcoal)";
const ACCENT = "var(--forest)";

/** Ongoing series of long-form placements, not a single drop */
function PartnershipsVisual() {
  const rows = [
    { y: 44, w: 148, delay: "0s", accent: false },
    { y: 68, w: 186, delay: "0.35s", accent: true },
    { y: 92, w: 118, delay: "0.7s", accent: false },
    { y: 116, w: 162, delay: "1.05s", accent: false },
  ] as const;

  return (
    <svg
      className="wi-illo"
      viewBox="0 0 240 160"
      role="img"
      aria-label="A run of long-form placements building over time."
    >
      <line x1="24" y1="38" x2="24" y2="126" stroke={INK} strokeOpacity="0.18" />
      {rows.map((row) => (
        <g key={row.y}>
          <circle
            cx="24"
            cy={row.y + 5}
            r="2.5"
            fill={row.accent ? ACCENT : INK}
            fillOpacity={row.accent ? 1 : 0.3}
          />
          <rect
            className="wi-bar group-hover:[animation-duration:2s]"
            style={{ animationDelay: row.delay }}
            x="36"
            y={row.y}
            width={row.w}
            height="10"
            rx="2"
            fill={row.accent ? ACCENT : INK}
            fillOpacity={row.accent ? 0.85 : 0.14}
          />
        </g>
      ))}
    </svg>
  );
}

/** A credible voice held in orbit around the brand, long term */
function AmbassadorsVisual() {
  return (
    <svg
      className="wi-illo"
      viewBox="0 0 240 160"
      role="img"
      aria-label="A creator voice kept in long-term orbit around a brand."
    >
      <circle
        cx="120"
        cy="80"
        r="56"
        fill="none"
        stroke={INK}
        strokeOpacity="0.16"
        strokeDasharray="3 6"
      />
      <circle cx="120" cy="80" r="32" fill="none" stroke={INK} strokeOpacity="0.14" />

      <g className="wi-orbit group-hover:[animation-duration:5s]">
        <circle cx="176" cy="80" r="5.5" fill={ACCENT} />
      </g>
      <g
        className="wi-orbit group-hover:[animation-duration:7s]"
        style={{ animationDuration: "16s", animationDirection: "reverse" }}
      >
        <circle cx="152" cy="80" r="3.5" fill={INK} fillOpacity="0.35" />
      </g>

      <circle cx="120" cy="80" r="9" fill={INK} />
      <circle cx="120" cy="80" r="3" fill="var(--cream)" fillOpacity="0.4" />
    </svg>
  );
}

/** Voices carrying a room, from keynote to closed-door session */
function SpeakingVisual() {
  const bars = [
    { x: 62, h: 26 },
    { x: 78, h: 44 },
    { x: 94, h: 34 },
    { x: 110, h: 58 },
    { x: 126, h: 40 },
    { x: 142, h: 52 },
    { x: 158, h: 30 },
    { x: 174, h: 22 },
  ] as const;

  return (
    <svg
      className="wi-illo"
      viewBox="0 0 240 160"
      role="img"
      aria-label="A voice carrying across a room, from keynote to private session."
    >
      <path
        d="M52 118 Q120 40 188 118"
        fill="none"
        stroke={INK}
        strokeOpacity="0.12"
      />
      <line x1="48" y1="118" x2="192" y2="118" stroke={INK} strokeOpacity="0.2" />

      {bars.map((bar, index) => (
        <rect
          key={bar.x}
          className="wi-eq group-hover:[animation-duration:1.3s]"
          style={{ animationDelay: `${index * 0.11}s` }}
          x={bar.x}
          y={118 - bar.h}
          width="6"
          height={bar.h}
          rx="1.5"
          fill={bar.h > 50 ? ACCENT : INK}
          fillOpacity={bar.h > 50 ? 0.85 : 0.22}
        />
      ))}
    </svg>
  );
}

/** Presence in the room, reach far past its walls */
function LiveVisual() {
  const seats = [96, 110, 124, 138] as const;

  return (
    <svg
      className="wi-illo"
      viewBox="0 0 240 160"
      role="img"
      aria-label="Presence inside a venue sending reach beyond its walls."
    >
      <rect
        x="72"
        y="40"
        width="96"
        height="80"
        rx="6"
        fill="none"
        stroke={INK}
        strokeOpacity="0.18"
      />

      <g fill="none" stroke={ACCENT} strokeWidth="1.2">
        {["0s", "1.13s", "2.26s"].map((delay) => (
          <circle
            key={delay}
            className="wi-ring group-hover:[animation-duration:2.2s]"
            style={{ animationDelay: delay }}
            cx="120"
            cy="80"
            r="36"
          />
        ))}
      </g>

      <circle className="wi-drift" cx="120" cy="80" r="7" fill={INK} />

      <g fill={INK} fillOpacity="0.22">
        {seats.map((cx) => (
          <circle key={cx} cx={cx} cy="132" r="2.5" />
        ))}
      </g>
    </svg>
  );
}

const WAY_VISUALS = {
  partnerships: PartnershipsVisual,
  ambassadors: AmbassadorsVisual,
  speaking: SpeakingVisual,
  live: LiveVisual,
} as const;

export function WaysIn() {
  return (
    <section className="bg-cream px-6 py-16 md:px-10 md:py-20 lg:px-12">
      <div className="mx-auto max-w-352">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start lg:gap-12 xl:gap-16">
          <h2 className="max-w-4xl font-display text-[2.6rem] leading-[1.08] tracking-tight text-charcoal sm:text-[3.15rem] md:text-[3.65rem]">
            One roster,
            <br />
            four ways in.
          </h2>

          <div className="max-w-md lg:justify-self-end">
            <p className="text-[0.9rem] leading-relaxed text-charcoal/70 md:text-[0.95rem]">
              Whatever the brief maps to — a keynote, a series, a category
              ambassador, a private dinner — the same team handles it end-to-end.
            </p>
            <Link
              href="/how-we-work"
              className="mt-6 inline-flex items-center justify-center rounded-sm border border-charcoal/25 px-5 py-2.5 text-[0.8125rem] font-medium text-charcoal transition-colors hover:border-forest hover:bg-forest hover:text-cream"
            >
              Explore the model
            </Link>
          </div>
        </div>

        <ul className="mt-12 grid gap-3 md:mt-14 md:grid-cols-2 md:gap-4 lg:grid-cols-12">
          {WAYS.map((way) => {
            const Visual = WAY_VISUALS[way.visual];

            return (
              <li key={way.index} className={way.span}>
                <Link
                  href="/how-we-work"
                  className="group flex h-full min-h-64 flex-col justify-between gap-8 rounded-sm border border-charcoal/15 bg-transparent px-7 pb-8 pt-8 transition-colors duration-300 hover:border-forest/40 md:px-8 md:pb-9 md:pt-9 lg:min-h-74"
                >
                  <div className={`${way.visualClass} self-end`}>
                    <Visual />
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-display text-[1.35rem] leading-tight tracking-tight text-charcoal md:text-[1.5rem]">
                      {way.title}
                    </h3>
                    <p className="mt-3 max-w-sm text-[0.8125rem] leading-relaxed text-charcoal/70 md:text-[0.875rem]">
                      {way.body}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
