"use client";

import { useState, useTransition } from "react";
import { Button, Field, TextInput } from "@/components/ui";
import { createUser } from "@/lib/actions/admin-users";

export function CreateUserForm() {
  const [message, setMessage] = useState("");
  const [ok, setOk] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => {
        startTransition(async () => {
          const result = await createUser(formData);
          setOk(result.ok);
          setMessage(result.message);
          if (result.ok) {
            (document.getElementById("create-user-form") as HTMLFormElement | null)?.reset();
          }
        });
      }}
      id="create-user-form"
      className="space-y-4"
    >
      <Field label="Name" id="name">
        <TextInput id="name" name="name" required />
      </Field>
      <Field label="Email" id="email">
        <TextInput id="email" name="email" type="email" required />
      </Field>
      <Field label="Temporary password" id="password">
        <TextInput id="password" name="password" type="password" required minLength={6} />
      </Field>
      <Field label="Role" id="role">
        <select
          id="role"
          name="role"
          className="w-full border border-charcoal/30 bg-white px-4 py-3 text-sm"
          defaultValue="VIEWER"
        >
          <option value="VIEWER">Viewer — view leads</option>
          <option value="EDITOR">Editor — view leads (+ content later)</option>
          <option value="OWNER">Owner — full access</option>
        </select>
      </Field>
      {message ? (
        <p className={`text-sm ${ok ? "text-success" : "text-danger"}`}>{message}</p>
      ) : null}
      <Button type="submit" disabled={pending} variant="primary">
        {pending ? "Creating…" : "Create user"}
      </Button>
    </form>
  );
}
