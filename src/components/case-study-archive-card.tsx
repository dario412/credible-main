import Link from "next/link";

import {
  caseStudyLogoNeedsInvert,
  resolveCaseStudyClientLogo,
} from "@/lib/brand-logos";
import { formatCaseStudyPillars, projectHref, type CaseStudyCard } from "@/lib/case-studies";
import { logoAltFor, resolveImageAlt } from "@/lib/image-alt";
import { cn } from "@/lib/utils";

export type CaseStudyClientMarkSize = "sm" | "md" | "lg";

const CLIENT_MARK_SIZES: Record<
  CaseStudyClientMarkSize,
  { box: string; img: string }
> = {
  sm: {
    box: "h-10 max-w-[9rem] md:h-11 md:max-w-[10rem]",
    img: "h-10 w-auto max-w-full md:h-11",
  },
  md: {
    box: "h-14 max-w-[11rem] md:h-16 md:max-w-[12rem]",
    img: "h-14 w-auto max-w-full md:h-16",
  },
  lg: {
    box: "h-14 max-w-[12rem] sm:h-16 sm:max-w-[14rem] md:h-[4.5rem] md:max-w-[16rem] lg:h-20 lg:max-w-[18rem]",
    img: "h-14 w-auto max-w-full sm:h-16 md:h-[4.5rem] lg:h-20",
  },
};

export function CaseStudyClientMark({
  client,
  logo,
  logoAlt,
  size = "sm",
  tone = "dark",
  className,
}: {
  client: string;
  logo?: string | null;
  logoAlt?: string | null;
  size?: CaseStudyClientMarkSize;
  /** Dark = white wordmark on forest cards; light = stored mark on pale surfaces. */
  tone?: "dark" | "light";
  className?: string;
}) {
  const preset = CLIENT_MARK_SIZES[size];
  const src = resolveCaseStudyClientLogo(client, logo, { tone });
  const invert = tone === "dark" && caseStudyLogoNeedsInvert(src);

  return (
    <div
      className={cn("flex shrink-0 items-center justify-center", preset.box, className)}
    >
      {/* Native img — CMS SVG/PNG logos render reliably on dark cards (next/image does not). */}
      <img
        src={src}
        alt={resolveImageAlt(logoAlt, logoAltFor(client))}
        className={cn(
          preset.img,
          "object-contain object-center drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)]",
          invert && "brightness-0 invert",
        )}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

export function CaseStudyArchiveCard({ study }: { study: CaseStudyCard }) {
  return (
    <Link
      href={projectHref(study.slug)}
      className="group block cursor-pointer"
    >
      <div className="relative flex aspect-16/10 items-center justify-center overflow-hidden rounded-sm bg-[#4A6356]">
        <div
          aria-hidden
          className="absolute inset-0 z-0 bg-linear-to-b from-[#6B8575] to-[#3D5248] transition-opacity duration-500 group-hover:opacity-90"
        />
        <div
          aria-hidden
          className="absolute inset-0 z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(circle at 50% 45%, rgba(249,243,239,0.18), transparent 55%)",
          }}
        />
        <CaseStudyClientMark
          client={study.client}
          logo={study.logo}
          logoAlt={study.logoAlt}
          size="md"
          tone="dark"
          className="relative z-10 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
        />
      </div>

      <h3 className="mt-3.5 font-display text-[1.15rem] leading-snug tracking-tight text-charcoal transition-colors group-hover:text-forest md:text-[1.25rem]">
        {study.title}
      </h3>
      <p className="mt-2 text-[10px] font-medium tracking-[0.12em] text-charcoal/45 uppercase">
        {formatCaseStudyPillars(study)}
      </p>
    </Link>
  );
}
