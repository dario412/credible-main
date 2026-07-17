import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createMetadata } from "@/lib/seo";
import { ButtonLink } from "@/components/ui";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const study = await prisma.caseStudy.findUnique({ where: { slug } });
  if (!study) return {};
  return createMetadata({
    title: study.seoTitle ?? study.title,
    description: study.seoDescription ?? study.summary,
    path: `/case-studies/${study.slug}`,
  });
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const study = await prisma.caseStudy.findUnique({ where: { slug } });
  if (!study) notFound();

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <Link href="/case-studies" className="text-sm text-muted hover:text-forest">
        ← Case studies
      </Link>
      <article className="mt-8 max-w-3xl">
        <h1 className="font-display text-4xl md:text-5xl">{study.title}</h1>
        <p className="mt-4 text-lg text-muted">{study.summary}</p>
        <div className="prose-credible mt-10">
          <p>{study.body}</p>
        </div>
        {study.relatedExperts.length > 0 ? (
          <div className="mt-10">
            <p className="text-xs uppercase tracking-[0.14em] text-muted">
              Featured experts
            </p>
            <ul className="mt-3 space-y-2">
              {study.relatedExperts.map((s) => (
                <li key={s}>
                  <Link href={`/roster/${s}`} className="text-forest hover:text-forest-dark">
                    {s.replace(/-/g, " ")}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <div className="mt-12">
          <ButtonLink href="/contact" variant="primary">
            Talk to us about a similar brief
          </ButtonLink>
        </div>
      </article>
    </div>
  );
}
