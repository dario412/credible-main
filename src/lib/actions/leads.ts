"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";

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
  company: z.string().max(120).optional(),
  format: z.string().min(1).max(60),
  brief: z.string().min(1).max(5000),
});

export async function submitBrief(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = briefSchema.safeParse({
    email: formData.get("email"),
    name: formData.get("name"),
    company: formData.get("company") || undefined,
    format: formData.get("format"),
    brief: formData.get("brief"),
  });
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fill in all required fields correctly.",
    };
  }

  await prisma.lead.create({
    data: {
      email: parsed.data.email,
      name: parsed.data.name,
      company: parsed.data.company,
      message: `Format: ${parsed.data.format}\n\n${parsed.data.brief}`,
      source: "CONTACT",
    },
  });

  return {
    ok: true,
    message: "Brief received — you’ll hear from us within 48 hours.",
  };
}

const sendBriefSchema = z.object({
  audience: z.string().max(40).optional(),
  name: z.string().min(1).max(120),
  email: z.string().email(),
  company: z.string().max(120).optional(),
  jobRole: z.string().max(120).optional(),
  creators: z.string().max(2000).optional(),
  formats: z.string().max(400).optional(),
  timing: z.string().max(60).optional(),
  budget: z.string().max(60).optional(),
  brief: z.string().min(1).max(5000),
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
    brief: formData.get("brief"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please check the highlighted fields and try again.",
    };
  }

  const { brief, ...details } = parsed.data;
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

  await prisma.lead.create({
    data: {
      email: details.email,
      name: details.name,
      company: details.company,
      message: summary ? `${summary}\n\n${brief}` : brief,
      source: "CONTACT",
    },
  });

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
