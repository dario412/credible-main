"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { PatternField } from "@/components/pattern-field";
import { ShortlistMenu } from "@/components/shortlist-menu";
import { cn } from "@/lib/utils";

const FOOTER_PATTERN_COLOR = { r: 249, g: 243, b: 239 };

const links = [
  { href: "/roster", label: "Roster" },
  { href: "/what-we-do", label: "What we do" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/insights", label: "Insights" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const pathname = usePathname();
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
      const threshold = overlay ? window.innerHeight * 0.6 : 8;
      setScrolled(window.scrollY > threshold);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overlay]);

  const pageSurface = insightArticle ? "bg-cream-dark" : "bg-cream";
  // Over the stage image: invert the charcoal pill to cream with dark type.
  const onImage = overlay && !scrolled;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 overflow-visible px-4 pt-4 pb-3 transition-colors duration-300 md:px-6 md:pt-5 md:pb-4 lg:px-8",
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
          "pointer-events-none absolute inset-x-0 top-0 -z-10 h-[calc(100%+8rem)] transition-opacity duration-500",
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

      <div className="mx-auto flex max-w-5xl items-stretch gap-1">
        <div
          className={cn(
            "flex flex-1 items-center gap-3 rounded-sm p-3 shadow-[0_10px_40px_rgba(28,26,23,0.12)] transition-colors duration-300 md:gap-6 md:p-3.5",
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
            className="hidden flex-1 items-center justify-center gap-5 lg:gap-7 md:flex"
            aria-label="Primary"
          >
            {links.map((link) => (
              <Link
                key={link.href}
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
          href="/contact"
          className="inline-flex shrink-0 items-center justify-center rounded-sm bg-forest px-5 text-[0.8125rem] font-medium text-cream shadow-[0_10px_40px_rgba(28,26,23,0.12)] transition-colors hover:bg-forest-dark md:px-6"
        >
          Send brief
        </Link>

        <ShortlistMenu />
      </div>

      <nav
        className="mt-3 flex gap-5 overflow-x-auto px-1 pb-1 md:hidden"
        aria-label="Mobile"
      >
        {links.map((link) => (
          <Link
            key={link.href}
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


const footerColumns = [
  {
    title: "Roster",
    links: [
      { href: "/roster", label: "All creators" },
      {
        href: `/roster?archetype=${encodeURIComponent("Founder / C-Suite")}`,
        label: "Founders/Csuite",
      },
      {
        href: `/roster?archetype=${encodeURIComponent("Subject Matter Expert")}`,
        label: "Subject Matter Experts",
      },
      {
        href: `/roster?archetype=${encodeURIComponent("Investor / Analyst")}`,
        label: "Investors",
      },
      {
        href: `/roster?archetype=${encodeURIComponent("Category Specialist")}`,
        label: "Category Specialists",
      },
    ],
  },
  {
    title: "What we do",
    links: [
      { href: "/what-we-do", label: "What we do" },
      { href: "/contact", label: "For Brands" },
      { href: "/contact?type=creator", label: "For Creators" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/case-studies", label: "Case studies" },
      { href: "/insights", label: "Insights" },
      { href: "/contact", label: "Contact" },
    ],
  },
] as const;

const socials = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/",
    icon: (
      <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden className="size-[22px]">
        <path d="M216,24H40A16,16,0,0,0,24,40V216a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V40A16,16,0,0,0,216,24Zm0,192H40V40H216V216ZM96,112v64a8,8,0,0,1-16,0V112a8,8,0,0,1,16,0Zm88,28v36a8,8,0,0,1-16,0V140a20,20,0,0,0-40,0v36a8,8,0,0,1-16,0V112a8,8,0,0,1,15.79-1.78A36,36,0,0,1,184,140ZM100,84A12,12,0,1,1,88,72,12,12,0,0,1,100,84Z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/",
    icon: (
      <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden className="size-[22px]">
        <path d="M164.44,121.34l-48-32A8,8,0,0,0,104,96v64a8,8,0,0,0,12.44,6.66l48-32a8,8,0,0,0,0-13.32ZM120,145.05V111l25.58,17ZM234.33,69.52a24,24,0,0,0-14.49-16.4C185.56,39.88,131,40,128,40s-57.56-.12-91.84,13.12a24,24,0,0,0-14.49,16.4C19.08,79.5,16,97.74,16,128s3.08,48.5,5.67,58.48a24,24,0,0,0,14.49,16.41C69,215.56,120.4,216,127.34,216h1.32c6.94,0,58.37-.44,91.18-13.11a24,24,0,0,0,14.49-16.41c2.59-10,5.67-28.22,5.67-58.48S236.92,79.5,234.33,69.52Zm-15.49,113a8,8,0,0,1-4.77,5.49c-31.65,12.22-85.48,12-86,12H128c-.54,0-54.33.2-86-12a8,8,0,0,1-4.77-5.49C34.8,173.39,32,156.57,32,128s2.8-45.39,5.16-54.47A8,8,0,0,1,41.93,68c30.52-11.79,81.66-12,85.85-12h.27c.54,0,54.38-.18,86,12a8,8,0,0,1,4.77,5.49C221.2,82.61,224,99.43,224,128S221.2,173.39,218.84,182.47Z" />
      </svg>
    ),
  },
] as const;

export function SiteFooter() {
  const year = new Date().getFullYear();

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

            <p className="mt-6 text-base leading-relaxed text-cream/70">
              The talent agency for the expert economy.
            </p>
            <p className="mt-1.5 text-sm text-cream/50">A PepTalk company.</p>

            <div className="mt-10">
              <a
                href="mailto:hello@crediblecreators.com"
                className="block w-fit text-sm font-medium text-cream/90 transition-colors hover:text-cream"
              >
                hello@crediblecreators.com
              </a>
            </div>

            <div className="mt-8 flex items-center gap-5">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="text-cream/70 transition-colors hover:text-cream"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <nav
            className="grid grid-cols-2 gap-x-10 gap-y-10 sm:grid-cols-3 sm:gap-x-16"
            aria-label="Footer"
          >
            {footerColumns.map((column) => (
              <ul key={column.title} className="space-y-3.5">
                {column.links.map((link) => (
                  <li key={`${column.title}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="text-sm font-medium text-cream/90 transition-colors hover:text-cream"
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
            © {year} Credible Talent Ltd. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-6 text-sm text-cream/60">
            <Link
              href="/privacy"
              className="transition-colors hover:text-cream"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="transition-colors hover:text-cream"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
