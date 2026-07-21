import { InProgressPlaceholder } from "@/components/in-progress-placeholder";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "What we do",
  description:
    "Four ways to put an expert voice behind your brand — content, brand partnerships, speaking, and live events.",
  path: "/what-we-do",
});

export default function WhatWeDoPage() {
  return <InProgressPlaceholder title="What we do — still in progress" />;
}
