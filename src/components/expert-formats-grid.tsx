"use client";

import {
  Handshake,
  Medal,
  MicrophoneStage,
  Ticket,
} from "@phosphor-icons/react";

import { FadeUp } from "@/components/fade-up";
import { ProfileEditHit } from "@/components/use-profile-edit-hit";
import { useSiteChrome } from "@/components/site-chrome-context";
import {
  firstName,
  resolveFormatKind,
  type ExpertFormatOffering,
} from "@/lib/expert-profiles";
import {
  applyProfileRailTemplate,
  type ProfileFormatKind,
} from "@/lib/site-chrome";

function FormatIcon({ kind }: { kind: ProfileFormatKind | null }) {
  const className = "size-5";

  if (kind === "ambassador") {
    return <Medal weight="bold" className={className} aria-hidden />;
  }
  if (kind === "brandPartnerships") {
    return <Handshake weight="bold" className={className} aria-hidden />;
  }
  if (kind === "liveEvents") {
    return <Ticket weight="bold" className={className} aria-hidden />;
  }
  return <MicrophoneStage weight="bold" className={className} aria-hidden />;
}

function FormatPills({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li
          key={item}
          className="rounded-full bg-charcoal/6 px-3 py-1.5 text-[0.8125rem] leading-none text-charcoal/80"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

function FormatsPanel({ format }: { format: ExpertFormatOffering }) {
  const hasChannels = Boolean(format.channels?.length);
  const flatFormats = format.formats ?? [];

  return (
    <div className="min-w-0">
      <p className="text-[0.65rem] font-medium tracking-[0.14em] text-charcoal/40 uppercase">
        {hasChannels ? "Channels & formats" : "Formats"}
      </p>

      {hasChannels ? (
        <ul className="mt-5 divide-y divide-charcoal/10">
          {format.channels!.map((row) => (
            <li
              key={row.channel}
              className="grid grid-cols-1 gap-3 py-4 first:pt-0 last:pb-0 sm:grid-cols-[6.75rem_minmax(0,1fr)] sm:items-start sm:gap-0"
            >
              <p className="pt-1 text-[0.9375rem] font-medium tracking-tight text-charcoal sm:pr-5">
                {row.channel}
              </p>
              <div className="min-w-0 sm:border-l sm:border-charcoal/10 sm:pl-5">
                <FormatPills items={row.formats} />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-5">
          <FormatPills items={flatFormats} />
        </div>
      )}
    </div>
  );
}

export function ExpertFormatsGrid({
  formats,
  name,
}: {
  formats: ExpertFormatOffering[];
  name: string;
}) {
  const { chrome } = useSiteChrome();
  const vars = { first: firstName(name), name };

  return (
    <ul className="mt-8 flex flex-col gap-4 md:gap-5">
      {formats.map((format, index) => {
        const kind = resolveFormatKind(format);
        const copy =
          kind != null
            ? chrome.profileFormats[kind]
            : { title: format.title, description: format.description };
        const title = applyProfileRailTemplate(copy.title, vars);
        const description = applyProfileRailTemplate(copy.description, vars);

        return (
          <li key={kind ?? `${format.category}-${format.title}`}>
            <FadeUp delay={index * 120} duration={1100} y={20} threshold={0.15}>
              <article className="rounded-sm bg-[#FBF8F5] p-5 md:p-7 lg:p-8">
                <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.25fr)] lg:gap-0">
                  <ProfileEditHit
                    field={
                      kind
                        ? `profileFormats.${kind}`
                        : "profileFormats.brandPartnerships"
                    }
                    label={`${title} copy`}
                    block
                  >
                    <div className="flex flex-col lg:pr-10 xl:pr-12">
                      <span className="flex size-10 items-center justify-center rounded-md border border-charcoal/10 bg-cream/60 text-forest">
                        <FormatIcon kind={kind} />
                      </span>

                      <h3 className="mt-6 text-[1.35rem] font-medium tracking-tight text-charcoal md:text-[1.5rem]">
                        {title}
                      </h3>
                      <p className="mt-3 max-w-md text-[0.9rem] leading-relaxed text-charcoal/55">
                        {description}
                      </p>
                    </div>
                  </ProfileEditHit>

                  <div className="border-t border-charcoal/10 pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10 xl:pl-12">
                    <FormatsPanel format={format} />
                  </div>
                </div>
              </article>
            </FadeUp>
          </li>
        );
      })}
    </ul>
  );
}
