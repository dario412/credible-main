import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createMetadata } from "@/lib/seo";
import { RosterFilters } from "@/components/roster-filters";

export const metadata = createMetadata({
  title: "Roster",
  description:
    "Browse founders, operators, speakers and trusted voices represented by Credible Creators.",
  path: "/roster",
});

type SearchParams = Promise<{ category?: string; topic?: string; q?: string }>;

export default async function RosterPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const category = params.category?.toLowerCase();
  const topic = params.topic?.toLowerCase();
  const q = params.q?.trim();

  const all = await prisma.expert.findMany({ orderBy: { name: "asc" } });
  const categories = Array.from(
    new Set(all.flatMap((e) => e.categories)),
  ).sort();
  const topics = Array.from(new Set(all.flatMap((e) => e.topics))).sort();

  const experts = all.filter((expert) => {
    if (category && !expert.categories.map((c) => c.toLowerCase()).includes(category)) {
      return false;
    }
    if (topic && !expert.topics.map((t) => t.toLowerCase()).includes(topic)) {
      return false;
    }
    if (q) {
      const hay = `${expert.name} ${expert.title} ${expert.bio}`.toLowerCase();
      if (!hay.includes(q.toLowerCase())) return false;
    }
    return true;
  });

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
        Roster
      </p>
      <h1 className="mt-3 font-display text-4xl md:text-5xl">
        Experts we represent.
      </h1>
      <p className="mt-4 max-w-2xl text-muted">
        Filter by category or topic to find the right voice for your stage,
        campaign or partnership.
      </p>

      <div className="mt-10">
        <RosterFilters
          categories={categories}
          topics={topics}
          currentCategory={category}
          currentTopic={topic}
          currentQuery={q}
        />
      </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {experts.map((expert) => (
          <Link
            key={expert.id}
            href={`/roster/${expert.slug}`}
            className="group border border-charcoal/10 bg-white/40 p-6 transition-colors hover:border-forest"
          >
            <p className="font-display text-2xl group-hover:text-forest">
              {expert.name}
            </p>
            <p className="mt-2 text-sm text-muted">{expert.title}</p>
            <p className="mt-4 line-clamp-3 text-sm leading-relaxed">
              {expert.shortBio}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {expert.categories.map((c) => (
                <span
                  key={c}
                  className="border border-charcoal/15 px-2 py-0.5 text-xs uppercase tracking-wide text-muted"
                >
                  {c}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>

      {experts.length === 0 ? (
        <p className="mt-12 text-muted">No experts match these filters.</p>
      ) : null}
    </div>
  );
}
