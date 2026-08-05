"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { PatternField } from "@/components/pattern-field";
import { EditableHit } from "@/components/editable-hit";
import { useSiteChrome } from "@/components/site-chrome-context";
import { ShortlistMenu } from "@/components/shortlist-menu";
import type { SocialNetwork } from "@/lib/site-chrome";
import { cn } from "@/lib/utils";

const FOOTER_PATTERN_COLOR = { r: 249, g: 243, b: 239 };

function SocialIcon({ network }: { network: SocialNetwork }) {
  const className = "size-[22px]";
  if (network === "linkedin") {
    return (
      <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden className={className}>
        <path d="M216,24H40A16,16,0,0,0,24,40V216a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V40A16,16,0,0,0,216,24Zm0,192H40V40H216V216ZM96,112v64a8,8,0,0,1-16,0V112a8,8,0,0,1,16,0Zm88,28v36a8,8,0,0,1-16,0V140a20,20,0,0,0-40,0v36a8,8,0,0,1-16,0V112a8,8,0,0,1,15.79-1.78A36,36,0,0,1,184,140ZM100,84A12,12,0,1,1,88,72,12,12,0,0,1,100,84Z" />
      </svg>
    );
  }
  if (network === "youtube") {
    return (
      <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden className={className}>
        <path d="M164.44,121.34l-48-32A8,8,0,0,0,104,96v64a8,8,0,0,0,12.44,6.66l48-32a8,8,0,0,0,0-13.32ZM120,145.05V111l25.58,17ZM234.33,69.52a24,24,0,0,0-14.49-16.4C185.56,39.88,131,40,128,40s-57.56-.12-91.84,13.12a24,24,0,0,0-14.49,16.4C19.08,79.5,16,97.74,16,128s3.08,48.5,5.67,58.48a24,24,0,0,0,14.49,16.41C69,215.56,120.4,216,127.34,216h1.32c6.94,0,58.37-.44,91.18-13.11a24,24,0,0,0,14.49-16.41c2.59-10,5.67-28.22,5.67-58.48S236.92,79.5,234.33,69.52Zm-15.49,113a8,8,0,0,1-4.77,5.49c-31.65,12.22-85.48,12-86,12H128c-.54,0-54.33.2-86-12a8,8,0,0,1-4.77-5.49C34.8,173.39,32,156.57,32,128s2.8-45.39,5.16-54.47A8,8,0,0,1,41.93,68c30.52-11.79,81.66-12,85.85-12h.27c.54,0,54.38-.18,86,12a8,8,0,0,1,4.77,5.49C221.2,82.61,224,99.43,224,128S221.2,173.39,218.84,182.47Z" />
      </svg>
    );
  }
  if (network === "x") {
    return (
      <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden className={className}>
        <path d="M214.75,211.1l-62.6-98.35,61.4-66.85a8,8,0,0,0-11.9-10.7L143.07,98.93,95.16,23.6A8,8,0,0,0,88,20H40a8,8,0,0,0-6.63,12.5l66.35,104.25L36.9,211.1A8,8,0,0,0,42.75,224h47.41a8,8,0,0,0,6.63-3.5l48.56-66.6,41.05,64.5A8,8,0,0,0,193.25,224h47.41a8,8,0,0,0,6.63-12.5ZM92.41,40h18.31l94.87,149.1H187.28Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden className={className}>
      <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160ZM176,24H80A56.06,56.06,0,0,0,24,80v96a56.06,56.06,0,0,0,56,56h96a56.06,56.06,0,0,0,56-56V80A56.06,56.06,0,0,0,176,24Zm40,152a40,40,0,0,1-40,40H80a40,40,0,0,1-40-40V80A40,40,0,0,1,80,40h96a40,40,0,0,1,40,40ZM192,76a12,12,0,1,1-12-12A12,12,0,0,1,192,76Z" />
    </svg>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const { chrome } = useSiteChrome();
  const links = chrome.header.links;
  const insightArticle =
    /^\/insights\/[^/]+\/?$/.test(pathname) ||
    /^\/insights\/authors\//.test(pathname);
  // Full-bleed image heroes — nav sits inside the frame with inverted colors.
  const overlay =
    /^\/roster\/[^/]+\/?$/.test(pathname) ||
    /^\/case-studies\/[^/]+\/?$/.test(pathname);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;

      if (overlay) {
        setScrolled(y > window.innerHeight * 0.6);
        return;
      }

      setScrolled(y > 8);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [overlay]);

  const pageSurface = insightArticle ? "bg-cream-dark" : "bg-cream";
  // Over the stage image: invert the charcoal pill to cream with dark type.
  const onImage = overlay && !scrolled;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 overflow-visible px-6 pt-4 pb-3 transition-[padding,background-color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] md:px-10 md:pt-5 md:pb-4 lg:px-12",
        scrolled || overlay ? "bg-transparent" : pageSurface,
      )}
    >
      {/*
        One continuous frost layer — blur + tint share the same long mask so
        the falloff dissolves into whatever sits underneath (cream or charcoal)
        instead of banding at the header edge.
      */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 -z-10 h-[calc(100%+8rem)] transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
          scrolled ? "opacity-100" : "opacity-0",
        )}
        style={{
          background: insightArticle
            ? "linear-gradient(to bottom, rgba(228,235,230,0.72) 0%, rgba(228,235,230,0.28) 38%, rgba(228,235,230,0.06) 68%, transparent 100%)"
            : "linear-gradient(to bottom, rgba(249,243,239,0.72) 0%, rgba(249,243,239,0.28) 38%, rgba(249,243,239,0.06) 68%, transparent 100%)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          maskImage:
            "linear-gradient(to bottom, black 0%, black 18%, rgba(0,0,0,0.55) 48%, rgba(0,0,0,0.18) 72%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 18%, rgba(0,0,0,0.55) 48%, rgba(0,0,0,0.18) 72%, transparent 100%)",
        }}
      />

      <div className="mx-auto flex w-full max-w-352 items-stretch gap-1">
        <div
          className={cn(
            "flex flex-1 items-center gap-3 rounded-sm p-3 shadow-[0_10px_40px_rgba(28,26,23,0.12)] transition-[background-color,box-shadow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] md:gap-8 md:p-3.5",
            onImage ? "bg-cream" : "bg-charcoal",
          )}
        >
          <Link href="/" className="shrink-0 transition-opacity hover:opacity-80">
            <img
              src={
                onImage
                  ? "/brand/credible-wordmark.svg"
                  : "/brand/credible-wordmark-cream.svg"
              }
              alt="Credible"
              width={253}
              height={50}
              className="h-5 w-auto md:h-6"
            />
          </Link>

          <nav
            className="hidden flex-1 items-center justify-center gap-6 md:flex lg:gap-9"
            aria-label="Primary"
          >
            {links.map((link) => (
              <Link
                key={`${link.href}-${link.label}`}
                href={link.href}
                className={cn(
                  "text-[0.8125rem] transition-colors duration-300",
                  onImage
                    ? "text-charcoal/70 hover:text-charcoal"
                    : "text-cream/85 hover:text-cream",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <Link
          href={chrome.header.ctaHref}
          className="inline-flex shrink-0 items-center justify-center rounded-sm bg-forest px-5 text-[0.8125rem] font-medium text-cream shadow-[0_10px_40px_rgba(28,26,23,0.12)] transition-colors hover:bg-forest-dark md:px-6"
        >
          {chrome.header.ctaLabel}
        </Link>

        <ShortlistMenu />
      </div>

      <nav
        className="mt-3 flex gap-5 overflow-x-auto px-1 pb-1 md:hidden"
        aria-label="Mobile"
      >
        {links.map((link) => (
          <Link
            key={`m-${link.href}-${link.label}`}
            href={link.href}
            className={cn(
              "whitespace-nowrap text-sm transition-colors duration-300",
              onImage ? "text-cream/85" : "text-charcoal/75",
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();
  const {
    chrome,
    editing,
    canEdit,
    selected,
    onSelectFooterField,
  } = useSiteChrome();
  const footer = chrome.footer;

  return (
    <footer className="mt-auto bg-cream px-6 py-8 md:px-10 md:py-10 lg:px-12">
      <div className="relative mx-auto max-w-352 overflow-hidden rounded-sm bg-charcoal px-8 pb-10 pt-16 text-cream md:px-14 md:pb-12 md:pt-20 lg:px-16">
        <PatternField
          color={FOOTER_PATTERN_COLOR}
          className="opacity-[0.11]"
          mask="radial-gradient(130% 95% at 100% 0%, black 0%, rgba(0,0,0,0.5) 42%, transparent 76%)"
        />

        {/* Top: logo + contact on the left, link columns on the right */}
        <div className="relative z-2 flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          <div className="max-w-xs shrink-0">
            <Link href="/" className="inline-block transition-opacity hover:opacity-70">
              <img
                src="/brand/credible-wordmark-cream.svg"
                alt="Credible"
                width={253}
                height={50}
                className="h-7 w-auto md:h-8"
              />
            </Link>

            <EditableHit
              active={editing && canEdit}
              selected={selected === "footer.tagline"}
              label="footer tagline"
              block
              ringOffset="ring-offset-charcoal"
              onSelect={() => onSelectFooterField?.("tagline")}
            >
              <p className="mt-6 text-base leading-relaxed text-cream/70">
                {footer.tagline}
              </p>
            </EditableHit>
            <EditableHit
              active={editing && canEdit}
              selected={selected === "footer.companyLine"}
              label="footer company line"
              block
              ringOffset="ring-offset-charcoal"
              onSelect={() => onSelectFooterField?.("companyLine")}
            >
              <p className="mt-1.5 text-sm text-cream/50">
                {footer.companyLine}
              </p>
            </EditableHit>

            <div className="mt-10">
              <EditableHit
                active={editing && canEdit}
                selected={selected === "footer.email"}
                label="footer email"
                ringOffset="ring-offset-charcoal"
                onSelect={() => onSelectFooterField?.("email")}
              >
                <a
                  href={`mailto:${footer.email}`}
                  className="block w-fit text-sm font-medium text-cream/90 transition-colors hover:text-cream"
                  onClick={(e) => {
                    if (editing) e.preventDefault();
                  }}
                >
                  {footer.email}
                </a>
              </EditableHit>
            </div>

            <div className="mt-8 flex items-center gap-5">
              {footer.socials.map((social) => (
                <a
                  key={`${social.network}-${social.href}`}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="text-cream/70 transition-colors hover:text-cream"
                  onClick={(e) => {
                    if (editing) e.preventDefault();
                  }}
                >
                  <SocialIcon network={social.network} />
                </a>
              ))}
            </div>
          </div>

          <nav
            className="grid grid-cols-2 gap-x-10 gap-y-10 sm:grid-cols-3 sm:gap-x-16"
            aria-label="Footer"
          >
            {footer.columns.map((column, columnIndex) => (
              <ul key={`${column.title}-${columnIndex}`} className="space-y-3.5">
                {column.links.map((link, linkIndex) => (
                  <li key={`${columnIndex}-${linkIndex}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="text-sm font-medium text-cream/90 transition-colors hover:text-cream"
                      onClick={(e) => {
                        if (editing) e.preventDefault();
                      }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ))}
          </nav>
        </div>

        {/* Giant wordmark — charcoal-lift gradient mark */}
        <img
          src="/brand/credible-wordmark-footer.svg"
          alt=""
          aria-hidden
          width={1278}
          height={254}
          className="relative z-2 mt-16 h-auto w-full select-none md:mt-20"
        />

        {/* Bottom bar */}
        <div className="relative z-2 mt-10 flex flex-col gap-4 border-t border-cream/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-cream/60">
            © {year} {footer.copyright}
          </p>
          <div className="flex flex-wrap items-center gap-6 text-sm text-cream/60">
            {footer.legalLinks.map((link) => (
              <Link
                key={`${link.href}-${link.label}`}
                href={link.href}
                className="transition-colors hover:text-cream"
                onClick={(e) => {
                  if (editing) e.preventDefault();
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
