import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const insights = await prisma.insight.findMany({ select: { slug: true } });
  return insights.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const insight = await prisma.insight.findUnique({ where: { slug } });
  if (!insight) return {};
  return createMetadata({
    title: insight.seoTitle ?? insight.title,
    description: insight.seoDescription ?? insight.excerpt,
    path: `/insights/${insight.slug}`,
  });
}

export default async function InsightPage({ params }: Props) {
  const { slug } = await params;
  const insight = await prisma.insight.findUnique({ where: { slug } });
  if (!insight) notFound();

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <Link href="/insights" className="text-sm text-muted hover:text-forest">
        ← Insights
      </Link>
      <article className="mt-8 max-w-3xl">
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
        <h1 className="mt-3 font-display text-4xl md:text-5xl">{insight.title}</h1>
        <p className="mt-4 text-lg text-muted">{insight.excerpt}</p>
        <div className="prose-credible mt-10">
          <p>{insight.body}</p>
        </div>
      </article>
    </div>
  );
}
