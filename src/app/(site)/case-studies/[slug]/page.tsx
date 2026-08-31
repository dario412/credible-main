import { redirect } from "next/navigation";

import { projectHref } from "@/lib/case-studies";

type Props = { params: Promise<{ slug: string }> };

export default async function CaseStudyRedirectPage({ params }: Props) {
  const { slug } = await params;
  redirect(projectHref(slug));
}
