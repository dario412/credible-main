import { InProgressPlaceholder } from "@/components/in-progress-placeholder";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Case studies",
  description:
    "Selected work from Credible Creators — bookings that became partnerships.",
  path: "/case-studies",
});

export default function CaseStudiesPage() {
  return <InProgressPlaceholder title="Case studies — still in progress" />;
}
