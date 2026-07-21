import { InProgressPlaceholder } from "@/components/in-progress-placeholder";
import { createMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return createMetadata({
    title: "Case study",
    description: "This case study page is still in progress.",
    path: `/case-studies/${slug}`,
  });
}

export default async function CaseStudyPage({ params }: Props) {
  await params;
  return <InProgressPlaceholder title="Case study — still in progress" />;
}
