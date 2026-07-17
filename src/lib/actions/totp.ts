"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import * as OTPAuth from "otpauth";
import QRCode from "qrcode";
import { revalidatePath } from "next/cache";

export async function getTotpSetup() {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" as const };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });
  if (!user) return { error: "Unauthorized" as const };
  if (user.totpEnabled) return { error: "already_enabled" as const };

  let secret = user.totpSecret;
  if (!secret) {
    secret = new OTPAuth.Secret({ size: 20 }).base32;
    await prisma.user.update({
      where: { id: user.id },
      data: { totpSecret: secret },
    });
  }

  const totp = new OTPAuth.TOTP({
    issuer: "Credible Creators",
    label: user.email,
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(secret),
  });

  const uri = totp.toString();
  const qrDataUrl = await QRCode.toDataURL(uri);

  return { secret, qrDataUrl, uri };
}

export async function enableTotp(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, message: "Unauthorized" };
  }

  const code = String(formData.get("code") ?? "");
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });
  if (!user?.totpSecret) {
    return { ok: false, message: "Setup not started." };
  }

  const totp = new OTPAuth.TOTP({
    issuer: "Credible Creators",
    label: user.email,
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(user.totpSecret),
  });

  if (totp.validate({ token: code, window: 1 }) === null) {
    return { ok: false, message: "Invalid code. Try again." };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { totpEnabled: true },
  });

  revalidatePath("/admin");
  return { ok: true, message: "Two-factor authentication enabled." };
}
