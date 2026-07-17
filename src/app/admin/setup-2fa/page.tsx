import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getTotpSetup } from "@/lib/actions/totp";
import { Setup2faForm } from "@/components/setup-2fa-form";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Set up 2FA",
  path: "/admin/setup-2fa",
  noIndex: true,
});

export default async function Setup2faPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (session.user.totpEnabled) redirect("/admin");

  const setup = await getTotpSetup();
  if ("error" in setup && setup.error === "already_enabled") {
    redirect("/admin");
  }
  if ("error" in setup) {
    redirect("/admin/login");
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="font-display text-3xl">Set up two-factor authentication</h1>
      <p className="mt-3 text-sm text-muted">
        Scan the QR code with Google Authenticator, Authy, or 1Password, then
        enter the 6-digit code to finish.
      </p>
      <div className="mt-8 flex justify-center border border-charcoal/10 bg-white p-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={setup.qrDataUrl} alt="2FA QR code" width={200} height={200} />
      </div>
      <p className="mt-4 break-all text-center text-xs text-muted">
        Manual key: {setup.secret}
      </p>
      <div className="mt-8">
        <Setup2faForm />
      </div>
    </div>
  );
}
