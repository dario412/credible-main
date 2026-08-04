"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { MediaField } from "@/components/media-library";
import { Button, Field, TextArea, TextInput } from "@/components/ui";
import {
  TRUSTED_BY_LOGO_HINT,
  emptyTrustedByTestimonial,
  type TrustedByClient,
} from "@/lib/trusted-by";

export function AdminTrustedByEditor({
  initial,
  saveAction,
  deleteAction,
}: {
  initial: TrustedByClient;
  saveAction: typeof import("@/lib/actions/admin-trusted-by").saveTrustedClient;
  deleteAction?: typeof import("@/lib/actions/admin-trusted-by").deleteTrustedClient;
}) {
  const router = useRouter();
  const [client, setClient] = useState(initial);
  const [message, setMessage] = useState("");
  const [ok, setOk] = useState(false);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    const result = await saveAction(client);
    setOk(result.ok);
    setMessage(result.message);
    setPending(false);
    if (result.ok) {
      router.push("/admin/trusted-by");
      router.refresh();
    }
  }

  async function onDelete() {
    if (!client.id || !deleteAction) return;
    if (!window.confirm(`Remove ${client.name || "this client"}?`)) return;
    setPending(true);
    const result = await deleteAction(client.id);
    setOk(result.ok);
    setMessage(result.message);
    setPending(false);
    if (result.ok) {
      router.push("/admin/trusted-by");
      router.refresh();
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <p className="text-sm text-charcoal/55">{TRUSTED_BY_LOGO_HINT}</p>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Client name" id="name">
          <TextInput
            id="name"
            value={client.name}
            onChange={(e) => setClient({ ...client, name: e.target.value })}
            required
          />
        </Field>
        <MediaField
          label="Logo"
          hint={TRUSTED_BY_LOGO_HINT}
          value={client.logoSrc}
          onChange={(logoSrc) => setClient({ ...client, logoSrc })}
        />
      </div>

      <Field
        label="Case study slug (optional)"
        id="slug"
        hint="Powers the Customer story link"
      >
        <TextInput
          id="slug"
          value={client.caseStudySlug}
          onChange={(e) =>
            setClient({ ...client, caseStudySlug: e.target.value })
          }
        />
      </Field>

      <div className="flex items-center justify-between gap-3 border-t border-charcoal/10 pt-4">
        <div>
          <p className="text-sm font-medium text-charcoal">Customer story hover</p>
          <p className="mt-0.5 text-xs text-charcoal/50">
            Leave empty for logo-only cells.
          </p>
        </div>
        <Button
          type="button"
          variant={client.testimonial ? "secondary" : "primary"}
          className="px-3! py-1.5! text-xs"
          onClick={() =>
            setClient({
              ...client,
              testimonial: client.testimonial
                ? null
                : emptyTrustedByTestimonial(),
            })
          }
        >
          {client.testimonial ? "Remove story" : "Add story"}
        </Button>
      </div>

      {client.testimonial ? (
        <div className="space-y-4 rounded-sm border border-charcoal/10 p-4">
          <Field label="Testimonial" id="quote">
            <TextArea
              id="quote"
              rows={4}
              value={client.testimonial.quote}
              onChange={(e) =>
                setClient({
                  ...client,
                  testimonial: {
                    ...client.testimonial!,
                    quote: e.target.value,
                  },
                })
              }
            />
          </Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Person name" id="person">
              <TextInput
                id="person"
                value={client.testimonial.name}
                onChange={(e) =>
                  setClient({
                    ...client,
                    testimonial: {
                      ...client.testimonial!,
                      name: e.target.value,
                    },
                  })
                }
              />
            </Field>
            <Field label="Position / title" id="title">
              <TextInput
                id="title"
                value={client.testimonial.title}
                onChange={(e) =>
                  setClient({
                    ...client,
                    testimonial: {
                      ...client.testimonial!,
                      title: e.target.value,
                    },
                  })
                }
              />
            </Field>
          </div>
          <MediaField
            label="Person photo"
            hint="Square photo works best"
            value={client.testimonial.imageSrc}
            onChange={(imageSrc) =>
              setClient({
                ...client,
                testimonial: {
                  ...client.testimonial!,
                  imageSrc,
                },
              })
            }
          />
        </div>
      ) : null}

      <div className="sticky bottom-4 z-10 flex flex-wrap items-center gap-3 rounded-sm border border-charcoal/10 bg-white/95 px-4 py-3 shadow-[0_10px_30px_rgba(28,26,23,0.08)] backdrop-blur">
        <Button type="submit" variant="primary" disabled={pending}>
          {pending ? "Saving…" : "Save client"}
        </Button>
        {client.id && deleteAction ? (
          <Button
            type="button"
            variant="ghost"
            disabled={pending}
            onClick={() => void onDelete()}
          >
            Delete
          </Button>
        ) : null}
        <a
          href="/admin/trusted-by"
          className="text-sm font-medium text-charcoal/60 hover:text-charcoal"
        >
          Back to list
        </a>
        {message ? (
          <p className={`text-sm ${ok ? "text-success" : "text-danger"}`}>
            {message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
