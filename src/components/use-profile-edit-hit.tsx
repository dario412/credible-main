"use client";

import type { ReactNode } from "react";

import { EditableHit } from "@/components/editable-hit";
import { useSiteChrome } from "@/components/site-chrome-context";

export function useProfileEditHit(field: string) {
  const { editing, canEdit, selected, setSelected } = useSiteChrome();
  return {
    active: editing && canEdit,
    selected: selected === field,
    onSelect: () => setSelected(field),
  };
}

export function ProfileEditHit({
  field,
  label,
  block,
  ringOffset = "ring-offset-cream",
  className,
  children,
}: {
  field: string;
  label: string;
  block?: boolean;
  ringOffset?: string;
  className?: string;
  children: ReactNode;
}) {
  const hit = useProfileEditHit(field);
  return (
    <EditableHit
      active={hit.active}
      selected={hit.selected}
      onSelect={hit.onSelect}
      label={label}
      block={block}
      ringOffset={ringOffset}
      className={className}
    >
      {children}
    </EditableHit>
  );
}
