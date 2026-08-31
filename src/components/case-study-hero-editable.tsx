"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { EditableHit } from "@/components/editable-hit";
import { ImageAltEditorPopover } from "@/components/image-alt-editor-popover";
import { PageContentEditBar } from "@/components/page-content-edit-bar";
import { SiteImage } from "@/components/site-image";
import {
  caseStudyLogoNeedsInvert,
  resolveCaseStudyClientLogo,
} from "@/lib/brand-logos";
import {
  caseStudyHero,
  type CaseStudyCard,
} from "@/lib/case-studies";
import type { CaseStudyBlock } from "@/lib/case-study-content";
import { coverAltFor, logoAltFor, resolveImageAlt } from "@/lib/image-alt";
import { cn } from "@/lib/utils";

type EditTarget = "cover" | "logo";

export function CaseStudyHeroEditable({
  initial,
  blocks,
  canEdit,
  saveAction,
}: {
  initial: CaseStudyCard;
  blocks: CaseStudyBlock[];
  canEdit: boolean;
  saveAction: typeof import("@/lib/actions/admin-cms").saveCaseStudy;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [card, setCard] = useState(initial);
  const [baseline, setBaseline] = useState(initial);
  const [target, setTarget] = useState<EditTarget | null>(null);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [ok, setOk] = useState(false);

  const dirty = JSON.stringify(card) !== JSON.stringify(baseline);
  const hero = caseStudyHero(card);
  const logo = resolveCaseStudyClientLogo(card.client, card.logo, {
    tone: "dark",
  });
  const invertLogo = caseStudyLogoNeedsInvert(logo);
  const active = editing && canEdit;

  useEffect(() => {
    setCard(initial);
    setBaseline(initial);
  }, [initial]);

  async function save() {
    setPending(true);
    const result = await saveAction(
      { ...card, blocks },
      { previousSlug: baseline.slug },
    );
    setOk(result.ok);
    setMessage(result.ok ? "Project saved." : result.message);
    setPending(false);
    if (result.ok) {
      setBaseline(card);
      setTarget(null);
      router.refresh();
    }
  }

  function discard() {
    setCard(baseline);
    setTarget(null);
    setMessage("");
  }

  return (
    <>
      <section className="relative isolate min-h-[min(92vh,52rem)] w-full -mt-[7.25rem] overflow-hidden md:min-h-[min(94vh,56rem)] md:-mt-[5.5rem]">
        <EditableHit
          active={active}
          selected={target === "cover"}
          onSelect={() => setTarget("cover")}
          label="Hero cover image"
          block
          ringOffset="ring-offset-charcoal"
          className="absolute inset-0"
        >
          <SiteImage
            src={card.coverImage}
            alt={resolveImageAlt(card.coverImageAlt, coverAltFor(card.title))}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </EditableHit>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-linear-to-t from-charcoal via-charcoal/78 to-charcoal/55"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-linear-to-b from-charcoal/75 via-charcoal/35 to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[55%] backdrop-blur-[8px]"
          style={{
            maskImage:
              "linear-gradient(to bottom, black 0%, black 35%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0%, black 35%, transparent 100%)",
          }}
        />

        <div className="relative flex min-h-[min(92vh,52rem)] flex-col px-6 pt-36 pb-12 md:min-h-[min(94vh,56rem)] md:px-10 md:pb-14 lg:px-12 lg:pb-16">
          <div className="mx-auto flex w-full max-w-352 flex-1 flex-col justify-between">
            <div>
              <EditableHit
                active={active}
                selected={target === "logo"}
                onSelect={() => setTarget("logo")}
                label="Client logo"
                ringOffset="ring-offset-charcoal"
              >
                <SiteImage
                  src={logo}
                  alt={resolveImageAlt(card.logoAlt, logoAltFor(card.client))}
                  width={96}
                  height={96}
                  className={cn(
                    "size-16 object-contain md:size-20",
                    invertLogo && "brightness-0 invert",
                  )}
                  priority
                />
              </EditableHit>

              <h1 className="mt-8 max-w-[18ch] font-display text-[2.4rem] leading-[1.08] tracking-tight text-cream sm:text-[3rem] md:mt-10 md:text-[3.5rem] lg:text-[4rem]">
                {hero.titleEmphasis ? (
                  <>
                    {hero.title}{" "}
                    <em className="font-display italic">
                      {hero.titleEmphasis}
                    </em>
                  </>
                ) : (
                  hero.title
                )}
              </h1>

              <p className="mt-6 max-w-2xl text-[1.05rem] leading-relaxed text-cream/75 md:mt-7 md:text-[1.125rem]">
                {hero.summary}
              </p>
            </div>

            <div className="mt-14 border-t border-cream/15 pt-8 md:mt-16 md:pt-9">
              <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between sm:gap-12">
                <div className="min-w-0">
                  <p className="text-[0.65rem] font-medium tracking-[0.18em] text-cream/45 uppercase">
                    Client
                  </p>
                  <p className="mt-2.5 font-display text-[1.65rem] leading-none tracking-tight text-cream sm:text-[1.85rem] md:text-[2.05rem]">
                    {hero.client}
                  </p>
                </div>

                {hero.pillars.length > 0 ? (
                  <div className="min-w-0 sm:text-right">
                    <p className="text-[0.65rem] font-medium tracking-[0.18em] text-cream/45 uppercase">
                      Pillars
                    </p>
                    <ul className="mt-3 flex flex-wrap items-center gap-x-0 gap-y-2 sm:justify-end">
                      {hero.pillars.map((pillar, index) => (
                        <li
                          key={pillar}
                          className="flex items-center text-[0.9375rem] leading-none text-cream/90 md:text-[1rem]"
                        >
                          {index > 0 ? (
                            <span
                              aria-hidden
                              className="mx-3 h-3.5 w-px bg-cream/25 sm:mx-3.5"
                            />
                          ) : null}
                          <span>{pillar}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      <PageContentEditBar
        canEdit={canEdit}
        editing={editing}
        onToggleEditing={() => {
          setEditing((value) => !value);
          setTarget(null);
          setMessage("");
        }}
        dirty={dirty}
        pending={pending}
        onSave={() => void save()}
        onDiscard={discard}
        adminHref={`/admin/case-studies/${card.slug}`}
        message={message}
        ok={ok}
      />

      {active && target === "cover" ? (
        <ImageAltEditorPopover
          title="Hero cover image"
          imageLabel="Cover image"
          imageValue={card.coverImage ?? ""}
          altValue={card.coverImageAlt ?? ""}
          suggestedAlt={coverAltFor(card.title)}
          onImageChange={(coverImage) =>
            setCard({ ...card, coverImage: coverImage || card.coverImage })
          }
          onAltChange={(coverImageAlt) =>
            setCard({
              ...card,
              coverImageAlt: coverImageAlt.trim() || undefined,
            })
          }
          onClose={() => setTarget(null)}
        />
      ) : null}

      {active && target === "logo" ? (
        <ImageAltEditorPopover
          title="Client logo"
          imageLabel="Logo image"
          imageValue={card.logo ?? ""}
          altValue={card.logoAlt ?? ""}
          suggestedAlt={logoAltFor(card.client)}
          onImageChange={(logoUrl) =>
            setCard({ ...card, logo: logoUrl || undefined })
          }
          onAltChange={(logoAlt) =>
            setCard({ ...card, logoAlt: logoAlt.trim() || undefined })
          }
          onClose={() => setTarget(null)}
        />
      ) : null}
    </>
  );
}
