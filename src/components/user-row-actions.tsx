"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { setUserActive, updateUserRole } from "@/lib/actions/admin-users";
import type { Role } from "@/generated/prisma/enums";

export function UserRowActions({
  userId,
  role,
  active,
  isSelf,
}: {
  userId: string;
  role: Role;
  active: boolean;
  isSelf: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        className="border border-charcoal/20 bg-white px-2 py-1 text-xs"
        value={role}
        disabled={pending}
        onChange={(e) => {
          const next = e.target.value as Role;
          startTransition(async () => {
            await updateUserRole(userId, next);
            router.refresh();
          });
        }}
      >
        <option value="VIEWER">Viewer</option>
        <option value="EDITOR">Editor</option>
        <option value="OWNER">Owner</option>
      </select>
      <button
        type="button"
        disabled={pending || isSelf}
        className="text-xs text-forest hover:underline disabled:opacity-40"
        onClick={() => {
          startTransition(async () => {
            await setUserActive(userId, !active);
            router.refresh();
          });
        }}
      >
        {active ? "Deactivate" : "Activate"}
      </button>
    </div>
  );
}
