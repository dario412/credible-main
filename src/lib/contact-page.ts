export type ContactLogo = {
  name: string;
  src: string;
  href: string;
};

export type ContactNextStep = {
  title: string;
  body: string;
};

export type ContactChannel = {
  label: string;
  address: string;
  body: string;
};

export type ContactSocial = {
  label: string;
  handle: string;
  href: string;
};

export type ContactPageSections = {
  hero: {
    headline: string;
    headlineAccent: string;
    subhead: string;
  };
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
  footer: {
    channels: ContactChannel[];
    office: {
      eyebrow: string;
      title: string;
      body: string;
      usEyebrow: string;
      usTitle: string;
      usBody: string;
    };
    phone: {
      eyebrow: string;
      number: string;
      tel: string;
      body: string;
      usNumber: string;
      usTel: string;
      usBody: string;
    };
    socials: {
      eyebrow: string;
      items: ContactSocial[];
    };
  };
};

export const DEFAULT_CONTACT_SECTIONS: ContactPageSections = {
  hero: {
    headline: "Brief the voices your buyers",
    headlineAccent: "already trust.",
    subhead:
      "In-house, agency or creator — send us the ambition. We'll come back with a named shortlist within 48 hours.",
  },
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
  footer: {
    channels: [
      {
        label: "Direct email",
        address: "hello@crediblecreators.com",
        body: "General enquiries and anything that doesn’t fit a box.",
      },
    ],
    office: {
      eyebrow: "London office",
      title: "",
      body: "Somers Town, London NW1",
      usEyebrow: "NY office",
      usTitle: "",
      usBody: "New York, NY",
    },
    phone: {
      eyebrow: "",
      number: "+44 20 7946 0018",
      tel: "+442079460018",
      body: "",
      usNumber: "+1 646 794 6018",
      usTel: "+16467946018",
      usBody: "",
    },
    socials: {
      eyebrow: "",
      items: [],
    },
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

function mergeChannels(
  raw: unknown,
  defaults: ContactChannel[],
): ContactChannel[] {
  if (!Array.isArray(raw)) return defaults.map((channel) => ({ ...channel }));

  const merged = raw
    .map((item, i) => {
      const row = (item && typeof item === "object" ? item : {}) as Partial<
        ContactChannel
      >;
      const fallback = defaults[i] ?? { label: "", address: "", body: "" };
      const label = asString(row.label, fallback.label);
      const address = asString(row.address, fallback.address);
      const body = asString(row.body, fallback.body);
      if (!label.trim() && !address.trim() && !body.trim()) return null;
      return { label, address, body };
    })
    .filter((item): item is ContactChannel => item !== null);

  return merged.length > 0 ? merged : defaults.map((channel) => ({ ...channel }));
}

function mergePrimaryChannel(
  raw: unknown,
  defaults: ContactChannel[],
): ContactChannel[] {
  const merged = mergeChannels(raw, defaults);
  const primary = merged[0] ?? defaults[0] ?? emptyContactChannel();
  return [{ ...primary }];
}

export function primaryContactEmail(
  footer: ContactPageSections["footer"],
): ContactChannel {
  return footer.channels[0] ?? DEFAULT_CONTACT_SECTIONS.footer.channels[0]!;
}

function mergeSocials(raw: unknown, defaults: ContactSocial[]): ContactSocial[] {
  if (!Array.isArray(raw)) return defaults.map((item) => ({ ...item }));

  const merged = raw
    .map((item, i) => {
      const row = (item && typeof item === "object" ? item : {}) as Partial<
        ContactSocial
      >;
      const fallback = defaults[i] ?? { label: "", handle: "", href: "" };
      const label = asString(row.label, fallback.label);
      const handle = asString(row.handle, fallback.handle);
      const href = asString(row.href, fallback.href);
      if (!label.trim() && !handle.trim() && !href.trim()) return null;
      return { label, handle, href };
    })
    .filter((item): item is ContactSocial => item !== null);

  return merged.length > 0 ? merged : defaults.map((item) => ({ ...item }));
}

export function mergeContactSections(raw: unknown): ContactPageSections {
  const data = (raw && typeof raw === "object" ? raw : {}) as {
    hero?: Partial<ContactPageSections["hero"]>;
    briefedBy?: Partial<ContactPageSections["briefedBy"]> & {
      logos?: unknown;
    };
    nextSteps?: Partial<ContactPageSections["nextSteps"]> & {
      steps?: unknown;
    };
    footer?: Partial<ContactPageSections["footer"]> & {
      channels?: unknown;
      socials?: Partial<ContactPageSections["footer"]["socials"]> & {
        items?: unknown;
      };
    };
  };
  const defaults = DEFAULT_CONTACT_SECTIONS;
  const hero = data.hero ?? {};
  const briefedBy = data.briefedBy ?? {};
  const nextSteps = data.nextSteps ?? {};
  const footer = data.footer ?? {};
  const office = (footer.office ??
    {}) as Partial<ContactPageSections["footer"]["office"]>;
  const phone = (footer.phone ??
    {}) as Partial<ContactPageSections["footer"]["phone"]>;
  const socials = (footer.socials ??
    {}) as Partial<ContactPageSections["footer"]["socials"]>;

  return {
    hero: {
      headline: asString(hero.headline, defaults.hero.headline),
      headlineAccent: asString(
        hero.headlineAccent,
        defaults.hero.headlineAccent,
      ),
      subhead: asString(hero.subhead, defaults.hero.subhead),
    },
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
    footer: {
      channels: mergePrimaryChannel(
        footer.channels,
        defaults.footer.channels,
      ),
      office: {
        eyebrow: asString(office.eyebrow, defaults.footer.office.eyebrow),
        title: asString(office.title, defaults.footer.office.title),
        body: asString(office.body, defaults.footer.office.body),
        usEyebrow: asString(office.usEyebrow, defaults.footer.office.usEyebrow),
        usTitle: asString(office.usTitle, defaults.footer.office.usTitle),
        usBody: asString(office.usBody, defaults.footer.office.usBody),
      },
      phone: {
        eyebrow: asString(phone.eyebrow, defaults.footer.phone.eyebrow),
        number: asString(phone.number, defaults.footer.phone.number),
        tel: asString(phone.tel, defaults.footer.phone.tel),
        body: asString(phone.body, defaults.footer.phone.body),
        usNumber: asString(phone.usNumber, defaults.footer.phone.usNumber),
        usTel: asString(phone.usTel, defaults.footer.phone.usTel),
        usBody: asString(phone.usBody, defaults.footer.phone.usBody),
      },
      socials: {
        eyebrow: asString(socials.eyebrow, defaults.footer.socials.eyebrow),
        items: mergeSocials(socials.items, defaults.footer.socials.items),
      },
    },
  };
}

export function emptyContactLogo(): ContactLogo {
  return { name: "", src: "", href: "" };
}

export function emptyContactStep(): ContactNextStep {
  return { title: "", body: "" };
}

export function emptyContactChannel(): ContactChannel {
  return { label: "", address: "", body: "" };
}

export function emptyContactSocial(): ContactSocial {
  return { label: "", handle: "", href: "" };
}
