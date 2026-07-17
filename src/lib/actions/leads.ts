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
