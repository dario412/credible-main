"use client";

import {
  ChatsCircle,
  Handshake,
  Headphones,
  Medal,
  MicrophoneStage,
  Ticket,
} from "@phosphor-icons/react";

import { FadeUp } from "@/components/fade-up";
import type { ExpertFormatOffering } from "@/lib/expert-profiles";

function FormatIcon({ format }: { format: ExpertFormatOffering }) {
  const key = `${format.category} ${format.title}`.toLowerCase();
  const className = "size-7";

  if (key.includes("ambassador")) {
    return <Medal weight="bold" className={className} aria-hidden />;
  }
  if (key.includes("brand") || key.includes("partnership")) {
    return <Handshake weight="bold" className={className} aria-hidden />;
  }
  if (key.includes("live") || key.includes("event")) {
    return <Ticket weight="bold" className={className} aria-hidden />;
  }
  if (key.includes("fireside")) {
    return <ChatsCircle weight="bold" className={className} aria-hidden />;
  }
  if (key.includes("podcast") || key.includes("newsletter")) {
    return <Headphones weight="bold" className={className} aria-hidden />;
  }
  return <MicrophoneStage weight="bold" className={className} aria-hidden />;
}

export function ExpertFormatsGrid({
  formats,
}: {
  formats: ExpertFormatOffering[];
}) {
  return (
    <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:gap-5">
      {formats.map((format, index) => (
        <li
          key={`${format.category}-${format.title}`}
          className="h-full"
        >
          <FadeUp
            delay={index * 160}
            duration={1200}
            y={24}
            threshold={0.2}
            className="h-full"
          >
            <div className="flex h-full flex-col rounded-sm bg-[#FBF8F5] p-5 md:p-6">
              <div className="flex items-start justify-between gap-4">
                <span className="text-forest">
                  <FormatIcon format={format} />
                </span>
                <p className="text-[0.65rem] font-medium tracking-[0.14em] text-charcoal/45 uppercase">
                  {format.category}
                </p>
              </div>

              <h3 className="mt-5 font-display text-[1.35rem] leading-snug tracking-tight text-charcoal">
                {format.title}
              </h3>
              <p className="mt-3 flex-1 text-[0.875rem] leading-relaxed text-charcoal/60">
                {format.description}
              </p>

              <div className="mt-6 border-t border-charcoal/10 pt-4">
                <p className="text-[0.65rem] font-medium tracking-[0.12em] text-charcoal/45 uppercase">
                  Investment
                </p>
                <p className="mt-1.5 text-[1.2rem] font-medium tracking-tight text-charcoal md:text-[1.3rem]">
                  {format.pricing}
                </p>
              </div>
            </div>
          </FadeUp>
        </li>
      ))}
    </ul>
  );
}
