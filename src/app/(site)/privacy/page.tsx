import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Privacy",
  description: "Privacy policy for Credible Creators.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-4xl">Privacy</h1>
      <div className="prose-credible mt-8">
        <p>
          Credible Creators collects personal information you submit through our
          website forms (such as name, email, company and message) so we can
          respond to enquiries and manage waitlist interest.
        </p>
        <p>
          We store form submissions securely and only use them for the purpose
          you contacted us. We do not sell your personal data. You may request
          access or deletion by contacting us at the email used for your enquiry.
        </p>
        <p>
          This site uses essential cookies required for admin authentication.
          Public browsing does not require an account.
        </p>
      </div>
    </div>
  );
}
