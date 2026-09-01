export const PEPTALK_SUBMIT_URL =
  process.env.PEPTALK_SUBMIT_URL?.trim() ||
  "https://api.ops.getapeptalk.com/api/webflow/submit";

export const PEPTALK_WEBSITE = "Credible";

export type PeptalkContact = {
  name: string;
  email: string;
  phone: string;
};

export type PeptalkTracking = {
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmTerm: string;
  utmContent: string;
  gclid: string;
  msclkid: string;
  gbraid: string;
  wbraid: string;
  fbclid: string;
  liFatId: string;
  rdtCid: string;
  dclid: string;
  impactCode: string;
  segmentAnonymousId: string;
  referrer: string;
  pageUrl: string;
};

export type PeptalkContext = {
  timezone: string;
  timezoneOffset: number;
  language: string;
  userAgent: string;
};

export type PeptalkFormData = {
  topic: string;
  date: string;
  dateUnsure: boolean;
  eventType: string;
  location: string;
  budget: string;
  budgetCurrency: string;
  details: string;
  website: string;
};

export type PeptalkPayload = {
  contact: PeptalkContact;
  tracking: PeptalkTracking;
  context: PeptalkContext;
  formData: PeptalkFormData;
};

export const EMPTY_PEPTALK_TRACKING: PeptalkTracking = {
  utmSource: "",
  utmMedium: "",
  utmCampaign: "",
  utmTerm: "",
  utmContent: "",
  gclid: "",
  msclkid: "",
  gbraid: "",
  wbraid: "",
  fbclid: "",
  liFatId: "",
  rdtCid: "",
  dclid: "",
  impactCode: "",
  segmentAnonymousId: "",
  referrer: "",
  pageUrl: "",
};

export const EMPTY_PEPTALK_CONTEXT: PeptalkContext = {
  timezone: "",
  timezoneOffset: 0,
  language: "",
  userAgent: "",
};

export type SendBriefPeptalkInput = {
  audience?: string;
  name: string;
  email: string;
  company?: string;
  jobRole?: string;
  creators?: string;
  formats?: string;
  timing?: string;
  budget?: string;
  campaign?: string;
  targetAudience?: string;
  successMetrics?: string;
  brief?: string;
};

export type HomeBriefPeptalkInput = {
  name: string;
  email: string;
  phone: string;
  company: string;
  role?: string;
  creators?: string;
  brief: string;
  deliverables?: string;
};

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export function parsePeptalkTracking(raw: unknown): PeptalkTracking {
  const data = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  return {
    utmSource: asString(data.utmSource),
    utmMedium: asString(data.utmMedium),
    utmCampaign: asString(data.utmCampaign),
    utmTerm: asString(data.utmTerm),
    utmContent: asString(data.utmContent),
    gclid: asString(data.gclid),
    msclkid: asString(data.msclkid),
    gbraid: asString(data.gbraid),
    wbraid: asString(data.wbraid),
    fbclid: asString(data.fbclid),
    liFatId: asString(data.liFatId),
    rdtCid: asString(data.rdtCid),
    dclid: asString(data.dclid),
    impactCode: asString(data.impactCode),
    segmentAnonymousId: asString(data.segmentAnonymousId),
    referrer: asString(data.referrer),
    pageUrl: asString(data.pageUrl),
  };
}

export function parsePeptalkContext(raw: unknown): PeptalkContext {
  const data = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  return {
    timezone: asString(data.timezone),
    timezoneOffset: asNumber(data.timezoneOffset),
    language: asString(data.language),
    userAgent: asString(data.userAgent),
  };
}

function line(label: string, value?: string) {
  const trimmed = value?.trim();
  return trimmed ? `${label}: ${trimmed}` : null;
}

function block(label: string, value?: string) {
  const trimmed = value?.trim();
  return trimmed ? `${label}:\n${trimmed}` : null;
}

export function buildSendBriefPeptalkPayload(
  input: SendBriefPeptalkInput,
  tracking: PeptalkTracking,
  context: PeptalkContext,
): PeptalkPayload {
  const details = [
    line("Website", PEPTALK_WEBSITE),
    line("Briefing as", input.audience),
    line("Company", input.company),
    line("Role", input.jobRole),
    line("Creators", input.creators),
    line("Formats", input.formats),
    line("Timing", input.timing),
    line("Budget", input.budget),
    block("Campaign", input.campaign),
    block("Audience", input.targetAudience),
    block("Success metrics", input.successMetrics),
    block("Application", input.brief),
  ]
    .filter((item): item is string => Boolean(item))
    .join("\n\n");

  const dateUnsure =
    !input.timing?.trim() || input.timing.trim() === "Just exploring";

  return {
    contact: {
      name: input.name.trim(),
      email: input.email.trim(),
      phone: "",
    },
    tracking: { ...EMPTY_PEPTALK_TRACKING, ...tracking },
    context: { ...EMPTY_PEPTALK_CONTEXT, ...context },
    formData: {
      topic: details,
      date: "",
      dateUnsure,
      eventType: "Not sure",
      location: "",
      budget: input.budget?.trim() || "Not set yet",
      budgetCurrency: "USD",
      details,
      website: PEPTALK_WEBSITE,
    },
  };
}

/** Homepage brand-brief form → Peptalk webflow submit JSON. */
export function buildHomeBriefPeptalkPayload(
  input: HomeBriefPeptalkInput,
  tracking: PeptalkTracking,
  context: PeptalkContext,
): PeptalkPayload {
  const details = [
    line("Website", PEPTALK_WEBSITE),
    line("Company", input.company),
    line("Role", input.role),
    line("Creators", input.creators),
    block("Brief", input.brief),
    block("Deliverables", input.deliverables),
  ]
    .filter((item): item is string => Boolean(item))
    .join("\n\n");

  return {
    contact: {
      name: input.name.trim(),
      email: input.email.trim(),
      phone: input.phone.trim(),
    },
    tracking: { ...EMPTY_PEPTALK_TRACKING, ...tracking },
    context: { ...EMPTY_PEPTALK_CONTEXT, ...context },
    formData: {
      topic: input.brief.trim(),
      date: "",
      dateUnsure: true,
      eventType: "Not sure",
      location: "",
      budget: "Not set yet",
      budgetCurrency: "USD",
      details,
      website: PEPTALK_WEBSITE,
    },
  };
}

export async function submitPeptalkPayload(payload: PeptalkPayload) {
  const res = await fetch(PEPTALK_SUBMIT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Peptalk submit failed: ${res.status}`);
  }
}
