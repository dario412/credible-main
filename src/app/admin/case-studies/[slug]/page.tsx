import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { CaseStudyEditorForm } from "@/components/admin-case-study-editor";
import { getCaseStudyCard, saveCaseStudy } from "@/lib/actions/admin-cms";
import { auth } from "@/lib/auth";
import { loadCaseStudy } from "@/lib/case-studies-server";
import { hasPermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { createMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return createMetadata({
    title: `Edit case study · ${slug}`,
    path: `/admin/case-studies/${slug}`,
    noIndex: true,
  });
}

export default async function AdminEditCaseStudyPage({ params }: Props) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (!hasPermission(session.user.role, "MANAGE_CONTENT")) redirect("/admin");

  const { slug } = await params;
  const [fromDb, speakers] = await Promise.all([
    getCaseStudyCard(slug),
    prisma.expert.findMany({
      orderBy: { name: "asc" },
      select: { slug: true, name: true },
    }),
  ]);
  const study = fromDb ?? (await loadCaseStudy(slug));
  if (!study) notFound();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link
          href="/admin/case-studies"
          className="text-sm text-charcoal/55 hover:text-charcoal"
        >
          ← Case studies
        </Link>
        <h1 className="mt-3 font-display text-3xl">Edit case study</h1>
        <p className="mt-1 text-sm text-muted">{study.slug}</p>
      </div>
      <CaseStudyEditorForm
        initial={study}
        speakers={speakers}
        saveAction={saveCaseStudy}
      />
    </div>
  );
}
