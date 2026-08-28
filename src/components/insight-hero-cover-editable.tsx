"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { EditableHit } from "@/components/editable-hit";
import { ImageAltEditorPopover } from "@/components/image-alt-editor-popover";
import { PageContentEditBar } from "@/components/page-content-edit-bar";
import { SiteImage } from "@/components/site-image";
import {
  insightCover,
  insightCoverAlt,
  type InsightBlock,
} from "@/lib/insight-content";
import { coverAltFor } from "@/lib/image-alt";

type InsightMeta = {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  coverImage: string;
  coverImageAlt: string;
  seoTitle: string;
  seoDescription: string;
  publishedAt: string;
};

export function InsightHeroCoverEditable({
  insightId,
  insightSlug,
  title,
  cover,
  initialMeta,
  initialBlocks,
  canEdit,
  saveAction,
}: {
  insightId: string;
  insightSlug: string;
  title: string;
  cover: string | null;
  initialMeta: InsightMeta;
  initialBlocks: InsightBlock[];
  canEdit: boolean;
  saveAction: typeof import("@/lib/actions/admin-cms").saveInsight;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [meta, setMeta] = useState(initialMeta);
  const [baseline, setBaseline] = useState(initialMeta);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [ok, setOk] = useState(false);

  const dirty = JSON.stringify(meta) !== JSON.stringify(baseline);
  const active = editing && canEdit;
  const displayCover = insightCover({
    slug: insightSlug,
    coverImage: meta.coverImage?.trim() || cover,
  });

  useEffect(() => {
    setMeta(initialMeta);
    setBaseline(initialMeta);
  }, [initialMeta]);

  async function save() {
    setPending(true);
    const result = await saveAction({
      id: insightId,
      meta,
      blocks: initialBlocks,
    });
    setOk(result.ok);
    setMessage(result.ok ? "Insight saved." : result.message);
    setPending(false);
    if (result.ok) {
      setBaseline(meta);
      setPopoverOpen(false);
      router.refresh();
    }
  }

  function discard() {
    setMeta(baseline);
    setPopoverOpen(false);
    setMessage("");
  }

  return (
    <>
      <EditableHit
        active={active}
        selected={popoverOpen}
        onSelect={() => setPopoverOpen(true)}
        label="Cover image"
        block
      >
        <div className="relative aspect-16/10 w-full overflow-hidden rounded-sm bg-forest/10 lg:aspect-auto lg:min-h-112">
            {displayCover ? (
              <SiteImage
                src={displayCover}
                alt={insightCoverAlt({
                  title: meta.title || title,
                  coverImageAlt: meta.coverImageAlt,
                })}
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            ) : (
              <span
                aria-hidden
                className="absolute inset-0 flex items-center justify-center font-display text-7xl text-charcoal/15"
              >
                {(meta.title || title).charAt(0)}
              </span>
            )}
          </div>
        </EditableHit>

      <PageContentEditBar
        canEdit={canEdit}
        editing={editing}
        onToggleEditing={() => {
          setEditing((value) => !value);
          setPopoverOpen(false);
          setMessage("");
        }}
        dirty={dirty}
        pending={pending}
        onSave={() => void save()}
        onDiscard={discard}
        adminHref={`/admin/insights/${insightSlug}`}
        message={message}
        ok={ok}
      />

      {active && popoverOpen ? (
        <ImageAltEditorPopover
          title="Cover image"
          imageLabel="Cover image"
          imageValue={meta.coverImage ?? ""}
          altValue={meta.coverImageAlt ?? ""}
          suggestedAlt={coverAltFor(meta.title || title)}
          onImageChange={(coverImage) => setMeta({ ...meta, coverImage })}
          onAltChange={(coverImageAlt) =>
            setMeta({ ...meta, coverImageAlt })
          }
          onClose={() => setPopoverOpen(false)}
        />
      ) : null}
    </>
  );
}
