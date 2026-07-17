import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = createMetadata({
  title: "Insights",
  description: "Perspectives on the expert economy from Credible Creators.",
  path: "/insights",
});

export default async function InsightsPage() {
  const insights = await prisma.insight.findMany({
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
        Insights
      </p>
      <h1 className="mt-3 font-display text-4xl md:text-5xl">
        Thinking from the agency.
      </h1>
      <div className="mt-12 grid gap-8 md:grid-cols-2">
        {insights.map((insight) => (
          <Link
            key={insight.id}
            href={`/insights/${insight.slug}`}
            className="group border border-charcoal/10 p-6 transition-colors hover:border-forest"
          >
            <time
              dateTime={insight.publishedAt.toISOString()}
              className="text-xs uppercase tracking-wide text-muted"
            >
              {insight.publishedAt.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
            <h2 className="mt-3 font-display text-2xl group-hover:text-forest">
              {insight.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {insight.excerpt}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
