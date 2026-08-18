"use client";

import { useRouter } from "next/navigation";
import { useId, useState, useTransition } from "react";
import {
  setUserActive,
  setUserPassword,
  updateUserRole,
} from "@/lib/actions/admin-users";
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
  const passwordId = useId();
  const [pending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  return (
    <div className="flex min-w-[14rem] flex-col items-start gap-2">
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
        <button
          type="button"
          disabled={pending}
          className="text-xs text-forest hover:underline disabled:opacity-40"
          onClick={() => {
            setShowPassword((open) => !open);
            setPassword("");
            setMessage(null);
          }}
        >
          {showPassword ? "Cancel" : "Set password"}
        </button>
      </div>

      {showPassword ? (
        <form
          className="flex w-full max-w-xs flex-col gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            startTransition(async () => {
              const result = await setUserPassword(userId, password);
              setOk(result.ok);
              setMessage(result.message);
              if (result.ok) {
                setPassword("");
                setShowPassword(false);
              }
            });
          }}
        >
          <label htmlFor={passwordId} className="sr-only">
            New password
          </label>
          <div className="flex gap-2">
            <input
              id={passwordId}
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="min-w-0 flex-1 border border-charcoal/20 bg-white px-2 py-1 text-xs"
            />
            <button
              type="submit"
              disabled={pending}
              className="shrink-0 text-xs font-medium text-forest hover:underline disabled:opacity-40"
            >
              {pending ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      ) : null}

      {message ? (
        <p className={`text-[0.7rem] ${ok ? "text-success" : "text-danger"}`}>
          {message}
        </p>
      ) : null}
    </div>
  );
}
