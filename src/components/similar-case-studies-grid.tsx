"use client";

import { FadeUp } from "@/components/fade-up";
import { CaseStudyArchiveCard } from "@/components/case-study-archive-card";
import type { CaseStudyCard } from "@/lib/case-studies";

export function SimilarCaseStudiesGrid({
  studies,
}: {
  studies: CaseStudyCard[];
}) {
  return (
    <ul className="mt-8 grid gap-8 sm:grid-cols-2 md:mt-10 lg:grid-cols-3 lg:gap-10">
      {studies.map((item, index) => (
        <li key={item.slug}>
          <FadeUp delay={index * 160} duration={1200} y={24} threshold={0.15}>
            <CaseStudyArchiveCard study={item} />
          </FadeUp>
        </li>
      ))}
    </ul>
  );
}
