export const APPLY_BENEFIT_ICONS = [
  "envelope",
  "briefcase",
  "microphone",
  "chart",
] as const;

export type ApplyBenefitIcon = (typeof APPLY_BENEFIT_ICONS)[number];

export type ApplyAuthorityItem = {
  value: string;
  label: string;
  note: string;
};

export type ApplyPathStep = {
  n: string;
  phase: string;
  title: string;
  body: string;
  outcome: string;
  filled: boolean;
};

export type ApplyBenefit = {
  icon: ApplyBenefitIcon;
  title: string;
  body: string;
};

export type ApplyFaqItem = {
  q: string;
  a: string;
};

export type ApplyPageSections = {
  hero: {
    badge: string;
    headline: string;
    subhead: string;
    assurances: string[];
    nextEyebrow: string;
    next: string[];
  };
  authority: {
    headline: string;
    items: ApplyAuthorityItem[];
  };
  qualify: {
    eyebrow: string;
    headline: string;
    subhead: string;
    fitEyebrow: string;
    fit: string[];
    notFitEyebrow: string;
    notFit: string[];
  };
  path: {
    eyebrow: string;
    headline: string;
    subhead: string;
    steps: ApplyPathStep[];
  };
  benefits: {
    eyebrow: string;
    headline: string;
    subhead: string;
    items: ApplyBenefit[];
  };
  faq: {
    eyebrow: string;
    headline: string;
    subhead: string;
    items: ApplyFaqItem[];
  };
  cta: {
    eyebrow: string;
    headline: string;
    body: string;
    primaryCta: string;
    primaryHref: string;
    secondaryCta: string;
    secondaryHref: string;
  };
};

export const DEFAULT_APPLY_SECTIONS: ApplyPageSections = {
  hero: {
    badge: "Applications reviewed every two weeks",
    headline: "Turn your expert audience into managed commercial work.",
    subhead:
      "Credible represents founders, operators, investors, and specialist voices with B2B audiences. You keep the voice. We qualify inbound, price opportunities, negotiate scope, and manage delivery.",
    assurances: [],
    nextEyebrow: "What happens next",
    next: [
      "A manager checks audience fit and commercial readiness.",
      "Qualified applicants get a fit call, not a generic sequence.",
      "If it is not right, the response is clear so you can move on.",
    ],
  },
  authority: {
    headline: "Authority is easier to sell when it is managed.",
    items: [
      {
        value: "24",
        label: "signed voices",
        note: "Selective enough to keep deal quality high.",
      },
      {
        value: "4",
        label: "commercial formats",
        note: "Partnerships, speaking, events, and ambassador work.",
      },
      {
        value: "14d",
        label: "review window",
        note: "Qualified applications get a clear next step quickly.",
      },
      {
        value: "1:1",
        label: "named manager",
        note: "A real operator handles fit, pricing, and scope.",
      },
    ],
  },
  qualify: {
    eyebrow: "Self qualify",
    headline: "Built for expert voices brands already trust.",
    subhead:
      "The best applicants have authority in a category, not just attention. This page makes that distinction obvious before someone reaches the form.",
    fitEyebrow: "Likely a fit",
    fit: [
      "B2B audience of buyers, builders, or decision-makers",
      "Consistent body of work brands can evaluate",
      "Interested in repeat commercial work, not one-off posts",
    ],
    notFitEyebrow: "Probably not a fit",
    notFit: [
      "Consumer entertainment or lifestyle-first reach",
      "No consistent publishing, speaking, or hosting yet",
      "Looking only for a directory listing or passive discovery",
    ],
  },
  path: {
    eyebrow: "The path",
    headline: "A straight path from application to managed briefs.",
    subhead:
      "No deck, no fee, and no portal login. Every application gets a clear answer.",
    steps: [
      {
        n: "01",
        phase: "Step 01 · 5 min",
        title: "Submit the essentials",
        body: "Audience, platform, expertise, formats, and recent work. No deck, no fee, no portal login.",
        outcome: "Queued for review",
        filled: false,
      },
      {
        n: "02",
        phase: "Step 02 · 14 days",
        title: "Get a human read",
        body: "A manager reviews your fit against audience, category authority, and commercial potential.",
        outcome: "Yes, no, or more context",
        filled: false,
      },
      {
        n: "03",
        phase: "Step 03 · if aligned",
        title: "Start representation",
        body: "Terms, roster profile, deal packaging, and qualified inbound handled by a named manager.",
        outcome: "Managed commercial work",
        filled: true,
      },
    ],
  },
  benefits: {
    eyebrow: "What you get",
    headline: "Representation that protects the work and grows the business.",
    subhead:
      "The offer is deliberately concrete: fewer vague promises, more explicit management value.",
    items: [
      {
        icon: "envelope",
        title: "Managed inbound",
        body: "Filter briefs, negotiate scope, and keep poor-fit asks off your calendar.",
      },
      {
        icon: "briefcase",
        title: "Brand partnerships",
        body: "Series, newsletters, and considered integrations built around your voice.",
      },
      {
        icon: "microphone",
        title: "Speaking & events",
        body: "Keynotes, firesides, and hosted programming backed by PepTalk infrastructure.",
      },
      {
        icon: "chart",
        title: "Commercial strategy",
        body: "Pricing, packaging, and format mix for repeat revenue instead of ad hoc gigs.",
      },
    ],
  },
  faq: {
    eyebrow: "FAQ",
    headline: "Common reasons people hesitate.",
    subhead:
      "Answers sit close to the form instead of sending motivated applicants away to find clarity.",
    items: [
      {
        q: "Is there a follower minimum?",
        a: "No fixed threshold. We care about professional trust, audience relevance, and evidence of category authority.",
      },
      {
        q: "What are the requirements?",
        a: "There is no fixed follower count. We look for operator credibility, an engaged professional audience, a body of published or spoken work, and genuine commercial ambition. Micro-audiences with high trust can qualify if the fit is strong.",
      },
      {
        q: "Do you take everyone who applies?",
        a: "No. We cap the roster so every signed creator gets real manager attention. Applications receive a clear yes, no, or request for more context — not silence.",
      },
      {
        q: "What does representation cost?",
        a: "Standard agency terms on commercial work we originate or manage. No fee to apply. We walk through the model on a fit call before anything is signed.",
      },
      {
        q: "How long until I hear back?",
        a: "Applications are reviewed every two weeks. Qualified profiles typically hear within 14 days of the review window.",
      },
      {
        q: "Can I keep existing partners?",
        a: "Yes, in most cases. We ask for transparency on existing representation and exclusivity only where a specific deal requires it.",
      },
    ],
  },
  cta: {
    eyebrow: "Start application · 5 minutes",
    headline: "Tell us about your audience.",
    body: "Five minutes, no deck, no fee. Applications are reviewed every two weeks and every one gets a clear answer.",
    primaryCta: "Start the application",
    primaryHref: "#apply",
    secondaryCta: "See who we represent",
    secondaryHref: "/roster",
  },
};

function asString(value: unknown, fallback: string) {
  return typeof value === "string" ? value : fallback;
}

function padN(index: number, fallback: string) {
  return fallback.trim() || String(index + 1).padStart(2, "0");
}

function mergeStrings(raw: unknown, defaults: string[]): string[] {
  if (!Array.isArray(raw)) return [...defaults];
  const merged = raw
    .map((item, i) => asString(item, defaults[i] ?? "").trim())
    .filter(Boolean);
  return merged.length > 0 ? merged : [...defaults];
}

function mergeOptionalStrings(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
}

function mergeAuthority(
  raw: unknown,
  defaults: ApplyAuthorityItem[],
): ApplyAuthorityItem[] {
  if (!Array.isArray(raw)) return defaults.map((item) => ({ ...item }));

  const merged = raw
    .map((item, i) => {
      const row = (item && typeof item === "object" ? item : {}) as Partial<
        ApplyAuthorityItem
      >;
      const fallback = defaults[i] ?? { value: "", label: "", note: "" };
      const value = asString(row.value, fallback.value);
      const label = asString(row.label, fallback.label);
      const note = asString(row.note, fallback.note);
      if (!value.trim() && !label.trim() && !note.trim()) return null;
      return { value, label, note };
    })
    .filter((item): item is ApplyAuthorityItem => item !== null);

  return merged.length > 0 ? merged : defaults.map((item) => ({ ...item }));
}

function asBenefitIcon(value: unknown, fallback: ApplyBenefitIcon): ApplyBenefitIcon {
  return APPLY_BENEFIT_ICONS.includes(value as ApplyBenefitIcon)
    ? (value as ApplyBenefitIcon)
    : fallback;
}

function mergePath(raw: unknown, defaults: ApplyPathStep[]): ApplyPathStep[] {
  if (!Array.isArray(raw)) return defaults.map((item) => ({ ...item }));

  const merged = raw
    .map((item, i) => {
      const row = (item && typeof item === "object" ? item : {}) as Partial<
        ApplyPathStep
      >;
      const fallback = defaults[i] ?? {
        n: "",
        phase: "",
        title: "",
        body: "",
        outcome: "",
        filled: false,
      };
      const title = asString(row.title, fallback.title);
      const body = asString(row.body, fallback.body);
      if (!title.trim() && !body.trim()) return null;
      return {
        n: padN(i, asString(row.n, fallback.n)),
        phase: asString(row.phase, fallback.phase),
        title,
        body,
        outcome: asString(row.outcome, fallback.outcome),
        filled: typeof row.filled === "boolean" ? row.filled : fallback.filled,
      };
    })
    .filter((item): item is ApplyPathStep => item !== null);

  return merged.length > 0 ? merged : defaults.map((item) => ({ ...item }));
}

function mergeBenefits(
  raw: unknown,
  defaults: ApplyBenefit[],
): ApplyBenefit[] {
  if (!Array.isArray(raw)) return defaults.map((item) => ({ ...item }));

  const merged = raw
    .map((item, i) => {
      const row = (item && typeof item === "object" ? item : {}) as Partial<
        ApplyBenefit
      >;
      const fallback = defaults[i] ?? {
        icon: "envelope" as const,
        title: "",
        body: "",
      };
      const title = asString(row.title, fallback.title);
      const body = asString(row.body, fallback.body);
      if (!title.trim() && !body.trim()) return null;
      return {
        icon: asBenefitIcon(row.icon, fallback.icon),
        title,
        body,
      };
    })
    .filter((item): item is ApplyBenefit => item !== null);

  return merged.length > 0 ? merged : defaults.map((item) => ({ ...item }));
}

function mergeFaq(raw: unknown, defaults: ApplyFaqItem[]): ApplyFaqItem[] {
  if (!Array.isArray(raw)) return defaults.map((item) => ({ ...item }));

  const merged = raw
    .map((item, i) => {
      const row = (item && typeof item === "object" ? item : {}) as Partial<
        ApplyFaqItem
      >;
      const fallback = defaults[i] ?? { q: "", a: "" };
      const q = asString(row.q, fallback.q);
      const a = asString(row.a, fallback.a);
      if (!q.trim() && !a.trim()) return null;
      return { q, a };
    })
    .filter((item): item is ApplyFaqItem => item !== null);

  return merged.length > 0 ? merged : defaults.map((item) => ({ ...item }));
}

export function mergeApplySections(raw: unknown): ApplyPageSections {
  const data = (raw && typeof raw === "object" ? raw : {}) as {
    hero?: Partial<ApplyPageSections["hero"]> & {
      assurances?: unknown;
      next?: unknown;
    };
    authority?: Partial<ApplyPageSections["authority"]> & { items?: unknown };
    qualify?: Partial<ApplyPageSections["qualify"]> & {
      fit?: unknown;
      notFit?: unknown;
    };
    path?: Partial<ApplyPageSections["path"]> & { steps?: unknown };
    benefits?: Partial<ApplyPageSections["benefits"]> & { items?: unknown };
    faq?: Partial<ApplyPageSections["faq"]> & { items?: unknown };
    cta?: Partial<ApplyPageSections["cta"]>;
  };
  const defaults = DEFAULT_APPLY_SECTIONS;
  const hero = data.hero ?? {};
  const authority = data.authority ?? {};
  const qualify = data.qualify ?? {};
  const path = data.path ?? {};
  const benefits = data.benefits ?? {};
  const faq = data.faq ?? {};
  const cta = data.cta ?? {};

  return {
    hero: {
      badge: asString(hero.badge, defaults.hero.badge),
      headline: asString(hero.headline, defaults.hero.headline),
      subhead: asString(hero.subhead, defaults.hero.subhead),
      assurances: mergeOptionalStrings(hero.assurances),
      nextEyebrow: asString(hero.nextEyebrow, defaults.hero.nextEyebrow),
      next: mergeStrings(hero.next, defaults.hero.next),
    },
    authority: {
      headline: asString(authority.headline, defaults.authority.headline),
      items: mergeAuthority(authority.items, defaults.authority.items),
    },
    qualify: {
      eyebrow: asString(qualify.eyebrow, defaults.qualify.eyebrow),
      headline: asString(qualify.headline, defaults.qualify.headline),
      subhead: asString(qualify.subhead, defaults.qualify.subhead),
      fitEyebrow: asString(qualify.fitEyebrow, defaults.qualify.fitEyebrow),
      fit: mergeStrings(qualify.fit, defaults.qualify.fit),
      notFitEyebrow: asString(
        qualify.notFitEyebrow,
        defaults.qualify.notFitEyebrow,
      ),
      notFit: mergeStrings(qualify.notFit, defaults.qualify.notFit),
    },
    path: {
      eyebrow: asString(path.eyebrow, defaults.path.eyebrow),
      headline: asString(path.headline, defaults.path.headline),
      subhead: asString(path.subhead, defaults.path.subhead),
      steps: mergePath(path.steps, defaults.path.steps),
    },
    benefits: {
      eyebrow: asString(benefits.eyebrow, defaults.benefits.eyebrow),
      headline: asString(benefits.headline, defaults.benefits.headline),
      subhead: asString(benefits.subhead, defaults.benefits.subhead),
      items: mergeBenefits(benefits.items, defaults.benefits.items),
    },
    faq: {
      eyebrow: asString(faq.eyebrow, defaults.faq.eyebrow),
      headline: asString(faq.headline, defaults.faq.headline),
      subhead: asString(faq.subhead, defaults.faq.subhead),
      items: mergeFaq(faq.items, defaults.faq.items),
    },
    cta: {
      eyebrow: asString(cta.eyebrow, defaults.cta.eyebrow),
      headline: asString(cta.headline, defaults.cta.headline),
      body: asString(cta.body, defaults.cta.body),
      primaryCta: asString(cta.primaryCta, defaults.cta.primaryCta),
      primaryHref: asString(cta.primaryHref, defaults.cta.primaryHref),
      secondaryCta: asString(cta.secondaryCta, defaults.cta.secondaryCta),
      secondaryHref: asString(cta.secondaryHref, defaults.cta.secondaryHref),
    },
  };
}

export function emptyApplyAuthorityItem(): ApplyAuthorityItem {
  return { value: "", label: "", note: "" };
}

export function emptyApplyPathStep(): ApplyPathStep {
  return {
    n: "",
    phase: "",
    title: "",
    body: "",
    outcome: "",
    filled: false,
  };
}

export function emptyApplyBenefit(): ApplyBenefit {
  return { icon: "envelope", title: "", body: "" };
}

export function emptyApplyFaqItem(): ApplyFaqItem {
  return { q: "", a: "" };
}

export function listToLines(items: string[]) {
  return items.join("\n");
}

export function linesToList(text: string) {
  return text.split("\n").map((line) => line.trimEnd());
}
