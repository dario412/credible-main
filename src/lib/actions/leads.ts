"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";

import {
  buildHomeBriefPeptalkPayload,
  buildSendBriefPeptalkPayload,
  parsePeptalkContext,
  parsePeptalkTracking,
  submitPeptalkPayload,
} from "@/lib/peptalk";

const waitlistSchema = z.object({
  email: z.string().email(),
});

const contactSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(120),
  company: z.string().max(120).optional(),
  message: z.string().min(1).max(5000),
});

export type FormState = {
  ok: boolean;
  message: string;
};

export async function submitWaitlist(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = waitlistSchema.safeParse({
    email: formData.get("email"),
  });
  if (!parsed.success) {
    return { ok: false, message: "Please enter a valid email." };
  }

  await prisma.lead.create({
    data: {
      email: parsed.data.email,
      source: "WAITLIST",
    },
  });

  return { ok: true, message: "You’re on the list. We’ll be in touch." };
}

const briefSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(120),
  company: z.string().min(1).max(120),
  phone: z.string().min(1).max(40),
  role: z.string().max(120).optional(),
  brief: z.string().min(1).max(5000),
  deliverables: z.string().max(5000).optional(),
});

export async function submitBrief(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = briefSchema.safeParse({
    email: formData.get("email"),
    name: formData.get("name"),
    company: formData.get("company"),
    phone: formData.get("phone"),
    role: formData.get("role") || undefined,
    brief: formData.get("brief"),
    deliverables: formData.get("deliverables") || undefined,
  });
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fill in all required fields correctly.",
    };
  }

  let trackingRaw: unknown = {};
  let contextRaw: unknown = {};
  try {
    trackingRaw = JSON.parse(String(formData.get("peptalkTracking") || "{}"));
  } catch {
    trackingRaw = {};
  }
  try {
    contextRaw = JSON.parse(String(formData.get("peptalkContext") || "{}"));
  } catch {
    contextRaw = {};
  }

  try {
    await submitPeptalkPayload(
      buildHomeBriefPeptalkPayload(
        parsed.data,
        parsePeptalkTracking(trackingRaw),
        parsePeptalkContext(contextRaw),
      ),
    );
  } catch {
    return {
      ok: false,
      message: "We couldn’t send your brief just now. Please try again.",
    };
  }

  const message = [
    parsed.data.phone ? `Phone: ${parsed.data.phone}` : null,
    parsed.data.role ? `Role: ${parsed.data.role}` : null,
    parsed.data.brief,
    parsed.data.deliverables
      ? `Deliverables:\n${parsed.data.deliverables}`
      : null,
  ]
    .filter((line): line is string => Boolean(line))
    .join("\n\n");

  try {
    await prisma.lead.create({
      data: {
        email: parsed.data.email,
        name: parsed.data.name,
        company: parsed.data.company,
        message,
        source: "CONTACT",
      },
    });
  } catch {
    // Peptalk already received the brief — don't fail the visitor.
  }

  return {
    ok: true,
    message: "Brief received — you’ll hear from us within 48 hours.",
  };
}

const sendBriefSchema = z
  .object({
    audience: z.string().max(40).optional(),
    name: z.string().min(1).max(120),
    email: z.string().email(),
    company: z.string().max(120).optional(),
    jobRole: z.string().max(120).optional(),
    creators: z.string().max(2000).optional(),
    formats: z.string().max(400).optional(),
    timing: z.string().max(60).optional(),
    budget: z.string().max(60).optional(),
    campaign: z.string().max(5000).optional(),
    targetAudience: z.string().max(5000).optional(),
    successMetrics: z.string().max(5000).optional(),
    brief: z.string().max(5000).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.audience === "creator") {
      if (!data.brief?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Brief is required",
          path: ["brief"],
        });
      }
      return;
    }
    if (!data.campaign?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Campaign is required",
        path: ["campaign"],
      });
    }
    if (!data.targetAudience?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Target audience is required",
        path: ["targetAudience"],
      });
    }
    if (!data.successMetrics?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Success metrics are required",
        path: ["successMetrics"],
      });
    }
  });

/**
 * The Lead model has no structured brief columns, so the qualifying answers are
 * folded into `message` above the free-text brief.
 */
export async function submitSendBrief(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = sendBriefSchema.safeParse({
    audience: formData.get("audience") || undefined,
    name: formData.get("name"),
    email: formData.get("email"),
    company: formData.get("company") || undefined,
    jobRole: formData.get("jobRole") || undefined,
    creators: formData.get("creators") || undefined,
    formats: formData.get("formats") || undefined,
    timing: formData.get("timing") || undefined,
    budget: formData.get("budget") || undefined,
    campaign: formData.get("campaign") || undefined,
    targetAudience: formData.get("targetAudience") || undefined,
    successMetrics: formData.get("successMetrics") || undefined,
    brief: formData.get("brief") || undefined,
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please check the highlighted fields and try again.",
    };
  }

  const { brief, campaign, targetAudience, successMetrics, ...details } =
    parsed.data;

  let trackingRaw: unknown = {};
  let contextRaw: unknown = {};
  try {
    trackingRaw = JSON.parse(String(formData.get("peptalkTracking") || "{}"));
  } catch {
    trackingRaw = {};
  }
  try {
    contextRaw = JSON.parse(String(formData.get("peptalkContext") || "{}"));
  } catch {
    contextRaw = {};
  }

  try {
    await submitPeptalkPayload(
      buildSendBriefPeptalkPayload(
        parsed.data,
        parsePeptalkTracking(trackingRaw),
        parsePeptalkContext(contextRaw),
      ),
    );
  } catch {
    return {
      ok: false,
      message: "We couldn’t send your brief just now. Please try again.",
    };
  }

  const summary = [
    ["Briefing as", details.audience],
    ["Role", details.jobRole],
    ["Creators", details.creators],
    ["Formats", details.formats],
    ["Timing", details.timing],
    ["Budget", details.budget],
  ]
    .filter((row): row is [string, string] => Boolean(row[1]))
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");

  const narrative =
    details.audience === "creator"
      ? (brief ?? "")
      : [
          ["Campaign", campaign],
          ["Audience", targetAudience],
          ["Success metrics", successMetrics],
        ]
          .filter((row): row is [string, string] => Boolean(row[1]?.trim()))
          .map(([label, value]) => `${label}:\n${value}`)
          .join("\n\n");

  const message = summary
    ? `${summary}\n\n${narrative}`
    : narrative;
  try {
    await prisma.lead.create({
      data: {
        email: details.email,
        name: details.name,
        company: details.company,
        message,
        source: "CONTACT",
      },
    });
  } catch {
    // Peptalk already received the brief — don't fail the visitor.
  }

  return {
    ok: true,
    message: "Brief received — you’ll hear from us within 48 hours.",
  };
}

export async function submitContact(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = contactSchema.safeParse({
    email: formData.get("email"),
    name: formData.get("name"),
    company: formData.get("company") || undefined,
    message: formData.get("message"),
  });
  if (!parsed.success) {
    return { ok: false, message: "Please fill in all required fields correctly." };
  }

  await prisma.lead.create({
    data: {
      email: parsed.data.email,
      name: parsed.data.name,
      company: parsed.data.company,
      message: parsed.data.message,
      source: "CONTACT",
    },
  });

  return { ok: true, message: "Thanks — we received your message." };
}

const optionalUrl = z
  .string()
  .max(500)
  .optional()
  .transform((value) => {
    const trimmed = value?.trim();
    return trimmed ? trimmed : undefined;
  });

const representationSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  phone: z.string().max(60).optional(),
  linkedinUrl: z
    .string()
    .trim()
    .min(1, "LinkedIn URL is required")
    .max(500)
    .refine(
      (value) => /linkedin\.com/i.test(value),
      "Enter a LinkedIn profile URL",
    ),
  instagramUrl: optionalUrl,
  tiktokUrl: optionalUrl,
  youtubeUrl: optionalUrl,
  podcastUrl: optionalUrl,
  newsletterUrl: optionalUrl,
  xUrl: optionalUrl,
  facebookUrl: optionalUrl,
  websiteUrl: optionalUrl,
});

export async function submitRepresentationApplication(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const asOptional = (key: string) => {
    const value = String(formData.get(key) ?? "").trim();
    return value || undefined;
  };

  const parsed = representationSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: asOptional("phone"),
    linkedinUrl: formData.get("linkedinUrl"),
    instagramUrl: asOptional("instagramUrl"),
    tiktokUrl: asOptional("tiktokUrl"),
    youtubeUrl: asOptional("youtubeUrl"),
    podcastUrl: asOptional("podcastUrl"),
    newsletterUrl: asOptional("newsletterUrl"),
    xUrl: asOptional("xUrl"),
    facebookUrl: asOptional("facebookUrl"),
    websiteUrl: asOptional("websiteUrl"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please check the highlighted fields and try again.",
    };
  }

  const data = parsed.data;
  const channels = [
    ["LinkedIn", data.linkedinUrl],
    ["Instagram", data.instagramUrl],
    ["TikTok", data.tiktokUrl],
    ["YouTube", data.youtubeUrl],
    ["Podcast", data.podcastUrl],
    ["Newsletter", data.newsletterUrl],
    ["X.com", data.xUrl],
    ["Facebook", data.facebookUrl],
    ["Website", data.websiteUrl],
  ]
    .filter((entry): entry is [string, string] => Boolean(entry[1]))
    .map(([label, url]) => `${label}: ${url}`)
    .join("\n");

  const message = [
    "Representation application",
    "",
    data.phone ? `Phone: ${data.phone}` : null,
    "",
    "Channels:",
    channels,
  ]
    .filter((line): line is string => line !== null)
    .join("\n");

  await prisma.lead.create({
    data: {
      email: data.email,
      name: data.name,
      message,
      source: "CONTACT",
    },
  });

  return {
    ok: true,
    message:
      "Application received. We review submissions fortnightly and reply to every qualified application.",
  };
}
