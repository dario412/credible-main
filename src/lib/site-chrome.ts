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

export type ProfileRailNavLabels = {
  overview: string;
  channels: string;
  topics: string;
  formats: string;
  work: string;
};

export type ProfileRailSections = {
  availabilityLabel: string;
  signedBadgeLabel: string;
  openBadgeLabel: string;
  focusLabel: string;
  workWithTitle: string;
  workWithDescription: string;
  primaryCtaLabel: string;
  shortlistLabel: string;
  shortlistedLabel: string;
  footnote: string;
  nav: ProfileRailNavLabels;
};

export type ProfileCtaSections = {
  headline: string;
  description: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  similarHeadline: string;
  similarLinkLabel: string;
  similarLinkHref: string;
};

export type ProfileFormatKind =
  | "brandPartnerships"
  | "speaking"
  | "liveEvents"
  | "ambassador";

export type ProfileFormatCopy = {
  title: string;
  description: string;
};

export type ProfileFormatsSections = Record<
  ProfileFormatKind,
  ProfileFormatCopy
>;

export type InsightsPromoSections = {
  newsletter: {
    eyebrow: string;
    headline: string;
    description: string;
    emailPlaceholder: string;
    buttonLabel: string;
  };
  roster: {
    eyebrow: string;
    headline: string;
    description: string;
    ctaLabel: string;
    ctaHref: string;
  };
};

/** Compact roster CTA in insight / case study article sidebars. */
export type ArticleSidebarCtaSections = {
  headline: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
};

export const PROFILE_FORMAT_KINDS: Array<{
  key: ProfileFormatKind;
  hint: string;
}> = [
  { key: "brandPartnerships", hint: "Brand partnerships" },
  { key: "speaking", hint: "Speaking" },
  { key: "liveEvents", hint: "Live events" },
  { key: "ambassador", hint: "Ambassador program" },
];

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
  profileRail: ProfileRailSections;
  profileCta: ProfileCtaSections;
  profileFormats: ProfileFormatsSections;
  insightsPromo: InsightsPromoSections;
  articleSidebarCta: ArticleSidebarCtaSections;
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
  profileRail: {
    availabilityLabel: "Available to book",
    signedBadgeLabel: "Signed",
    openBadgeLabel: "Open",
    focusLabel: "Focus",
    workWithTitle: "Work with {first}",
    workWithDescription: "Briefs go to {first}'s manager at Credible.",
    primaryCtaLabel: "Get Rates",
    shortlistLabel: "Shortlist",
    shortlistedLabel: "Shortlisted",
    footnote: "Exclusive · Reply in 48h · Selective briefs",
    nav: {
      overview: "Overview",
      channels: "Channels",
      topics: "Topics & audience",
      formats: "Formats",
      work: "Recent work",
    },
  },
  profileCta: {
    headline: "Interested in working with {first}?",
    description:
      "Every enquiry gets a same-day acknowledgement from {first}'s manager at Credible. Brief availability is limited to two commercial partners per quarter.",
    primaryCtaLabel: "Send brief",
    primaryCtaHref: "/contact?expert={slug}",
    secondaryCtaLabel: "Browse roster",
    secondaryCtaHref: "/roster",
    similarHeadline: "Similar creators.",
    similarLinkLabel: "View roster",
    similarLinkHref: "/roster",
  },
  profileFormats: {
    brandPartnerships: {
      title: "Brand partnerships",
      description:
        "Hosted or co-produced series with brand integration — long-form and considered, built for operators who already trust {first}'s voice.",
    },
    speaking: {
      title: "Speaking",
      description:
        "Keynotes and firesides on building media businesses, founder storytelling and creator-led growth. 45–60 minute delivery.",
    },
    liveEvents: {
      title: "Live events",
      description:
        "Founder summits, product launches and closed-door exec sessions — {first} hosts the room, then carries it to {first}'s own audience.",
    },
    ambassador: {
      title: "Ambassador program",
      description:
        "12–18 month terms only. Selective — {first} takes on a small number of brand partners per year.",
    },
  },
  insightsPromo: {
    newsletter: {
      eyebrow: "Newsletter",
      headline: "Get the monthly briefing.",
      description:
        "Field notes on B2B creators, buyer research, and the formats that actually move pipeline.",
      emailPlaceholder: "Work email",
      buttonLabel: "Subscribe",
    },
    roster: {
      eyebrow: "Roster",
      headline: "Browse creators ready to brief.",
      description:
        "Expert operators filtered by topic, format, and archetype.",
      ctaLabel: "Explore the roster",
      ctaHref: "/roster",
    },
  },
  articleSidebarCta: {
    headline: "Ready to brief an expert?",
    description:
      "Browse operators by topic, format, and archetype — then send a brief.",
    ctaLabel: "Browse the roster",
    ctaHref: "/roster",
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

function mergeProfileRailNav(
  raw: unknown,
  defaults: ProfileRailNavLabels,
): ProfileRailNavLabels {
  const data = (raw && typeof raw === "object" ? raw : {}) as Partial<
    ProfileRailNavLabels
  >;
  return {
    overview: asString(data.overview, defaults.overview),
    channels: asString(data.channels, defaults.channels),
    topics: asString(data.topics, defaults.topics),
    formats: asString(data.formats, defaults.formats),
    work: asString(data.work, defaults.work),
  };
}

function mergeProfileRail(raw: unknown): ProfileRailSections {
  const defaults = DEFAULT_SITE_CHROME.profileRail;
  const data = (raw && typeof raw === "object" ? raw : {}) as Partial<
    ProfileRailSections
  >;
  return {
    availabilityLabel: asString(
      data.availabilityLabel,
      defaults.availabilityLabel,
    ),
    signedBadgeLabel: asString(data.signedBadgeLabel, defaults.signedBadgeLabel),
    openBadgeLabel: asString(data.openBadgeLabel, defaults.openBadgeLabel),
    focusLabel: asString(data.focusLabel, defaults.focusLabel),
    workWithTitle: asString(data.workWithTitle, defaults.workWithTitle),
    workWithDescription: asString(
      data.workWithDescription,
      defaults.workWithDescription,
    ),
    primaryCtaLabel: asString(data.primaryCtaLabel, defaults.primaryCtaLabel),
    shortlistLabel: asString(data.shortlistLabel, defaults.shortlistLabel),
    shortlistedLabel: asString(
      data.shortlistedLabel,
      defaults.shortlistedLabel,
    ),
    footnote: asString(data.footnote, defaults.footnote),
    nav: mergeProfileRailNav(data.nav, defaults.nav),
  };
}

function mergeProfileCta(raw: unknown): ProfileCtaSections {
  const defaults = DEFAULT_SITE_CHROME.profileCta;
  const data = (raw && typeof raw === "object" ? raw : {}) as Partial<
    ProfileCtaSections
  >;
  return {
    headline: asString(data.headline, defaults.headline),
    description: asString(data.description, defaults.description),
    primaryCtaLabel: asString(data.primaryCtaLabel, defaults.primaryCtaLabel),
    primaryCtaHref: asString(data.primaryCtaHref, defaults.primaryCtaHref),
    secondaryCtaLabel: asString(
      data.secondaryCtaLabel,
      defaults.secondaryCtaLabel,
    ),
    secondaryCtaHref: asString(
      data.secondaryCtaHref,
      defaults.secondaryCtaHref,
    ),
    similarHeadline: asString(data.similarHeadline, defaults.similarHeadline),
    similarLinkLabel: asString(
      data.similarLinkLabel,
      defaults.similarLinkLabel,
    ),
    similarLinkHref: asString(data.similarLinkHref, defaults.similarLinkHref),
  };
}

function mergeFormatCopy(
  raw: unknown,
  fallback: ProfileFormatCopy,
): ProfileFormatCopy {
  const data = (raw && typeof raw === "object" ? raw : {}) as Partial<
    ProfileFormatCopy
  >;
  return {
    title: asString(data.title, fallback.title),
    description: asString(data.description, fallback.description),
  };
}

function mergeProfileFormats(raw: unknown): ProfileFormatsSections {
  const defaults = DEFAULT_SITE_CHROME.profileFormats;
  const data = (raw && typeof raw === "object" ? raw : {}) as Partial<
    Record<ProfileFormatKind, unknown>
  >;
  return {
    brandPartnerships: mergeFormatCopy(
      data.brandPartnerships,
      defaults.brandPartnerships,
    ),
    speaking: mergeFormatCopy(data.speaking, defaults.speaking),
    liveEvents: mergeFormatCopy(data.liveEvents, defaults.liveEvents),
    ambassador: mergeFormatCopy(data.ambassador, defaults.ambassador),
  };
}

function mergeInsightsPromo(raw: unknown): InsightsPromoSections {
  const defaults = DEFAULT_SITE_CHROME.insightsPromo;
  const data = (raw && typeof raw === "object" ? raw : {}) as {
    newsletter?: Partial<InsightsPromoSections["newsletter"]>;
    roster?: Partial<InsightsPromoSections["roster"]>;
  };
  const newsletter = data.newsletter ?? {};
  const roster = data.roster ?? {};
  return {
    newsletter: {
      eyebrow: asString(newsletter.eyebrow, defaults.newsletter.eyebrow),
      headline: asString(newsletter.headline, defaults.newsletter.headline),
      description: asString(
        newsletter.description,
        defaults.newsletter.description,
      ),
      emailPlaceholder: asString(
        newsletter.emailPlaceholder,
        defaults.newsletter.emailPlaceholder,
      ),
      buttonLabel: asString(
        newsletter.buttonLabel,
        defaults.newsletter.buttonLabel,
      ),
    },
    roster: {
      eyebrow: asString(roster.eyebrow, defaults.roster.eyebrow),
      headline: asString(roster.headline, defaults.roster.headline),
      description: asString(roster.description, defaults.roster.description),
      ctaLabel: asString(roster.ctaLabel, defaults.roster.ctaLabel),
      ctaHref: asString(roster.ctaHref, defaults.roster.ctaHref),
    },
  };
}

function mergeArticleSidebarCta(raw: unknown): ArticleSidebarCtaSections {
  const defaults = DEFAULT_SITE_CHROME.articleSidebarCta;
  const data = (raw && typeof raw === "object" ? raw : {}) as Partial<
    ArticleSidebarCtaSections
  >;
  return {
    headline: asString(data.headline, defaults.headline),
    description: asString(data.description, defaults.description),
    ctaLabel: asString(data.ctaLabel, defaults.ctaLabel),
    ctaHref: asString(data.ctaHref, defaults.ctaHref),
  };
}

export type ProfileTemplateVars = {
  first: string;
  name: string;
  slug?: string;
};

export function applyProfileRailTemplate(
  template: string,
  vars: ProfileTemplateVars,
) {
  return template
    .replace(/\{first\}/g, vars.first)
    .replace(/\{name\}/g, vars.name)
    .replace(/\{slug\}/g, vars.slug ?? "");
}

export function buildProfileNav(
  labels: ProfileRailNavLabels,
  sections: {
    hasChannels: boolean;
    hasTopics: boolean;
    hasFormats: boolean;
    hasWork: boolean;
  },
): NavLink[] {
  const items: NavLink[] = [{ href: "#overview", label: labels.overview }];
  if (sections.hasChannels) {
    items.push({ href: "#channels", label: labels.channels });
  }
  if (sections.hasTopics) {
    items.push({ href: "#topics", label: labels.topics });
  }
  if (sections.hasFormats) {
    items.push({ href: "#formats", label: labels.formats });
  }
  if (sections.hasWork) {
    items.push({ href: "#work", label: labels.work });
  }
  return items;
}

export function mergeSiteChrome(raw: unknown): SiteChromeSections {
  const data = (raw && typeof raw === "object" ? raw : {}) as {
    header?: Partial<SiteChromeSections["header"]>;
    footer?: Partial<SiteChromeSections["footer"]> & Record<string, unknown>;
    profileRail?: unknown;
    profileCta?: unknown;
    profileFormats?: unknown;
    insightsPromo?: unknown;
    articleSidebarCta?: unknown;
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
    profileRail: mergeProfileRail(data.profileRail),
    profileCta: mergeProfileCta(data.profileCta),
    profileFormats: mergeProfileFormats(data.profileFormats),
    insightsPromo: mergeInsightsPromo(data.insightsPromo),
    articleSidebarCta: mergeArticleSidebarCta(data.articleSidebarCta),
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
