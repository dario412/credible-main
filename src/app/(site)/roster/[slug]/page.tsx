import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { absoluteUrl, createMetadata } from "@/lib/seo";
import { ButtonLink } from "@/components/ui";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const experts = await prisma.expert.findMany({ select: { slug: true } });
  return experts.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const expert = await prisma.expert.findUnique({ where: { slug } });
  if (!expert) return {};
  return createMetadata({
    title: expert.seoTitle ?? expert.name,
    description: expert.seoDescription ?? expert.shortBio ?? expert.bio.slice(0, 160),
    path: `/roster/${expert.slug}`,
  });
}

export default async function ExpertPage({ params }: Props) {
  const { slug } = await params;
  const expert = await prisma.expert.findUnique({ where: { slug } });
  if (!expert) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: expert.name,
    jobTitle: expert.title,
    description: expert.shortBio ?? expert.bio,
    url: absoluteUrl(`/roster/${expert.slug}`),
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link
        href="/roster"
        className="text-sm text-muted transition-colors hover:text-forest"
      >
        ← Back to roster
      </Link>
      <div className="mt-8 max-w-3xl">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
          Expert
        </p>
        <h1 className="mt-3 font-display text-4xl md:text-5xl">{expert.name}</h1>
        <p className="mt-3 text-lg text-forest">{expert.title}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {[...expert.categories, ...expert.topics].map((tag) => (
            <span
              key={tag}
              className="border border-charcoal/15 px-2 py-0.5 text-xs uppercase tracking-wide text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="prose-credible mt-10">
          <p>{expert.bio}</p>
        </div>
        <div className="mt-10">
          <ButtonLink href="/contact" variant="primary">
            Enquire about booking
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
