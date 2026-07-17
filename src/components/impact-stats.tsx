const stats = [
  {
    label: "Signed creators",
    value: "24",
    caption: "Across four archetypes",
  },
  {
    label: "Combined reach",
    value: "18.4M",
    caption: "LinkedIn, YouTube, podcasts",
  },
  {
    label: "Brand partners",
    value: "60+",
    caption: "HubSpot, Notion, Ramp, Vanta",
  },
  {
    label: "Stages booked",
    value: "142",
    caption: "Keynotes and podcast sessions",
  },
] as const;

export function ImpactStats() {
  return (
    <section className="bg-cream px-6 py-16 md:px-10 md:py-20 lg:px-12">
      <div className="mx-auto max-w-352">
        <h2 className="max-w-2xl font-display text-[2rem] leading-[1.12] tracking-tight text-charcoal sm:text-[2.4rem] md:text-[2.75rem]">
          Credible gives your brand
          <br />
          an unfair advantage.
        </h2>

        <ul className="mt-10 grid gap-3 sm:grid-cols-2 md:mt-12 md:gap-4 lg:grid-cols-4">
          {stats.map((stat) => (
            <li
              key={stat.label}
              className="flex min-h-44 flex-col justify-between rounded-sm bg-[#E4EBE6] px-6 pb-6 pt-7 md:min-h-50"
            >
              <p className="font-display text-[2.6rem] leading-none tracking-tight text-charcoal md:text-[3rem]">
                {stat.value}
              </p>
              <div className="mt-8">
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-charcoal/60">
                  {stat.label}
                </p>
                <p className="mt-1.5 text-[0.75rem] leading-relaxed text-charcoal/70">
                  {stat.caption}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
