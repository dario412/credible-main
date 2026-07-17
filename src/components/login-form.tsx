"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Field, TextInput } from "@/components/ui";

export function LoginFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [totp, setTotp] = useState("");
  const [needs2fa, setNeeds2fa] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleContinue(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError("");

    const probe = await fetch("/api/auth/probe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = (await probe.json()) as {
      ok: boolean;
      needs2fa?: boolean;
      setupRequired?: boolean;
      error?: string;
    };

    if (!data.ok) {
      setError(data.error ?? "Invalid email or password.");
      setPending(false);
      return;
    }

    if (data.needs2fa) {
      setNeeds2fa(true);
      setPending(false);
      return;
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.ok) {
      router.push(data.setupRequired ? "/admin/setup-2fa" : callbackUrl);
      router.refresh();
      return;
    }

    setError("Unable to sign in.");
    setPending(false);
  }

  async function handleVerify2fa(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      totp,
      redirect: false,
    });

    if (result?.ok) {
      router.push(callbackUrl);
      router.refresh();
      return;
    }

    setError("Invalid authentication code.");
    setPending(false);
  }

  return (
    <form
      onSubmit={needs2fa ? handleVerify2fa : handleContinue}
      className="mx-auto w-full max-w-md space-y-5 border border-charcoal/10 bg-white/50 p-8"
    >
      <div>
        <p className="font-display text-2xl text-forest">credible.</p>
        <h1 className="mt-4 font-display text-3xl">Admin login</h1>
        <p className="mt-2 text-sm text-muted">
          Sign in with email, password and two-factor authentication.
        </p>
      </div>

      <Field label="Email" id="email">
        <TextInput
          id="email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={needs2fa}
        />
      </Field>
      <Field label="Password" id="password">
        <TextInput
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={needs2fa}
        />
      </Field>

      {needs2fa ? (
        <Field label="Authentication code" id="totp">
          <TextInput
            id="totp"
            inputMode="numeric"
            autoComplete="one-time-code"
            required
            value={totp}
            onChange={(e) => setTotp(e.target.value)}
            placeholder="6-digit code"
          />
        </Field>
      ) : null}

      {error ? <p className="text-sm text-danger">{error}</p> : null}

      <Button type="submit" disabled={pending} variant="primary" className="w-full">
        {pending ? "Please wait…" : needs2fa ? "Verify and sign in" : "Continue"}
      </Button>
    </form>
  );
}
