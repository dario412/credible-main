"use client";

import { useActionState } from "react";
import { Button, Field, TextArea, TextInput } from "@/components/ui";
import { submitContact, type FormState } from "@/lib/actions/leads";

const initial: FormState = { ok: false, message: "" };

export function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, initial);

  return (
    <form action={action} className="space-y-5">
      <Field label="Name" id="name">
        <TextInput id="name" name="name" required autoComplete="name" />
      </Field>
      <Field label="Email" id="email">
        <TextInput
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
        />
      </Field>
      <Field label="Company" id="company" hint="Optional">
        <TextInput id="company" name="company" autoComplete="organization" />
      </Field>
      <Field label="Message" id="message">
        <TextArea id="message" name="message" required />
      </Field>
      <Button type="submit" disabled={pending} variant="primary">
        {pending ? "Sending…" : "Send message"}
      </Button>
      {state.message ? (
        <p
          className={`text-sm ${state.ok ? "text-success" : "text-danger"}`}
          role="status"
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
