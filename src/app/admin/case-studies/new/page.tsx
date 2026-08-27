import Link from "next/link";
import { redirect } from "next/navigation";

import { CaseStudyEditorForm } from "@/components/admin-case-study-editor";
import { saveCaseStudy } from "@/lib/actions/admin-cms";
import { auth } from "@/lib/auth";
import type { CaseStudyCard } from "@/lib/case-studies";
import { DEFAULT_CASE_STUDY_PILLAR } from "@/lib/case-studies";
import { hasPermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "New project",
  path: "/admin/case-studies/new",
  noIndex: true,
});

const blank: CaseStudyCard = {
  slug: "",
  client: "",
  title: "",
  summary: "",
  pillar: DEFAULT_CASE_STUDY_PILLAR,
  pillars: [DEFAULT_CASE_STUDY_PILLAR],
  clientType: "Direct client",
  industry: "",
  size: "",
  period: "",
  relatedExperts: [],
  coverImage: "/images/case-studies/notion.jpg",
  featured: false,
  blocks: [],
};

export default async function AdminNewCaseStudyPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (!hasPermission(session.user.role, "MANAGE_CONTENT")) redirect("/admin");

  const speakers = await prisma.expert.findMany({
    orderBy: { name: "asc" },
    select: { slug: true, name: true },
  });

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link
          href="/admin/case-studies"
          className="text-sm text-charcoal/55 hover:text-charcoal"
        >
          ← Projects
        </Link>
        <h1 className="mt-3 font-display text-3xl">New project</h1>
      </div>
      <CaseStudyEditorForm
        initial={blank}
        speakers={speakers}
        saveAction={saveCaseStudy}
      />
    </div>
  );
}
