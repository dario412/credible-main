export type ContactLogo = {
  name: string;
  src: string;
  href: string;
};

export type ContactNextStep = {
  title: string;
  body: string;
};

export type ContactPageSections = {
  briefedBy: {
    label: string;
    logos: ContactLogo[];
  };
  nextSteps: {
    eyebrow: string;
    steps: ContactNextStep[];
    footnote: string;
    browseLabel: string;
    browseHref: string;
    emailLabel: string;
    email: string;
  };
};

export const DEFAULT_CONTACT_SECTIONS: ContactPageSections = {
  briefedBy: {
    label: "Briefed by teams at",
    logos: [
      { name: "Stripe", src: "/brand/clients/stripe-wordmark-white.svg", href: "" },
      { name: "Notion", src: "/brand/clients/notion-wordmark-white.svg", href: "" },
      { name: "Figma", src: "/brand/clients/figma-wordmark-white.svg", href: "" },
      { name: "Linear", src: "/brand/clients/linear-wordmark-white.svg", href: "" },
      { name: "Ramp", src: "/brand/clients/ramp-wordmark-white.svg", href: "" },
      { name: "Intercom", src: "/brand/clients/intercom-wordmark-white.svg", href: "" },
    ],
  },
  nextSteps: {
    eyebrow: "What happens next",
    steps: [
      {
        title: "Same-day acknowledgement",
        body: "A real person confirms your brief and flags anything missing.",
      },
      {
        title: "Shortlist within 48 hours",
        body: "Named creators with reach data, past work and format-level pricing.",
      },
      {
        title: "Scoped proposal",
        body: "Deliverables, dates and commercials in one document you can forward.",
      },
    ],
    footnote: "Rather browse first?",
    browseLabel: "See all 24 creators",
    browseHref: "/roster",
    emailLabel: "email us",
    email: "hello@crediblecreators.com",
  },
};

function asString(value: unknown, fallback: string) {
  return typeof value === "string" ? value : fallback;
}

function mergeLogos(raw: unknown, defaults: ContactLogo[]): ContactLogo[] {
  if (!Array.isArray(raw)) return defaults.map((logo) => ({ ...logo }));

  const merged = raw
    .map((item, i) => {
      const row = (item && typeof item === "object" ? item : {}) as Partial<
        ContactLogo
      >;
      const fallback = defaults[i] ?? { name: "", src: "", href: "" };
      const name = asString(row.name, fallback.name);
      const src = asString(row.src, fallback.src);
      const href = asString(row.href, fallback.href);
      if (!name.trim() && !src.trim()) return null;
      return { name, src, href };
    })
    .filter((item): item is ContactLogo => item !== null);

  return merged.length > 0 ? merged : defaults.map((logo) => ({ ...logo }));
}

function mergeSteps(
  raw: unknown,
  defaults: ContactNextStep[],
): ContactNextStep[] {
  if (!Array.isArray(raw)) return defaults.map((step) => ({ ...step }));

  const merged = raw
    .map((item, i) => {
      const row = (item && typeof item === "object" ? item : {}) as Partial<
        ContactNextStep
      >;
      const fallback = defaults[i] ?? { title: "", body: "" };
      const title = asString(row.title, fallback.title);
      const body = asString(row.body, fallback.body);
      if (!title.trim() && !body.trim()) return null;
      return { title, body };
    })
    .filter((item): item is ContactNextStep => item !== null);

  return merged.length > 0 ? merged : defaults.map((step) => ({ ...step }));
}

export function mergeContactSections(raw: unknown): ContactPageSections {
  const data = (raw && typeof raw === "object" ? raw : {}) as {
    briefedBy?: Partial<ContactPageSections["briefedBy"]> & {
      logos?: unknown;
    };
    nextSteps?: Partial<ContactPageSections["nextSteps"]> & {
      steps?: unknown;
    };
  };
  const defaults = DEFAULT_CONTACT_SECTIONS;
  const briefedBy = data.briefedBy ?? {};
  const nextSteps = data.nextSteps ?? {};

  return {
    briefedBy: {
      label: asString(briefedBy.label, defaults.briefedBy.label),
      logos: mergeLogos(briefedBy.logos, defaults.briefedBy.logos),
    },
    nextSteps: {
      eyebrow: asString(nextSteps.eyebrow, defaults.nextSteps.eyebrow),
      steps: mergeSteps(nextSteps.steps, defaults.nextSteps.steps),
      footnote: asString(nextSteps.footnote, defaults.nextSteps.footnote),
      browseLabel: asString(
        nextSteps.browseLabel,
        defaults.nextSteps.browseLabel,
      ),
      browseHref: asString(nextSteps.browseHref, defaults.nextSteps.browseHref),
      emailLabel: asString(nextSteps.emailLabel, defaults.nextSteps.emailLabel),
      email: asString(nextSteps.email, defaults.nextSteps.email),
    },
  };
}

export function emptyContactLogo(): ContactLogo {
  return { name: "", src: "", href: "" };
}

export function emptyContactStep(): ContactNextStep {
  return { title: "", body: "" };
}
