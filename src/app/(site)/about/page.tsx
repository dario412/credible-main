import { InProgressPlaceholder } from "@/components/in-progress-placeholder";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "About",
  description:
    "Credible Creators is a management agency for founders, operators and trusted voices in the expert economy.",
  path: "/about",
});

export default function AboutPage() {
  return <InProgressPlaceholder title="About — still in progress" />;
}
