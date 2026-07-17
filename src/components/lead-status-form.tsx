"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { updateLeadStatus } from "@/lib/actions/admin-leads";
import type { LeadStatus } from "@/generated/prisma/enums";
import { Button } from "@/components/ui";

export function LeadStatusForm({
  id,
  status,
}: {
  id: string;
  status: LeadStatus;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function setStatus(next: LeadStatus) {
    startTransition(async () => {
      await updateLeadStatus(id, next);
      router.refresh();
    });
  }

  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted">Status</p>
      <p className="mt-1 text-sm font-medium">{status}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          type="button"
          variant="secondary"
          disabled={pending || status === "READ"}
          onClick={() => setStatus("READ")}
        >
          Mark read
        </Button>
        <Button
          type="button"
          variant="secondary"
          disabled={pending || status === "ARCHIVED"}
          onClick={() => setStatus("ARCHIVED")}
        >
          Archive
        </Button>
        <Button
          type="button"
          variant="ghost"
          disabled={pending || status === "NEW"}
          onClick={() => setStatus("NEW")}
        >
          Mark new
        </Button>
      </div>
    </div>
  );
}
