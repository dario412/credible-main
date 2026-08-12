"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { deleteCaseStudy, deleteInsight } from "@/lib/actions/admin-cms";

export function AdminDeleteButton({
  kind,
  value,
  label,
}: {
  kind: "insight" | "caseStudy";
  value: string;
  label: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function onDelete() {
    if (!window.confirm(`Delete ${label}? This cannot be undone.`)) return;

    startTransition(async () => {
      const result =
        kind === "insight"
          ? await deleteInsight(value)
          : await deleteCaseStudy(value);

      if (!result.ok) {
        setMessage(result.message);
        return;
      }

      router.refresh();
    });
  }

  return (
    <div className="inline-flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={onDelete}
        disabled={pending}
        className="font-medium text-danger transition-colors hover:text-danger/80 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? "Deleting..." : "Delete"}
      </button>
      {message ? <p className="text-[0.7rem] text-danger">{message}</p> : null}
    </div>
  );
}
