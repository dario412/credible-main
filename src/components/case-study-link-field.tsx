"use client";

import { Field } from "@/components/ui";

export type CaseStudyLinkOption = {
  slug: string;
  label: string;
};

/** Pick an existing case study to power the Customer story pill. */
export function CaseStudyLinkField({
  id = "case-study-link",
  value,
  options,
  onChange,
}: {
  id?: string;
  value: string;
  options: CaseStudyLinkOption[];
  onChange: (slug: string) => void;
}) {
  const slug = value.trim();
  const known = options.some((option) => option.slug === slug);

  return (
    <Field
      label="Customer story (case study)"
      id={id}
      hint="Optional. Shows the Customer story button and links to that case study. Independent of the hover testimonial."
    >
      <select
        id={id}
        value={known ? slug : slug ? "__custom__" : ""}
        onChange={(e) => {
          const next = e.target.value;
          if (next === "__custom__") return;
          onChange(next);
        }}
        className="w-full rounded-sm border border-charcoal/25 bg-white px-3 py-2 text-sm text-charcoal"
      >
        <option value="">No customer story link</option>
        {options.map((option) => (
          <option key={option.slug} value={option.slug}>
            {option.label}
          </option>
        ))}
        {slug && !known ? (
          <option value="__custom__">{slug} (saved slug)</option>
        ) : null}
      </select>
    </Field>
  );
}
