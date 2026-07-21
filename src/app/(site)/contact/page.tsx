import { InProgressPlaceholder } from "@/components/in-progress-placeholder";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Send brief",
  description: "Book talent or get in touch with Credible Creators.",
  path: "/contact",
});

export default function ContactPage() {
  return <InProgressPlaceholder title="Send brief — still in progress" />;
}
