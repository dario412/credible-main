import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Case studies",
  description: "Selected work from Credible Creators — bookings that became partnerships.",
  path: "/case-studies",
});

export default async function CaseStudiesPage() {
  const studies = await prisma.caseStudy.findMany({
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
        Case studies
      </p>
      <h1 className="mt-3 font-display text-4xl md:text-5xl">Selected work.</h1>
      <div className="mt-12 space-y-8">
        {studies.map((study) => (
          <Link
            key={study.id}
            href={`/case-studies/${study.slug}`}
            className="group block border-t border-charcoal/15 pt-8"
          >
            <h2 className="font-display text-2xl group-hover:text-forest md:text-3xl">
              {study.title}
            </h2>
            <p className="mt-3 max-w-2xl text-muted">{study.summary}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
