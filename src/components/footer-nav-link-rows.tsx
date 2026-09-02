"use client";

import { Button, Field, TextInput } from "@/components/ui";
import { emptyNavLink, type NavLink } from "@/lib/site-chrome";

function MoveButtons({
  index,
  total,
  onMove,
}: {
  index: number;
  total: number;
  onMove: (from: number, to: number) => void;
}) {
  return (
    <div className="flex gap-1">
      <button
        type="button"
        disabled={index === 0}
        onClick={() => onMove(index, index - 1)}
        className="rounded-sm border border-charcoal/15 px-2 py-0.5 text-xs text-charcoal/70 disabled:opacity-30"
        aria-label="Move up"
      >
        ↑
      </button>
      <button
        type="button"
        disabled={index >= total - 1}
        onClick={() => onMove(index, index + 1)}
        className="rounded-sm border border-charcoal/15 px-2 py-0.5 text-xs text-charcoal/70 disabled:opacity-30"
        aria-label="Move down"
      >
        ↓
      </button>
    </div>
  );
}

export function FooterNavLinkRows({
  links,
  onChange,
  idPrefix,
  compact = false,
}: {
  links: NavLink[];
  onChange: (links: NavLink[]) => void;
  idPrefix: string;
  compact?: boolean;
}) {
  function move(from: number, to: number) {
    if (to < 0 || to >= links.length) return;
    const next = [...links];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item!);
    onChange(next);
  }

  return (
    <div className="space-y-3">
      {links.map((link, index) => (
        <div
          key={`${idPrefix}-${index}`}
          className={
            compact
              ? "space-y-2 rounded-sm border border-charcoal/10 bg-white p-3"
              : "flex flex-col gap-2 rounded-sm border border-charcoal/10 bg-cream/40 p-3 sm:flex-row sm:items-end"
          }
        >
          <div className="flex-1">
            <Field label="Label" id={`${idPrefix}-label-${index}`}>
              <TextInput
                id={`${idPrefix}-label-${index}`}
                value={link.label}
                onChange={(e) => {
                  const next = [...links];
                  next[index] = { ...link, label: e.target.value };
                  onChange(next);
                }}
              />
            </Field>
          </div>
          <div className="flex-1">
            <Field label="URL" id={`${idPrefix}-href-${index}`}>
              <TextInput
                id={`${idPrefix}-href-${index}`}
                value={link.href}
                onChange={(e) => {
                  const next = [...links];
                  next[index] = { ...link, href: e.target.value };
                  onChange(next);
                }}
              />
            </Field>
          </div>
          <div
            className={
              compact
                ? "flex items-center gap-2"
                : "flex items-center gap-2 pb-0.5"
            }
          >
            <MoveButtons index={index} total={links.length} onMove={move} />
            <button
              type="button"
              onClick={() => onChange(links.filter((_, i) => i !== index))}
              className="text-xs font-medium text-danger hover:underline"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
      <Button
        type="button"
        variant="ghost"
        className="px-0! py-1! text-sm text-forest hover:text-forest-dark"
        onClick={() => onChange([...links, emptyNavLink()])}
      >
        + Add link
      </Button>
    </div>
  );
}
