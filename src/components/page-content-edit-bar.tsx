"use client";

import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

export function PageContentEditBar({
  canEdit,
  editing,
  onToggleEditing,
  dirty,
  pending,
  onSave,
  onDiscard,
  adminHref,
  message,
  ok,
  className,
}: {
  canEdit: boolean;
  editing: boolean;
  onToggleEditing: () => void;
  dirty: boolean;
  pending: boolean;
  onSave: () => void;
  onDiscard: () => void;
  adminHref: string;
  message: string;
  ok: boolean;
  className?: string;
}) {
  if (!canEdit) return null;

  return (
    <div
      className={cn(
        "fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 flex-wrap items-center justify-center gap-2 rounded-sm border border-charcoal/10 bg-white/95 px-3 py-2 shadow-[0_12px_40px_rgba(28,26,23,0.14)] backdrop-blur",
        className,
      )}
    >
      <Button
        type="button"
        variant={editing ? "secondary" : "primary"}
        className="px-4! py-2! text-xs"
        onClick={onToggleEditing}
      >
        {editing ? "Done editing" : "Edit page"}
      </Button>
      {editing ? (
        <>
          <Button
            type="button"
            variant="primary"
            className="px-4! py-2! text-xs"
            disabled={!dirty || pending}
            onClick={onSave}
          >
            {pending ? "Saving…" : "Save"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="px-3! py-2! text-xs"
            disabled={!dirty || pending}
            onClick={onDiscard}
          >
            Discard
          </Button>
          <a
            href={adminHref}
            className="px-2 text-xs font-medium text-charcoal/55 hover:text-charcoal"
          >
            Full editor
          </a>
        </>
      ) : null}
      {message ? (
        <p className={`text-xs ${ok ? "text-success" : "text-danger"}`}>
          {message}
        </p>
      ) : null}
    </div>
  );
}
