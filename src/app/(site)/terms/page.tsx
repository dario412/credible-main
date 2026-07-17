import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Terms",
  description: "Terms of use for Credible Creators.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-4xl">Terms</h1>
      <div className="prose-credible mt-8">
        <p>
          By using this website you agree to use it for lawful purposes only.
          Content on this site is provided for general information about Credible
          Creators and our roster.
        </p>
        <p>
          Bookings and commercial engagements are subject to separate agreements
          between Credible Creators, our talent, and the commissioning party.
        </p>
        <p>
          We may update these terms from time to time. Continued use of the site
          after changes constitutes acceptance of the revised terms.
        </p>
      </div>
    </div>
  );
}
