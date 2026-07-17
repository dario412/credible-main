import Link from "next/link";

const links = [
  { href: "/roster", label: "Roster" },
  { href: "/what-we-do", label: "What we do" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/insights", label: "Insights" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  return (
    <header className="relative z-20 bg-cream">
      <div className="mx-auto grid max-w-352 grid-cols-[1fr_auto_1fr] items-center gap-4 px-6 py-5 md:px-10 lg:px-12">
        <Link
          href="/"
          className="justify-self-start font-display text-[1.65rem] leading-none tracking-tight text-forest transition-opacity hover:opacity-80"
        >
          credible.
        </Link>

        <nav
          className="hidden items-center gap-7 justify-self-center lg:gap-8 md:flex"
          aria-label="Primary"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[0.95rem] text-charcoal transition-colors hover:text-forest"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/contact"
          className="hidden justify-self-end bg-forest px-[1.35rem] py-[0.7rem] text-[0.95rem] leading-none text-cream transition-colors hover:bg-forest-dark sm:inline-flex sm:items-center sm:justify-center"
        >
          Send brief
        </Link>
      </div>

      <nav
        className="flex gap-5 overflow-x-auto border-t border-charcoal/8 px-6 py-3 md:hidden"
        aria-label="Mobile"
      >
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="whitespace-nowrap text-sm text-charcoal/80"
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/contact"
          className="whitespace-nowrap text-sm font-medium text-forest"
        >
          Send brief
        </Link>
      </nav>
    </header>
  );
}

const footerColumns = [
  {
    title: "Roster",
    links: [
      { href: "/roster", label: "All creators" },
      { href: "/roster?category=founder", label: "Founders/Csuite" },
      { href: "/roster?category=speaker", label: "Subject Matter Experts" },
      { href: "/roster?category=investor", label: "Investors" },
      { href: "/roster?category=operator", label: "Category Specialists" },
    ],
  },
  {
    title: "What we do",
    links: [
      { href: "/what-we-do", label: "What we do" },
      { href: "/contact", label: "For Brands" },
      { href: "/contact", label: "For Creators" },
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
      <div className="mx-auto max-w-352 rounded-sm bg-charcoal px-8 pb-10 pt-16 text-cream md:px-14 md:pb-12 md:pt-20 lg:px-16">
        {/* Top: logo + contact on the left, link columns on the right */}
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          <div className="max-w-xs shrink-0">
            <Link
              href="/"
              className="font-display text-[1.5rem] leading-none tracking-tight text-cream transition-opacity hover:opacity-70"
            >
              credible.
            </Link>

            <p className="mt-6 text-base leading-relaxed text-cream/70">
              The talent agency for the expert economy.
            </p>
            <p className="mt-1.5 text-sm text-cream/50">A PepTalk company.</p>

            <div className="mt-10">
              <p className="text-xs uppercase tracking-[0.18em] text-cream/45">
                Get in touch
              </p>
              <a
                href="mailto:hello@crediblecreators.com"
                className="mt-2 block w-fit text-sm font-medium text-cream/90 transition-colors hover:text-cream"
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

        {/* Giant wordmark — brand SVG scaled to the full container width */}
        <img
          src="/brand/credible-wordmark-cream.svg"
          alt=""
          aria-hidden
          width={253}
          height={50}
          className="mt-16 h-auto w-full select-none md:mt-20"
        />

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col gap-4 border-t border-cream/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
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
