"use client";

import { useState, useTransition } from "react";

import type { LegalPageDoc, LegalPageKey, LegalPagesSections } from "@/lib/legal-pages";

const tabs: { key: LegalPageKey; label: string; publicPath: string }[] = [
  { key: "privacy", label: "Privacy Policy", publicPath: "/privacy" },
  { key: "terms", label: "Terms of Service", publicPath: "/terms" },
  {
    key: "accessibility",
    label: "Accessibility Statement",
    publicPath: "/accessibility-statement",
  },
];

export function AdminLegalPagesEditor({
  initial,
  saveAction,
}: {
  initial: LegalPagesSections;
  saveAction: (
    sections: LegalPagesSections,
  ) => Promise<{ ok: boolean; message: string }>;
}) {
  const [sections, setSections] = useState(initial);
  const [activeTab, setActiveTab] = useState<LegalPageKey>("privacy");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const active = sections[activeTab];

  function updateActive(patch: Partial<LegalPageDoc>) {
    setSections((current) => ({
      ...current,
      [activeTab]: { ...current[activeTab], ...patch },
    }));
  }

  function handleSave() {
    startTransition(async () => {
      const result = await saveAction(sections);
      setMessage(result.message);
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`cursor-pointer rounded-sm border px-3 py-1.5 text-sm transition-colors ${
              activeTab === tab.key
                ? "border-charcoal bg-charcoal text-cream"
                : "border-charcoal/15 bg-white text-charcoal hover:border-charcoal/30"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <p className="text-sm text-muted">
        Editing{" "}
        <a
          href={tabs.find((tab) => tab.key === activeTab)?.publicPath}
          className="font-medium text-forest hover:text-forest-dark"
        >
          {tabs.find((tab) => tab.key === activeTab)?.publicPath}
        </a>
        . Body supports markdown headings, lists, links, bold text, and tables.
      </p>

      <div className="space-y-4 rounded-sm border border-charcoal/10 bg-white p-5">
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-charcoal">Page title</span>
          <input
            type="text"
            value={active.title}
            onChange={(event) => updateActive({ title: event.target.value })}
            className="w-full rounded-sm border border-charcoal/15 px-3 py-2 text-sm outline-none focus:border-forest"
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-charcoal">Effective date</span>
          <input
            type="text"
            value={active.effectiveDate}
            onChange={(event) =>
              updateActive({ effectiveDate: event.target.value })
            }
            className="w-full rounded-sm border border-charcoal/15 px-3 py-2 text-sm outline-none focus:border-forest"
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-charcoal">
            Meta description
          </span>
          <textarea
            value={active.metaDescription}
            onChange={(event) =>
              updateActive({ metaDescription: event.target.value })
            }
            rows={2}
            className="w-full rounded-sm border border-charcoal/15 px-3 py-2 text-sm outline-none focus:border-forest"
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-charcoal">Body (markdown)</span>
          <textarea
            value={active.body}
            onChange={(event) => updateActive({ body: event.target.value })}
            rows={24}
            className="w-full rounded-sm border border-charcoal/15 px-3 py-2 font-mono text-xs leading-relaxed outline-none focus:border-forest"
          />
        </label>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={pending}
          className="cursor-pointer rounded-sm bg-charcoal px-4 py-2 text-sm font-medium text-cream transition-colors hover:bg-charcoal/85 disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save legal pages"}
        </button>
        {message ? (
          <p className="text-sm text-charcoal/70" role="status">
            {message}
          </p>
        ) : null}
      </div>
    </div>
  );
}
