import type { Metadata } from "next";

import { LegalPageView } from "@/components/legal-page-view";
import { getLegalPageSections } from "@/lib/actions/admin-cms";
import { getLegalPage } from "@/lib/legal-pages";
import { createMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const sections = await getLegalPageSections();
  const page = getLegalPage(sections, "terms");
  return createMetadata({
    title: page.title,
    description: page.metaDescription,
    path: "/terms",
  });
}

export default async function TermsPage() {
  const sections = await getLegalPageSections();
  const page = getLegalPage(sections, "terms");
  return <LegalPageView page={page} />;
}
