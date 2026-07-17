import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";
import { LeadStatusForm } from "@/components/lead-status-form";
import { createMetadata } from "@/lib/seo";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  return createMetadata({
    title: `Lead ${id.slice(0, 8)}`,
    path: `/admin/leads/${id}`,
    noIndex: true,
  });
}

export default async function AdminLeadDetailPage({ params }: Props) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (!hasPermission(session.user.role, "VIEW_LEADS")) redirect("/admin");

  const { id } = await params;
  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead) notFound();

  return (
    <div className="max-w-2xl">
      <Link href="/admin/leads" className="text-sm text-muted hover:text-forest">
        ← All submissions
      </Link>
      <h1 className="mt-4 font-display text-3xl">Submission</h1>
      <dl className="mt-8 space-y-4 text-sm">
        <Row label="Email" value={lead.email} />
        <Row label="Name" value={lead.name ?? "—"} />
        <Row label="Company" value={lead.company ?? "—"} />
        <Row label="Source" value={lead.source} />
        <Row label="Submitted" value={lead.createdAt.toLocaleString("en-GB")} />
      </dl>
      {lead.message ? (
        <div className="mt-8">
          <p className="text-xs uppercase tracking-wide text-muted">Message</p>
          <p className="mt-2 whitespace-pre-wrap leading-relaxed">{lead.message}</p>
        </div>
      ) : null}
      <div className="mt-10">
        <LeadStatusForm id={lead.id} status={lead.status} />
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[7rem_1fr] gap-3 border-b border-charcoal/10 pb-3">
      <dt className="text-muted">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
