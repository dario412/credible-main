"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState, useTransition } from "react";
import { Button, Field, TextInput } from "@/components/ui";
import { enableTotp } from "@/lib/actions/totp";

export function Setup2faForm() {
  const router = useRouter();
  const { update } = useSession();
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => {
        startTransition(async () => {
          const result = await enableTotp(formData);
          if (!result.ok) {
            setMessage(result.message);
            return;
          }
          await update({ totpEnabled: true });
          router.push("/admin");
          router.refresh();
        });
      }}
      className="space-y-4"
    >
      <Field label="Authentication code" id="code">
        <TextInput
          id="code"
          name="code"
          inputMode="numeric"
          autoComplete="one-time-code"
          required
          placeholder="6-digit code"
        />
      </Field>
      {message ? <p className="text-sm text-danger">{message}</p> : null}
      <Button type="submit" disabled={pending} variant="primary">
        {pending ? "Verifying…" : "Enable 2FA"}
      </Button>
    </form>
  );
}
