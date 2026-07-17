import { createMetadata } from "@/lib/seo";
import { ButtonLink } from "@/components/ui";

export const metadata = createMetadata({
  title: "What we do",
  description:
    "Credible Creators represents experts for keynotes, media, brand partnerships and advisory work.",
  path: "/what-we-do",
});

const services = [
  {
    title: "Speaking & stages",
    body: "Keynotes, panels and event curation with speakers who bring substance, not just spotlight.",
  },
  {
    title: "Brand partnerships",
    body: "Long-form collaborations between credible voices and brands that want authenticity.",
  },
  {
    title: "Media & content",
    body: "Podcasts, hosted series and editorial placements that extend expertise beyond the room.",
  },
  {
    title: "Advisory & retainers",
    body: "Ongoing counsel from founders and operators who have built what others only pitch.",
  },
];

export default function WhatWeDoPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
        What we do
      </p>
      <h1 className="mt-3 max-w-3xl font-display text-4xl md:text-5xl">
        Representation for the expert economy.
      </h1>
      <p className="mt-5 max-w-2xl text-lg text-muted">
        We manage bookings and partnerships for founders, operators and trusted
        voices — connecting them with organisations that need credibility.
      </p>
      <div className="mt-14 grid gap-8 md:grid-cols-2">
        {services.map((service) => (
          <article
            key={service.title}
            className="border-t border-charcoal/15 pt-6"
          >
            <h2 className="font-display text-2xl">{service.title}</h2>
            <p className="mt-3 leading-relaxed text-charcoal/80">{service.body}</p>
          </article>
        ))}
      </div>
      <div className="mt-14">
        <ButtonLink href="/contact" variant="primary">
          Start a booking enquiry
        </ButtonLink>
      </div>
    </div>
  );
}
