"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { TextInput } from "@/components/ui";
import { cn } from "@/lib/utils";

export function RosterFilters({
  categories,
  topics,
  currentCategory,
  currentTopic,
  currentQuery,
}: {
  categories: string[];
  topics: string[];
  currentCategory?: string;
  currentTopic?: string;
  currentQuery?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();
  const [query, setQuery] = useState(currentQuery ?? "");

  useEffect(() => {
    setQuery(currentQuery ?? "");
  }, [currentQuery]);

  useEffect(() => {
    const handle = setTimeout(() => {
      if ((currentQuery ?? "") === query) return;
      update({ q: query || undefined });
    }, 300);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  function update(next: Record<string, string | undefined>) {
    const params = new URLSearchParams();
    const category =
      next.category !== undefined ? next.category : currentCategory;
    const topic = next.topic !== undefined ? next.topic : currentTopic;
    const q = next.q !== undefined ? next.q : currentQuery;
    if (category) params.set("category", category);
    if (topic) params.set("topic", topic);
    if (q) params.set("q", q);
    const qs = params.toString();
    startTransition(() => {
      router.push(qs ? `${pathname}?${qs}` : pathname);
    });
  }

  return (
    <div className={cn("space-y-5", pending && "opacity-70")}>
      <TextInput
        placeholder="Search experts"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search experts"
      />
      <div>
        <p className="mb-2 text-xs uppercase tracking-[0.12em] text-muted">
          Category
        </p>
        <div className="flex flex-wrap gap-2">
          <FilterChip
            active={!currentCategory}
            onClick={() => update({ category: undefined })}
            label="All"
          />
          {categories.map((c) => (
            <FilterChip
              key={c}
              active={currentCategory === c}
              onClick={() => update({ category: c })}
              label={c}
            />
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs uppercase tracking-[0.12em] text-muted">
          Topic
        </p>
        <div className="flex flex-wrap gap-2">
          <FilterChip
            active={!currentTopic}
            onClick={() => update({ topic: undefined })}
            label="All"
          />
          {topics.map((t) => (
            <FilterChip
              key={t}
              active={currentTopic === t}
              onClick={() => update({ topic: t })}
              label={t}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "border px-3 py-1.5 text-sm capitalize transition-colors",
        active
          ? "border-forest bg-forest text-white"
          : "border-charcoal/20 bg-transparent text-charcoal hover:border-forest",
      )}
    >
      {label}
    </button>
  );
}
