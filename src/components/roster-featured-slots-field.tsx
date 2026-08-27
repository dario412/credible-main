"use client";

import { Field } from "@/components/ui";

export type RosterFeaturedOption = {
  slug: string;
  name: string;
};

/** Four ordered selects for the homepage roster preview grid. */
export function RosterFeaturedSlotsField({
  options,
  value,
  fallbackSlugs = [],
  onChange,
}: {
  options: RosterFeaturedOption[];
  value: string[];
  /** Used when value is empty so slots mirror the current fallback preview. */
  fallbackSlugs?: string[];
  onChange: (next: string[]) => void;
}) {
  const slots = [0, 1, 2, 3].map((index) => {
    if (value[index]) return value[index]!;
    if (value.length === 0) return fallbackSlugs[index] ?? "";
    return "";
  });

  function setSlot(index: number, slug: string) {
    const next = [...slots];
    next[index] = slug;
    // Drop empties but keep order; dedupe later slots that collide.
    const seen = new Set<string>();
    const cleaned: string[] = [];
    for (const item of next) {
      if (!item || seen.has(item)) continue;
      seen.add(item);
      cleaned.push(item);
    }
    onChange(cleaned);
  }

  return (
    <div className="space-y-3">
      <p className="text-xs leading-relaxed text-charcoal/55">
        Choose which four creators appear in the homepage roster preview, in
        left-to-right order.
      </p>
      {slots.map((slug, index) => (
        <Field
          key={index}
          label={`Card ${index + 1}`}
          id={`roster-featured-${index}`}
        >
          <select
            id={`roster-featured-${index}`}
            value={slug}
            onChange={(e) => setSlot(index, e.target.value)}
            className="w-full rounded-sm border border-charcoal/25 bg-white px-3 py-2 text-sm text-charcoal"
          >
            <option value="">Select creator…</option>
            {options.map((option) => (
              <option
                key={option.slug}
                value={option.slug}
                disabled={
                  Boolean(option.slug) &&
                  slots.includes(option.slug) &&
                  option.slug !== slug
                }
              >
                {option.name}
              </option>
            ))}
          </select>
        </Field>
      ))}
    </div>
  );
}
