import Link from "next/link";

const ways = [
  {
    index: "01",
    title: "Brand partnerships",
    body: "Campaign work with creators your buyers already trust — long-form and considered, not a one-post drop.",
    span: "lg:col-span-7",
    visual: "brand" as const,
  },
  {
    index: "02",
    title: "Ambassador programs",
    body: "Category ambassadors and retainers that embed a credible voice into your brand for the long haul.",
    span: "lg:col-span-5",
    visual: "none" as const,
  },
  {
    index: "03",
    title: "Speaking engagements",
    body: "Keynotes, panels, fireside chats and closed-door executive sessions. Bureau-quality booking.",
    span: "lg:col-span-5",
    visual: "none" as const,
  },
  {
    index: "04",
    title: "Live events",
    body: "Creators attend and amplify your event — presence, content and credibility that give the room lasting reach.",
    span: "lg:col-span-7",
    visual: "live" as const,
  },
] as const;

/** Editorial placements — a creator accumulates brand work over time */
function BrandVisual() {
  const placements = [
    { x: 148, y: 46, delay: "0s", rot: "-4" },
    { x: 162, y: 62, delay: "0.7s", rot: "2" },
    { x: 154, y: 80, delay: "1.4s", rot: "-1.5" },
  ] as const;

  return (
    <div className="flex shrink-0 items-center justify-center lg:justify-end">
      <svg
        className="ra-illo"
        viewBox="0 0 300 176"
        role="img"
        aria-label="A creator builds an ongoing run of brand placements and stories."
      >
        {/* creator portrait arch */}
        <path
          d="M42 148 V72 A40 40 0 0 1 122 72 V148"
          fill="var(--ra-ink)"
          fillOpacity="0.05"
          stroke="var(--ra-ink)"
          strokeWidth="1.5"
        />
        <circle
          className="ra-expert-halo"
          cx="82"
          cy="84"
          r="16"
          fill="none"
          stroke="var(--ra-ink)"
          strokeWidth="1"
        />
        <circle cx="82" cy="84" r="10" fill="var(--ra-ink)" />
        <circle cx="82" cy="84" r="3.5" fill="#f9f3ef" opacity="0.35" />

        {/* soft desk / stage line */}
        <line
          x1="38"
          y1="148"
          x2="262"
          y2="148"
          stroke="var(--ra-sage)"
          strokeWidth="1"
          opacity="0.4"
        />

        {/* fanned editorial pieces */}
        {placements.map((p) => (
          <g
            key={p.delay}
            transform={`translate(${p.x} ${p.y}) rotate(${p.rot})`}
          >
            <g className="ra-place" style={{ animationDelay: p.delay }}>
              <rect
                width="92"
                height="58"
                rx="3"
                fill="#fbf8f5"
                stroke="var(--ra-ink)"
                strokeWidth="1.2"
              />
              {/* brand chip */}
              <rect
                x="8"
                y="8"
                width="18"
                height="18"
                rx="2"
                fill="var(--ra-ink)"
                opacity="0.85"
              />
              {/* headline + deck lines */}
              <rect
                x="32"
                y="10"
                width="48"
                height="4"
                rx="1"
                fill="var(--ra-ink)"
                opacity="0.45"
              />
              <rect
                x="32"
                y="18"
                width="36"
                height="3"
                rx="1"
                fill="var(--ra-sage)"
              />
              <rect
                x="8"
                y="34"
                width="76"
                height="2.5"
                rx="1"
                fill="var(--ra-sage)"
                opacity="0.85"
              />
              <rect
                x="8"
                y="41"
                width="70"
                height="2.5"
                rx="1"
                fill="var(--ra-sage)"
                opacity="0.65"
              />
              <rect
                x="8"
                y="48"
                width="58"
                height="2.5"
                rx="1"
                fill="var(--ra-sage)"
                opacity="0.5"
              />
              <circle cx="14" cy="28" r="3" fill="var(--ra-ink)" opacity="0.55" />
              <rect
                x="20"
                y="26.5"
                width="28"
                height="2.5"
                rx="1"
                fill="var(--ra-ink)"
                opacity="0.3"
              />
            </g>
          </g>
        ))}
      </svg>
    </div>
  );
}

/** Reach — audience seats, more content paths, tighter ring stagger */
function LiveVisual() {
  const seats = [
    [118, 108],
    [134, 114],
    [150, 116],
    [166, 114],
    [182, 108],
    [126, 126],
    [150, 130],
    [174, 126],
  ] as const;

  return (
    <div className="flex shrink-0 items-center justify-center lg:justify-end">
      <svg
        className="ra-illo"
        viewBox="0 0 300 176"
        role="img"
        aria-label="An expert stands in the venue and sends rings of reach and content beyond its walls."
      >
        <g fill="var(--ra-sage)">
          <circle cx="24" cy="52" r="3" />
          <circle cx="24" cy="72" r="3.2" />
          <circle cx="24" cy="92" r="3" />
          <circle cx="24" cy="112" r="3.2" />
          <circle cx="40" cy="62" r="2.8" />
          <circle cx="40" cy="88" r="2.8" />
          <circle cx="40" cy="114" r="2.8" />
        </g>

        <rect
          x="86"
          y="40"
          width="150"
          height="96"
          rx="14"
          fill="var(--ra-ink)"
          fillOpacity="0.03"
          stroke="var(--ra-sage)"
          strokeWidth="1"
          strokeDasharray="4 5"
        />
        <path
          d="M108 56 H214"
          stroke="var(--ra-sage)"
          strokeWidth="1"
          opacity="0.55"
        />

        {seats.map(([cx, cy], i) => (
          <circle
            key={`${cx}-${cy}`}
            className="ra-seat"
            style={{ animationDelay: `${i * 0.1}s` }}
            cx={cx}
            cy={cy}
            r="2.4"
            fill="var(--ra-ink-2)"
          />
        ))}

        <g fill="none" stroke="var(--ra-ink)">
          <circle
            className="ra-ring"
            style={{ animationDelay: "0s" }}
            cx="150"
            cy="88"
          />
          <circle
            className="ra-ring"
            style={{ animationDelay: "0.7s" }}
            cx="150"
            cy="88"
          />
          <circle
            className="ra-ring"
            style={{ animationDelay: "1.4s" }}
            cx="150"
            cy="88"
          />
          <circle
            className="ra-ring"
            style={{ animationDelay: "2.1s" }}
            cx="150"
            cy="88"
          />
        </g>

        <circle
          className="ra-content"
          style={{ animationDelay: "0.25s" }}
          cx="150"
          cy="88"
          r="4"
          fill="var(--ra-ink-2)"
        />
        <circle
          className="ra-content2"
          style={{ animationDelay: "1.1s" }}
          cx="150"
          cy="88"
          r="4"
          fill="var(--ra-ink-2)"
        />
        <circle
          className="ra-content3"
          style={{ animationDelay: "1.9s" }}
          cx="150"
          cy="88"
          r="3.5"
          fill="var(--ra-ink)"
        />

        <circle
          className="ra-expert-halo"
          cx="150"
          cy="88"
          r="11"
          style={{ animationDuration: "2.8s" }}
        />
        <circle
          className="ra-node-p"
          cx="150"
          cy="88"
          r="7"
          fill="var(--ra-ink)"
        />
      </svg>
    </div>
  );
}

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
              href="/what-we-do"
              className="mt-6 inline-flex items-center justify-center rounded-sm border border-charcoal/25 px-5 py-2.5 text-[0.8125rem] font-medium text-charcoal transition-colors hover:border-forest hover:bg-forest hover:text-cream"
            >
              Explore the model
            </Link>
          </div>
        </div>

        <ul className="mt-12 grid gap-3 md:mt-14 md:grid-cols-2 md:gap-4 lg:grid-cols-12">
          {ways.map((way) => (
            <li key={way.index} className={way.span}>
              <Link
                href="/what-we-do"
                className="group flex h-full min-h-[16rem] flex-col gap-6 rounded-sm border border-charcoal/15 bg-transparent px-7 pb-8 pt-11 transition-colors duration-300 hover:border-forest/40 md:px-8 md:pb-9 md:pt-12 lg:min-h-[18.5rem] lg:flex-row lg:items-end lg:justify-end lg:gap-8"
              >
                <div className="flex min-w-0 flex-1 flex-col justify-end">
                  <h3 className="font-display text-[1.35rem] leading-tight tracking-tight text-charcoal md:text-[1.5rem]">
                    {way.title}
                  </h3>
                  <p className="mt-3 max-w-sm text-[0.8125rem] leading-relaxed text-charcoal/70 md:text-[0.875rem]">
                    {way.body}
                  </p>
                </div>

                {way.visual === "brand" ? <BrandVisual /> : null}
                {way.visual === "live" ? <LiveVisual /> : null}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
