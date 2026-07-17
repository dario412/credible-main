"use client";

import { useActionState } from "react";
import { submitWaitlist, type FormState } from "@/lib/actions/leads";

const initial: FormState = { ok: false, message: "" };

export function WaitlistForm() {
  const [state, action, pending] = useActionState(submitWaitlist, initial);

  return (
    <form action={action} className="w-full max-w-[520px]">
      <div className="flex w-full flex-col border-none sm:flex-row sm:border sm:border-forest">
        <label htmlFor="waitlist-email" className="sr-only">
          Email
        </label>
        <input
          id="waitlist-email"
          name="email"
          type="email"
          required
          placeholder="Type your email"
          className="min-h-12 w-full flex-1 border border-forest bg-cream px-4 py-3 text-base text-charcoal outline-none placeholder:text-charcoal/45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-forest sm:min-h-0 sm:border-0 sm:bg-transparent"
        />
        <button
          type="submit"
          disabled={pending}
          className="min-h-12 shrink-0 bg-forest px-5 py-3 text-base text-cream transition-colors hover:bg-forest-dark disabled:opacity-75 sm:min-h-0"
        >
          {pending ? "Joining…" : "Join the waitlist"}
        </button>
      </div>
      {state.message ? (
        <p
          className={`mt-3 text-[0.95rem] leading-snug ${state.ok ? "text-forest" : "text-danger"}`}
          role="status"
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
