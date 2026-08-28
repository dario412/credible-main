import type { Metadata } from "next";

import { LegalPageView } from "@/components/legal-page-view";
import { getLegalPageSections } from "@/lib/actions/admin-cms";
import { getLegalPage } from "@/lib/legal-pages";
import { createMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const sections = await getLegalPageSections();
  const page = getLegalPage(sections, "accessibility");
  return createMetadata({
    title: page.title,
    description: page.metaDescription,
    path: "/accessibility",
  });
}

export default async function AccessibilityPage() {
  const sections = await getLegalPageSections();
  const page = getLegalPage(sections, "accessibility");
  return <LegalPageView page={page} />;
}
