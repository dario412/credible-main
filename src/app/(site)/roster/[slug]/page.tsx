import { InProgressPlaceholder } from "@/components/in-progress-placeholder";
import { createMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return createMetadata({
    title: "Expert profile",
    description: "This expert profile is still in progress.",
    path: `/roster/${slug}`,
  });
}

export default async function ExpertPage({ params }: Props) {
  await params;
  return <InProgressPlaceholder title="Expert profile — still in progress" />;
}
