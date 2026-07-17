import { createMetadata } from "@/lib/seo";
import { ContactForm } from "@/components/contact-form";

export const metadata = createMetadata({
  title: "Contact",
  description: "Book talent or get in touch with Credible Creators.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="grid gap-14 lg:grid-cols-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
            Contact
          </p>
          <h1 className="mt-3 font-display text-4xl md:text-5xl">
            Let’s talk bookings.
          </h1>
          <p className="mt-5 max-w-md text-muted">
            Tell us about your event, campaign or partnership brief. Our team
            will match you with the right expert from the roster.
          </p>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
