import Image from "next/image";
import Link from "next/link";

import { CASE_STUDY_LOGO, type CaseStudyCard } from "@/lib/case-studies";

export function CaseStudyClientMark({
  client,
  className,
}: {
  client: string;
  className?: string;
}) {
  return (
    <Image
      src={CASE_STUDY_LOGO}
      alt={client}
      width={40}
      height={40}
      className={
        className ??
        "size-9 object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)] md:size-10"
      }
    />
  );
}

export function CaseStudyArchiveCard({ study }: { study: CaseStudyCard }) {
  return (
    <Link
      href={`/case-studies/${study.slug}`}
      className="group block cursor-pointer"
    >
      <div className="relative flex aspect-16/10 items-center justify-center overflow-hidden rounded-sm bg-[#4A6356]">
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-b from-[#6B8575] to-[#3D5248] transition-opacity duration-500 group-hover:opacity-90"
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(circle at 50% 45%, rgba(249,243,239,0.18), transparent 55%)",
          }}
        />
        <CaseStudyClientMark
          client={study.client}
          className="relative z-2 size-14 object-contain transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 md:size-16"
        />
      </div>

      <h3 className="mt-3.5 font-display text-[1.15rem] leading-snug tracking-tight text-charcoal transition-colors group-hover:text-forest md:text-[1.25rem]">
        {study.title}
      </h3>
      <p className="mt-2 text-[10px] font-medium tracking-[0.12em] text-charcoal/45 uppercase">
        {study.pillar}
      </p>
    </Link>
  );
}
