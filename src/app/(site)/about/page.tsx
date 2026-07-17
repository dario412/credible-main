import { createMetadata } from "@/lib/seo";
import { ButtonLink } from "@/components/ui";

export const metadata = createMetadata({
  title: "About",
  description:
    "Credible Creators is a management agency for founders, operators and trusted voices in the expert economy.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
        About
      </p>
      <h1 className="mt-3 max-w-3xl font-display text-4xl md:text-5xl">
        Built for credibility.
      </h1>
      <div className="prose-credible mt-10 max-w-2xl">
        <p>
          Credible Creators is a talent and management agency for the expert
          economy. We represent founders, operators, speakers and trusted voices —
          and every booking runs through our team.
        </p>
        <p>
          Our roster is curated for substance: people who have built companies,
          led teams, and earned the right to speak. We place them on stages, in
          media, and inside brand partnerships that last beyond a single event.
        </p>
      </div>
      <div className="mt-12 flex flex-wrap gap-4">
        <ButtonLink href="/roster" variant="secondary">
          Meet the roster
        </ButtonLink>
        <ButtonLink href="/contact" variant="primary">
          Get in touch
        </ButtonLink>
      </div>
    </div>
  );
}
