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

export const PROFILE_BODY_SECTION_IDS = [
  "overview",
  "channels",
  "topics",
  "formats",
  "work",
] as const;

export type ProfileBodySectionId = (typeof PROFILE_BODY_SECTION_IDS)[number];

export const PROFILE_FOOTER_BLOCK_IDS = ["similar"] as const;

export type ProfileFooterBlockId = (typeof PROFILE_FOOTER_BLOCK_IDS)[number];

export const PROFILE_BODY_SECTION_LABELS: Record<ProfileBodySectionId, string> =
  {
    overview: "About / overview",
    channels: "Channels",
    topics: "Topics & audience",
    formats: "Formats",
    work: "Recent work",
  };

export const PROFILE_FOOTER_BLOCK_LABELS: Record<ProfileFooterBlockId, string> =
  {
    similar: "Similar creators",
  };

export type ProfileFaqItem = {
  q: string;
  a: string;
};

export type ProfileFaqSections = {
  eyebrow: string;
  headline: string;
  subhead: string;
  items: ProfileFaqItem[];
};

export type ProfileLayoutSections = {
  /** Order of body sections on every roster profile. */
  sectionOrder: ProfileBodySectionId[];
  /** Order of closing blocks below the profile shell. */
  footerOrder: ProfileFooterBlockId[];
  headings: {
    overview: string;
    overviewEyebrow: string;
    channels: string;
    topics: string;
    formats: string;
    work: string;
  };
  /** Hero primary button. Use {first}. */
  heroBriefCtaLabel: string;
  trustedByLabel: string;
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

/** Rust creator CTA at the bottom of case study articles. */
export type CaseStudyCreatorCtaSections = {
  eyebrow: string;
  headline: string;
  description: string;
  showFacesMarquee: boolean;
  stat1: string;
  stat2: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
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
  profileFaq: ProfileFaqSections;
  profileLayout: ProfileLayoutSections;
  insightsPromo: InsightsPromoSections;
  articleSidebarCta: ArticleSidebarCtaSections;
  caseStudyCreatorCta: CaseStudyCreatorCtaSections;
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
      { href: "/projects", label: "Projects" },
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
            href: `/roster?archetype=${encodeURIComponent("Founder")}`,
            label: "Founders",
          },
          {
            href: `/roster?archetype=${encodeURIComponent("CEO")}`,
            label: "CEOs",
          },
          {
            href: `/roster?archetype=${encodeURIComponent("Investor")}`,
            label: "Investors",
          },
          {
            href: `/roster?archetype=${encodeURIComponent("Category expert")}`,
            label: "Category experts",
          },
        ],
      },
      {
        title: "What we do",
        links: [
          { href: "/what-we-do", label: "What we do" },
          { href: "/contact", label: "For Brands" },
          { href: "/apply-for-representation", label: "For Creators" },
        ],
      },
      {
        title: "Company",
        links: [
          { href: "/about", label: "About" },
          { href: "/projects", label: "Projects" },
          { href: "/insights", label: "Insights" },
          { href: "/contact", label: "Contact" },
        ],
      },
    ],
    legalLinks: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
      {
        href: "/accessibility",
        label: "Accessibility Statement",
      },
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
  profileFaq: {
    eyebrow: "FAQ",
    headline: "Questions before you brief.",
    subhead:
      "How booking works, what to expect, and how we scope work with creators on the roster.",
    items: [
      {
        q: "Can we book this creator directly?",
        a: "Yes. Send a brief naming them, or ask for a shortlist of operators with a similar profile. We confirm availability, pricing, and scope — usually within 48 hours.",
      },
      {
        q: "What should we include in a brief?",
        a: "Audience, goal, timing, and any format preferences. The more context on the business moment, the faster we can recommend the right mix of content, partnerships, speaking, or live work.",
      },
      {
        q: "What formats are available?",
        a: "Brand partnerships, speaking, live events, and ambassador programs — often combined. Formats on each profile reflect what that creator typically delivers.",
      },
      {
        q: "Do you work with agencies as well as brands?",
        a: "Yes. In-house teams and agencies brief us the same way. We return reach data, relevant work, and commercials in one document you can forward internally.",
      },
      {
        q: "How is pricing structured?",
        a: "Format-level pricing scoped to the brief — not a generic rate card. We share numbers once we know audience, deliverables, and timing.",
      },
      {
        q: "How quickly can we start?",
        a: "Same-day acknowledgement on briefs. Shortlist within 48 hours when the roster fits. Live dates and longer programs depend on creator availability.",
      },
    ],
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
  profileLayout: {
    sectionOrder: [...PROFILE_BODY_SECTION_IDS],
    footerOrder: [...PROFILE_FOOTER_BLOCK_IDS],
    headings: {
      overview: "About {first}.",
      overviewEyebrow: "Biography",
      channels: "Presence across channels.",
      topics: "What {first} covers — and who shows up for it.",
      formats: "Formats available.",
      work: "Recent work.",
    },
    heroBriefCtaLabel: "Brief {first}",
    trustedByLabel: "Trusted by",
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
  caseStudyCreatorCta: {
    eyebrow: "Work with {first}",
    headline: "Interested in working with {first} or a similar creator?",
    description:
      "Tell us the brief — audience, format, and goal. We'll come back with {first} or a shortlist of operators who fit the same profile.",
    showFacesMarquee: true,
    stat1: "60+ brands briefed",
    stat2: "Reply in 2 business days",
    primaryCtaLabel: "Send a brief",
    primaryCtaHref: "/contact",
    secondaryCtaLabel: "View {possessive} profile",
    secondaryCtaHref: "/roster/{slug}",
  },
};

function asString(value: unknown, fallback: string) {
  return typeof value === "string" ? value : fallback;
}

/** Rename legacy “Case Studies” nav labels to “Projects”. */
function normalizeProjectsHref(href: string) {
  return href.replace(/^\/case-studies(?=\/|$)/, "/projects");
}

function projectsNavLabel(href: string, label: string) {
  const path = normalizeProjectsHref(href.replace(/\/$/, ""));
  if (path !== "/projects") return label;
  if (/^case\s*stud(y|ies)$/i.test(label.trim())) return "Projects";
  return label;
}

function mergeNavLink(raw: unknown, fallback?: NavLink): NavLink | null {
  if (!raw || typeof raw !== "object") {
    return fallback
      ? {
          ...fallback,
          href: normalizeProjectsHref(fallback.href),
          label: projectsNavLabel(fallback.href, fallback.label),
        }
      : null;
  }
  const data = raw as Partial<NavLink>;
  const href = normalizeProjectsHref(asString(data.href, fallback?.href ?? ""));
  const label = projectsNavLabel(
    href,
    asString(data.label, fallback?.label ?? ""),
  );
  if (!label.trim() && !href.trim()) return null;
  return { label, href };
}

function mergeNavLinks(raw: unknown, fallback: NavLink[]): NavLink[] {
  if (!Array.isArray(raw)) {
    return fallback.map((l) => ({
      ...l,
      href: normalizeProjectsHref(l.href),
      label: projectsNavLabel(l.href, l.label),
    }));
  }
  const links = raw
    .map((item, i) => mergeNavLink(item, fallback[i]))
    .filter((l): l is NavLink => Boolean(l));
  return links.length > 0
    ? links
    : fallback.map((l) => ({
        ...l,
        href: normalizeProjectsHref(l.href),
        label: projectsNavLabel(l.href, l.label),
      }));
}

function mergeLegalLinks(raw: unknown, fallback: NavLink[]): NavLink[] {
  const normalizeHref = (href: string) =>
    href === "/accessibility-statement" ? "/accessibility" : href;

  const normalizedFallback = fallback.map((link) => ({
    ...link,
    href: normalizeProjectsHref(normalizeHref(link.href)),
    label: projectsNavLabel(link.href, link.label),
  }));

  const merged = mergeNavLinks(raw, normalizedFallback).map((link) => ({
    ...link,
    href: normalizeProjectsHref(normalizeHref(link.href)),
    label: projectsNavLabel(link.href, link.label),
  }));

  const hrefs = new Set(merged.map((link) => link.href));
  for (const link of normalizedFallback) {
    if (!hrefs.has(link.href)) {
      merged.push(link);
    }
  }

  return merged;
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

function mergeCaseStudyCreatorCta(raw: unknown): CaseStudyCreatorCtaSections {
  const defaults = DEFAULT_SITE_CHROME.caseStudyCreatorCta;
  const data = (raw && typeof raw === "object" ? raw : {}) as Partial<
    CaseStudyCreatorCtaSections & { showFacesMarquee?: unknown }
  >;
  return {
    eyebrow: asString(data.eyebrow, defaults.eyebrow),
    headline: asString(data.headline, defaults.headline),
    description: asString(data.description, defaults.description),
    showFacesMarquee:
      typeof data.showFacesMarquee === "boolean"
        ? data.showFacesMarquee
        : defaults.showFacesMarquee,
    stat1: asString(data.stat1, defaults.stat1),
    stat2: asString(data.stat2, defaults.stat2),
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
  };
}

export type ProfileTemplateVars = {
  first: string;
  name: string;
  slug?: string;
  possessive?: string;
};

export function possessiveFirst(first: string) {
  return first.endsWith("s") ? `${first}'` : `${first}'s`;
}

export function applyProfileRailTemplate(
  template: string,
  vars: ProfileTemplateVars,
) {
  const possessive = vars.possessive ?? possessiveFirst(vars.first);
  return template
    .replace(/\{first\}/g, vars.first)
    .replace(/\{name\}/g, vars.name)
    .replace(/\{slug\}/g, vars.slug ?? "")
    .replace(/\{possessive\}/g, possessive);
}

export function buildProfileNav(
  labels: ProfileRailNavLabels,
  sections: {
    hasChannels: boolean;
    hasTopics: boolean;
    hasFormats: boolean;
    hasWork: boolean;
  },
  sectionOrder: ProfileBodySectionId[] = [...PROFILE_BODY_SECTION_IDS],
): NavLink[] {
  const available: Record<ProfileBodySectionId, boolean> = {
    overview: true,
    channels: sections.hasChannels,
    topics: sections.hasTopics,
    formats: sections.hasFormats,
    work: sections.hasWork,
  };
  const hrefById: Record<ProfileBodySectionId, string> = {
    overview: "#overview",
    channels: "#channels",
    topics: "#topics",
    formats: "#formats",
    work: "#work",
  };

  return sectionOrder
    .filter((id) => available[id])
    .map((id) => ({ href: hrefById[id], label: labels[id] }));
}

function mergeOrderedIds<T extends string>(
  raw: unknown,
  defaults: readonly T[],
  allowed: readonly T[],
): T[] {
  const allow = new Set(allowed);
  const fromRaw = Array.isArray(raw)
    ? raw.filter((item): item is T => typeof item === "string" && allow.has(item as T))
    : [];
  const seen = new Set<T>();
  const ordered: T[] = [];
  for (const id of fromRaw) {
    if (seen.has(id)) continue;
    seen.add(id);
    ordered.push(id);
  }
  for (const id of defaults) {
    if (seen.has(id)) continue;
    seen.add(id);
    ordered.push(id);
  }
  return ordered;
}

function mergeProfileFaq(raw: unknown): ProfileFaqSections {
  const defaults = DEFAULT_SITE_CHROME.profileFaq;
  const data = (raw && typeof raw === "object" ? raw : {}) as Partial<
    ProfileFaqSections
  > & { items?: unknown };

  if (!Array.isArray(data.items)) {
    return {
      eyebrow: asString(data.eyebrow, defaults.eyebrow),
      headline: asString(data.headline, defaults.headline),
      subhead: asString(data.subhead, defaults.subhead),
      items: defaults.items.map((item) => ({ ...item })),
    };
  }

  const merged = data.items
    .map((item, i) => {
      const row = (item && typeof item === "object" ? item : {}) as Partial<
        ProfileFaqItem
      >;
      const fallback = defaults.items[i] ?? { q: "", a: "" };
      const q = asString(row.q, fallback.q);
      const a = asString(row.a, fallback.a);
      if (!q.trim() && !a.trim()) return null;
      return { q, a };
    })
    .filter((item): item is ProfileFaqItem => item !== null);

  return {
    eyebrow: asString(data.eyebrow, defaults.eyebrow),
    headline: asString(data.headline, defaults.headline),
    subhead: asString(data.subhead, defaults.subhead),
    items:
      merged.length > 0 ? merged : defaults.items.map((item) => ({ ...item })),
  };
}

function mergeProfileLayout(raw: unknown): ProfileLayoutSections {
  const defaults = DEFAULT_SITE_CHROME.profileLayout;
  const data = (raw && typeof raw === "object" ? raw : {}) as Partial<
    ProfileLayoutSections
  >;
  const headings = (data.headings ?? {}) as Partial<
    ProfileLayoutSections["headings"]
  >;

  return {
    sectionOrder: mergeOrderedIds(
      data.sectionOrder,
      defaults.sectionOrder,
      PROFILE_BODY_SECTION_IDS,
    ),
    footerOrder: mergeOrderedIds(
      data.footerOrder,
      defaults.footerOrder,
      PROFILE_FOOTER_BLOCK_IDS,
    ),
    headings: {
      overview: asString(headings.overview, defaults.headings.overview),
      overviewEyebrow: asString(
        headings.overviewEyebrow,
        defaults.headings.overviewEyebrow,
      ),
      channels: asString(headings.channels, defaults.headings.channels),
      topics: asString(headings.topics, defaults.headings.topics),
      formats: asString(headings.formats, defaults.headings.formats),
      work: asString(headings.work, defaults.headings.work),
    },
    heroBriefCtaLabel: asString(
      data.heroBriefCtaLabel,
      defaults.heroBriefCtaLabel,
    ),
    trustedByLabel: asString(data.trustedByLabel, defaults.trustedByLabel),
  };
}

export function mergeSiteChrome(raw: unknown): SiteChromeSections {
  const data = (raw && typeof raw === "object" ? raw : {}) as {
    header?: Partial<SiteChromeSections["header"]>;
    footer?: Partial<SiteChromeSections["footer"]> & Record<string, unknown>;
    profileRail?: unknown;
    profileCta?: unknown;
    profileFormats?: unknown;
    profileFaq?: unknown;
    profileLayout?: unknown;
    insightsPromo?: unknown;
    articleSidebarCta?: unknown;
    caseStudyCreatorCta?: unknown;
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
      legalLinks: mergeLegalLinks(footer.legalLinks, defaults.footer.legalLinks),
    },
    profileRail: mergeProfileRail(data.profileRail),
    profileCta: mergeProfileCta(data.profileCta),
    profileFormats: mergeProfileFormats(data.profileFormats),
    profileFaq: mergeProfileFaq(data.profileFaq),
    profileLayout: mergeProfileLayout(data.profileLayout),
    insightsPromo: mergeInsightsPromo(data.insightsPromo),
    articleSidebarCta: mergeArticleSidebarCta(data.articleSidebarCta),
    caseStudyCreatorCta: mergeCaseStudyCreatorCta(data.caseStudyCreatorCta),
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

export function emptyProfileFaqItem(): ProfileFaqItem {
  return { q: "", a: "" };
}
