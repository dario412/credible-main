import { ArrowUpRight } from "@phosphor-icons/react/ssr";

import { ContactVisualEditor } from "@/components/contact-visual-editor";
import {
  SendBriefForm,
  type BriefAudience,
  type BriefCreator,
} from "@/components/send-brief-form";
import {
  getContactPageSections,
  saveContactPage,
} from "@/lib/actions/admin-cms";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { createMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = createMetadata({
  title: "Send brief",
  description:
    "Brief B2B expert creators your buyers already trust. Same-day acknowledgement, shortlist within 48 hours.",
  path: "/contact",
});

const EYEBROW =
  "text-[0.7rem] font-medium tracking-[0.16em] text-charcoal/45 uppercase";
const CONTACT_CHANNELS = [
  {
    label: "Direct email",
    address: "hello@crediblecreators.com",
    body: "General enquiries and anything that doesn’t fit a box.",
  },
  {
    label: "Speaking & events",
    address: "bookings@crediblecreators.com",
    body: "Keynotes, firesides, panels and live programming.",
  },
  {
    label: "Brand partnerships",
    address: "partnerships@crediblecreators.com",
    body: "Content series, newsletters and ambassador terms.",
  },
] as const;

const SOCIALS = [
  {
    label: "LinkedIn",
    handle: "/credible-talent",
    href: "https://www.linkedin.com/",
  },
  {
    label: "Substack",
    handle: "The Credible Brief",
    href: "https://substack.com/",
  },
] as const;

type SearchParams = Promise<{
  experts?: string;
  expert?: string;
  type?: string;
}>;

function parseAudience(value?: string): BriefAudience {
  if (value === "creator" || value === "agency") return value;
  return "brand";
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const [content, session] = await Promise.all([
    getContactPageSections(),
    auth(),
  ]);
  const canEdit = Boolean(
    session?.user && hasPermission(session.user.role, "MANAGE_CONTENT"),
  );

  // Accepts ?experts=a,b from the shortlist basket and ?expert=a from profiles.
  const requested = [
    ...(params.experts?.split(",") ?? []),
    ...(params.expert ? [params.expert] : []),
  ]
    .map((slug) => slug.trim())
    .filter(Boolean);

  const roster = await prisma.expert.findMany({
    orderBy: { name: "asc" },
    select: { slug: true, name: true, image: true, categories: true },
  });

  const creators: BriefCreator[] = roster.map((expert) => ({
    slug: expert.slug,
    name: expert.name,
    image: expert.image,
    role: expert.categories[0] ?? null,
  }));

  const bySlug = new Map(creators.map((creator) => [creator.slug, creator]));
  const preselected = [...new Set(requested)].flatMap((slug) => {
    const match = bySlug.get(slug);
    return match ? [match] : [];
  });

  return (
    <div className="px-6 py-14 md:px-10 md:py-18 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-352">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-display text-[2.6rem] leading-[1.06] tracking-tight text-charcoal sm:text-[3.15rem] md:text-[3.5rem]">
            Brief the voices your buyers{" "}
            <span className="text-forest">already trust.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-[0.95rem] leading-relaxed text-charcoal/65 md:text-base">
            {preselected.length > 0
              ? `Your shortlist is loaded below. Tell us the ambition and we'll come back with availability, pricing and a scoped proposal.`
              : `In-house, agency or creator — send us the ambition. We'll come back with a named shortlist within 48 hours.`}
          </p>
        </div>

        <div className="mt-10 grid items-start gap-8 md:mt-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-12">
          <SendBriefForm
            preselected={preselected}
            roster={creators}
            initialAudience={parseAudience(params.type)}
          />

          <ContactVisualEditor
            initial={content}
            canEdit={canEdit}
            saveAction={saveContactPage}
          />
        </div>

        <section className="mt-16 border-t border-charcoal/10 pt-12 md:mt-20 md:pt-14">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CONTACT_CHANNELS.map((channel) => (
              <a
                key={channel.address}
                href={`mailto:${channel.address}`}
                className="group flex flex-col rounded-sm border border-charcoal/10 bg-[#FBF8F5] p-5 transition-colors hover:border-forest/45 md:p-6"
              >
                <span className="flex items-center justify-between gap-3">
                  <span className={EYEBROW}>{channel.label}</span>
                  <ArrowUpRight
                    weight="bold"
                    aria-hidden
                    className="size-3 shrink-0 text-charcoal/25 transition-colors group-hover:text-forest"
                  />
                </span>
                <span className="mt-4 font-display text-[1.15rem] leading-tight tracking-tight text-charcoal transition-colors group-hover:text-forest md:text-[1.25rem]">
                  {channel.address}
                </span>
                <span className="mt-2.5 text-[0.8125rem] leading-relaxed text-charcoal/55">
                  {channel.body}
                </span>
              </a>
            ))}
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <div className="rounded-sm border border-charcoal/10 p-5 md:p-6">
              <p className={EYEBROW}>London office</p>
              <p className="mt-4 font-display text-[1.15rem] leading-snug tracking-tight text-charcoal">
                Credible Talent Ltd
              </p>
              <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-charcoal/55">
                Somers Town, London NW1
              </p>
            </div>

            <div className="rounded-sm border border-charcoal/10 p-5 md:p-6">
              <p className={EYEBROW}>By phone</p>
              <a
                href="tel:+442079460018"
                className="mt-4 inline-block font-display text-[1.15rem] leading-snug tracking-tight text-charcoal transition-colors hover:text-forest"
              >
                +44 20 7946 0018
              </a>
              <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-charcoal/55">
                Weekdays, 9am–6pm GMT
              </p>
            </div>

            <div className="rounded-sm border border-charcoal/10 p-5 md:p-6">
              <p className={EYEBROW}>Follow along</p>
              <ul className="mt-4 space-y-2">
                {SOCIALS.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between gap-3 rounded-sm border border-charcoal/12 px-3.5 py-2.5 transition-colors hover:border-charcoal hover:bg-charcoal"
                    >
                      <span className="text-[0.8125rem] font-medium text-charcoal transition-colors group-hover:text-cream">
                        {social.label}
                      </span>
                      <span className="text-[0.6875rem] text-charcoal/40 transition-colors group-hover:text-cream/70">
                        {social.handle}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
