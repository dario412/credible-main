export type NavLink = {
  label: string;
  href: string;
};

export type SocialNetwork = "linkedin" | "youtube" | "x" | "instagram";

export type SocialLink = {
  network: SocialNetwork;
  label: string;
  href: string;
};

export type FooterColumn = {
  title: string;
  links: NavLink[];
};

export type SiteChromeSections = {
  header: {
    links: NavLink[];
    ctaLabel: string;
    ctaHref: string;
  };
  footer: {
    tagline: string;
    companyLine: string;
    email: string;
    copyright: string;
    socials: SocialLink[];
    columns: FooterColumn[];
    legalLinks: NavLink[];
  };
};

export const SOCIAL_NETWORKS: Array<{
  value: SocialNetwork;
  label: string;
}> = [
  { value: "linkedin", label: "LinkedIn" },
  { value: "youtube", label: "YouTube" },
  { value: "x", label: "X" },
  { value: "instagram", label: "Instagram" },
];

export const DEFAULT_SITE_CHROME: SiteChromeSections = {
  header: {
    links: [
      { href: "/roster", label: "Roster" },
      { href: "/what-we-do", label: "What we do" },
      { href: "/case-studies", label: "Case Studies" },
      { href: "/insights", label: "Insights" },
      { href: "/about", label: "About" },
    ],
    ctaLabel: "Send brief",
    ctaHref: "/contact",
  },
  footer: {
    tagline: "The talent agency for the expert economy.",
    companyLine: "A PepTalk company.",
    email: "hello@crediblecreators.com",
    copyright: "Credible Talent Ltd. All rights reserved.",
    socials: [
      {
        network: "linkedin",
        label: "LinkedIn",
        href: "https://www.linkedin.com/",
      },
      {
        network: "youtube",
        label: "YouTube",
        href: "https://www.youtube.com/",
      },
    ],
    columns: [
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
    ],
    legalLinks: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
    ],
  },
};

function asString(value: unknown, fallback: string) {
  return typeof value === "string" ? value : fallback;
}

function mergeNavLink(raw: unknown, fallback?: NavLink): NavLink | null {
  if (!raw || typeof raw !== "object") {
    return fallback ? { ...fallback } : null;
  }
  const data = raw as Partial<NavLink>;
  const label = asString(data.label, fallback?.label ?? "");
  const href = asString(data.href, fallback?.href ?? "");
  if (!label.trim() && !href.trim()) return null;
  return { label, href };
}

function mergeNavLinks(raw: unknown, fallback: NavLink[]): NavLink[] {
  if (!Array.isArray(raw)) return fallback.map((l) => ({ ...l }));
  const links = raw
    .map((item, i) => mergeNavLink(item, fallback[i]))
    .filter((l): l is NavLink => Boolean(l));
  return links.length > 0 ? links : fallback.map((l) => ({ ...l }));
}

function mergeSocial(raw: unknown, fallback?: SocialLink): SocialLink | null {
  if (!raw || typeof raw !== "object") {
    return fallback ? { ...fallback } : null;
  }
  const data = raw as Partial<SocialLink>;
  const networkRaw = asString(data.network, fallback?.network ?? "linkedin");
  const network = (
    SOCIAL_NETWORKS.some((n) => n.value === networkRaw)
      ? networkRaw
      : fallback?.network ?? "linkedin"
  ) as SocialNetwork;
  const label = asString(
    data.label,
    SOCIAL_NETWORKS.find((n) => n.value === network)?.label ??
      fallback?.label ??
      "Social",
  );
  const href = asString(data.href, fallback?.href ?? "");
  if (!href.trim() && !label.trim()) return null;
  return { network, label, href };
}

function mergeFooterColumn(
  raw: unknown,
  fallback?: FooterColumn,
): FooterColumn | null {
  if (!raw || typeof raw !== "object") {
    return fallback ? { ...fallback, links: fallback.links.map((l) => ({ ...l })) } : null;
  }
  const data = raw as Partial<FooterColumn>;
  const title = asString(data.title, fallback?.title ?? "");
  const links = mergeNavLinks(data.links, fallback?.links ?? []);
  if (!title.trim() && links.length === 0) return null;
  return { title, links };
}

export function mergeSiteChrome(raw: unknown): SiteChromeSections {
  const data = (raw && typeof raw === "object" ? raw : {}) as {
    header?: Partial<SiteChromeSections["header"]>;
    footer?: Partial<SiteChromeSections["footer"]> & Record<string, unknown>;
  };
  const header = data.header ?? {};
  const footer = data.footer ?? {};
  const defaults = DEFAULT_SITE_CHROME;

  const socialsRaw = Array.isArray(footer.socials) ? footer.socials : null;
  const socials = socialsRaw
    ? socialsRaw
        .map((item, i) => mergeSocial(item, defaults.footer.socials[i]))
        .filter((s): s is SocialLink => Boolean(s))
    : defaults.footer.socials.map((s) => ({ ...s }));

  const columnsRaw = Array.isArray(footer.columns) ? footer.columns : null;
  const columns = columnsRaw
    ? columnsRaw
        .map((item, i) => mergeFooterColumn(item, defaults.footer.columns[i]))
        .filter((c): c is FooterColumn => Boolean(c))
    : defaults.footer.columns.map((c) => ({
        title: c.title,
        links: c.links.map((l) => ({ ...l })),
      }));

  return {
    header: {
      links: mergeNavLinks(header.links, defaults.header.links),
      ctaLabel: asString(header.ctaLabel, defaults.header.ctaLabel),
      ctaHref: asString(header.ctaHref, defaults.header.ctaHref),
    },
    footer: {
      tagline: asString(footer.tagline, defaults.footer.tagline),
      companyLine: asString(footer.companyLine, defaults.footer.companyLine),
      email: asString(footer.email, defaults.footer.email),
      copyright: asString(footer.copyright, defaults.footer.copyright),
      socials:
        socials.length > 0
          ? socials
          : defaults.footer.socials.map((s) => ({ ...s })),
      columns:
        columns.length > 0
          ? columns
          : defaults.footer.columns.map((c) => ({
              title: c.title,
              links: c.links.map((l) => ({ ...l })),
            })),
      legalLinks: mergeNavLinks(footer.legalLinks, defaults.footer.legalLinks),
    },
  };
}

export function emptyNavLink(): NavLink {
  return { label: "", href: "/" };
}

export function emptyFooterColumn(): FooterColumn {
  return { title: "Column", links: [emptyNavLink()] };
}

export function emptySocialLink(): SocialLink {
  return { network: "linkedin", label: "LinkedIn", href: "https://" };
}
