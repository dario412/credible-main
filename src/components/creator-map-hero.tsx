"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type CreatorPin = {
  id: string;
  name: string;
  title: string;
  slug: string;
  prompt: string;
  x: number;
  y: number;
};

type PromptPlacement = "above" | "below";

/** Real roster slugs — every card opens a single expert page */
const ROSTER_SLUGS = [
  "amara-chen",
  "james-okafor",
  "sofia-martinez",
  "noah-bennett",
  "lena-weiss",
  "daniel-park",
] as const;

const CREATORS: CreatorPin[] = [
  { id: "1", name: "Amara Chen", title: "Founder & Keynote", prompt: "How do you brief a founder for stage?", x: 80, y: 40 },
  { id: "2", name: "James Okafor", title: "Motivational Speaker", prompt: "What makes a keynote convert?", x: 440, y: 0 },
  { id: "3", name: "Sofia Martinez", title: "Brand Strategist", prompt: "How do brand partnerships stay credible?", x: 800, y: 70 },
  { id: "4", name: "Noah Bennett", title: "Executive Operator", prompt: "When should a COO take the stage?", x: 1160, y: 15 },
  { id: "5", name: "Lena Weiss", title: "Media Host", prompt: "What makes a moderator worth booking?", x: 1520, y: 85 },
  { id: "6", name: "Daniel Park", title: "Innovation Keynote", prompt: "How do you talk AI without the hype?", x: 1880, y: 30 },
  { id: "7", name: "Maya Okonkwo", title: "Growth Advisor", prompt: "Can creators actually drive pipeline?", x: 2240, y: 75 },
  { id: "8", name: "Theo Astrid", title: "Venture Partner", prompt: "What do investors want from a briefing?", x: 2600, y: 10 },
  { id: "9", name: "Priya Nair", title: "Product Operator", prompt: "How do operators sound on LinkedIn?", x: 2960, y: 60 },
  { id: "10", name: "Omar Hassan", title: "Stage Moderator", prompt: "What ruins a panel — and how do you fix it?", x: 160, y: 380 },
  { id: "11", name: "Clara Vries", title: "Culture Speaker", prompt: "How do you brief culture without fluff?", x: 520, y: 350 },
  { id: "12", name: "Ethan Brooks", title: "B2B Storyteller", prompt: "What story closes an enterprise room?", x: 880, y: 410 },
  { id: "13", name: "Nina Solberg", title: "Investor Voice", prompt: "Why do buyers trust investor voices?", x: 1240, y: 360 },
  { id: "14", name: "Kai Nakamura", title: "Founder Coach", prompt: "When is a founder the right face?", x: 1600, y: 420 },
  { id: "15", name: "Isla Rowe", title: "Events Host", prompt: "How do you hold a 500-person room?", x: 1960, y: 365 },
  { id: "16", name: "Marcus Hale", title: "Sales Leader", prompt: "Can sales leaders be content engines?", x: 2320, y: 400 },
  { id: "17", name: "Aisha Rahman", title: "Policy Advisor", prompt: "How do specialists earn attention?", x: 2680, y: 355 },
  { id: "18", name: "Jonas Klein", title: "Tech Operator", prompt: "What should a tech briefing sound like?", x: 3040, y: 415 },
  { id: "19", name: "Elena Costa", title: "Brand Creator", prompt: "Where does authenticity start?", x: 60, y: 720 },
  { id: "20", name: "Felix Andersson", title: "Keynote Talent", prompt: "What does a perfect brief look like?", x: 420, y: 690 },
  { id: "21", name: "Harper Quinn", title: "Founder", prompt: "How do you scale a founder’s voice?", x: 780, y: 750 },
  { id: "22", name: "Ravi Mehta", title: "Operator", prompt: "Why book operators, not celebrities?", x: 1140, y: 700 },
  { id: "23", name: "Zoe Laurent", title: "Speaker", prompt: "What changes after the keynote?", x: 1500, y: 760 },
  { id: "24", name: "Benito Cruz", title: "Investor", prompt: "How do investors become creators?", x: 1860, y: 695 },
  { id: "25", name: "Freya Holm", title: "Specialist", prompt: "What makes a specialist bookable?", x: 2220, y: 740 },
  { id: "26", name: "Luca Romano", title: "Host", prompt: "How do podcasts turn into campaigns?", x: 2580, y: 690 },
  { id: "27", name: "Yara Haddad", title: "Creator", prompt: "Can LinkedIn content land deals?", x: 2940, y: 750 },
  { id: "28", name: "Sam Okeke", title: "Advisor", prompt: "When is advisory the better booking?", x: 220, y: 1060 },
  { id: "29", name: "Ines Dupont", title: "Trusted Voice", prompt: "What does earned trust sound like?", x: 580, y: 1030 },
  { id: "30", name: "Owen Blake", title: "Speaker", prompt: "How do you measure stage ROI?", x: 940, y: 1090 },
  { id: "31", name: "Nadia Petrov", title: "Founder", prompt: "Why do buyers follow founders?", x: 1300, y: 1040 },
  { id: "32", name: "Chris Lang", title: "Operator", prompt: "What brief converts an operator?", x: 1660, y: 1100 },
  { id: "33", name: "Mei Lin", title: "Keynote", prompt: "How do you keep a talk sharp?", x: 2020, y: 1035 },
  { id: "34", name: "Adrian Foss", title: "Strategist", prompt: "Where does strategy meet stage?", x: 2380, y: 1085 },
  { id: "35", name: "Tara Singh", title: "Creator", prompt: "What content actually moves brands?", x: 2740, y: 1030 },
  { id: "36", name: "Hugo Berg", title: "Host", prompt: "How do you cast a conversation?", x: 3100, y: 1075 },
].map((c, i) => ({
  ...c,
  slug: ROSTER_SLUGS[i % ROSTER_SLUGS.length],
}));

const MAP_WIDTH = 3400;
const MAP_HEIGHT = 1500;

export function CreatorMapHero() {
  const router = useRouter();
  const viewportRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [promptPlacement, setPromptPlacement] = useState<PromptPlacement>("above");
  const dragRef = useRef({
    active: false,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
    moved: false,
  });
  const velocityRef = useRef({ x: 0, y: 0 });
  const lastPointRef = useRef({ x: 0, y: 0, t: 0 });
  const rafRef = useRef<number>(0);
  const idleRafRef = useRef<number>(0);
  const offsetRef = useRef(offset);
  const hoveredIdRef = useRef<string | null>(null);
  const draggingRef = useRef(false);
  offsetRef.current = offset;
  hoveredIdRef.current = hoveredId;
  draggingRef.current = dragging;

  const clampOffset = useCallback((x: number, y: number) => {
    const viewport = viewportRef.current;
    if (!viewport) return { x, y };
    const minX = Math.min(0, viewport.clientWidth - MAP_WIDTH);
    const minY = Math.min(0, viewport.clientHeight - MAP_HEIGHT);
    return {
      x: Math.min(0, Math.max(minX, x)),
      y: Math.min(0, Math.max(minY, y)),
    };
  }, []);

  useEffect(() => {
    const center = () => {
      const viewport = viewportRef.current;
      if (!viewport) return;
      setOffset(
        clampOffset(
          (viewport.clientWidth - MAP_WIDTH) / 2,
          (viewport.clientHeight - MAP_HEIGHT) / 2 + 20,
        ),
      );
    };
    center();
    window.addEventListener("resize", center);
    return () => window.removeEventListener("resize", center);
  }, [clampOffset]);

  const stopInertia = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  const startInertia = useCallback(() => {
    stopInertia();
    const tick = () => {
      const speed = Math.hypot(velocityRef.current.x, velocityRef.current.y);
      if (speed < 0.2) {
        velocityRef.current = { x: 0, y: 0 };
        return;
      }
      velocityRef.current.x *= 0.92;
      velocityRef.current.y *= 0.92;
      setOffset(
        clampOffset(
          offsetRef.current.x + velocityRef.current.x,
          offsetRef.current.y + velocityRef.current.y,
        ),
      );
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [clampOffset, stopInertia]);

  useEffect(() => () => stopInertia(), [stopInertia]);

  // Slow diagonal idle drift — pauses on hover/drag, then continues from here
  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    let dirX = 1;
    let dirY = 1;
    let last = performance.now();

    const tick = (now: number) => {
      idleRafRef.current = requestAnimationFrame(tick);

      if (
        draggingRef.current ||
        dragRef.current.active ||
        hoveredIdRef.current !== null ||
        document.hidden
      ) {
        last = now;
        return;
      }

      // Wait until post-drag inertia has fully settled
      if (Math.hypot(velocityRef.current.x, velocityRef.current.y) > 0.05) {
        last = now;
        return;
      }

      const dt = Math.min(40, now - last);
      last = now;
      // Gentle diagonal drift (~9px/s X, ~7px/s Y)
      const speedX = 0.015 * dt;
      const speedY = 0.012 * dt;

      const viewport = viewportRef.current;
      if (!viewport) return;

      const minX = Math.min(0, viewport.clientWidth - MAP_WIDTH);
      const minY = Math.min(0, viewport.clientHeight - MAP_HEIGHT);
      const cur = offsetRef.current;

      let nextX = cur.x - dirX * speedX;
      let nextY = cur.y - dirY * speedY;

      if (nextX <= minX) {
        nextX = minX;
        dirX = -1;
      } else if (nextX >= 0) {
        nextX = 0;
        dirX = 1;
      }

      if (nextY <= minY) {
        nextY = minY;
        dirY = -1;
      } else if (nextY >= 0) {
        nextY = 0;
        dirY = 1;
      }

      setOffset({ x: nextX, y: nextY });
    };

    idleRafRef.current = requestAnimationFrame(tick);
    return () => {
      if (idleRafRef.current) cancelAnimationFrame(idleRafRef.current);
    };
  }, []);

  const resolvePromptPlacement = (cardEl: HTMLElement): PromptPlacement => {
    const viewport = viewportRef.current;
    if (!viewport) return "above";
    const cardRect = cardEl.getBoundingClientRect();
    const viewRect = viewport.getBoundingClientRect();
    const cardMidY = cardRect.top + cardRect.height / 2;
    const viewMidY = viewRect.top + viewRect.height / 2;
    // Top half of visible map → prompt below; bottom half → prompt above
    return cardMidY < viewMidY ? "below" : "above";
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    stopInertia();
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      originX: offsetRef.current.x,
      originY: offsetRef.current.y,
      moved: false,
    };
    lastPointRef.current = { x: e.clientX, y: e.clientY, t: performance.now() };
    velocityRef.current = { x: 0, y: 0 };
    setDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    if (Math.hypot(dx, dy) > 5) {
      dragRef.current.moved = true;
      setHoveredId(null);
    }

    const now = performance.now();
    const dt = Math.max(1, now - lastPointRef.current.t);
    velocityRef.current = {
      x: ((e.clientX - lastPointRef.current.x) / dt) * 16,
      y: ((e.clientY - lastPointRef.current.y) / dt) * 16,
    };
    lastPointRef.current = { x: e.clientX, y: e.clientY, t: now };

    setOffset(
      clampOffset(dragRef.current.originX + dx, dragRef.current.originY + dy),
    );
  };

  const onPointerUp = () => {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    setDragging(false);
    startInertia();
  };

  const openCreator = (slug: string) => {
    if (dragRef.current.moved) return;
    router.push(`/roster/${slug}`);
  };

  return (
    <section className="relative flex h-[calc(100dvh-4.75rem)] flex-col overflow-hidden bg-cream md:h-[calc(100dvh-5.25rem)]">
      <div
        ref={viewportRef}
        className={cn(
          "relative min-h-0 flex-1 w-full overflow-hidden select-none",
          dragging ? "cursor-grabbing" : "cursor-grab",
        )}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div
          className="absolute left-0 top-0 will-change-transform"
          style={{
            width: MAP_WIDTH,
            height: MAP_HEIGHT,
            transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
          }}
        >
          {CREATORS.map((creator) => {
            const active = hoveredId === creator.id;
            const faded = hoveredId !== null && !active;

            return (
              <button
                key={creator.id}
                type="button"
                className={cn(
                  "group absolute flex w-[170px] cursor-pointer flex-col items-center text-left transition-[opacity,transform] duration-300 ease-out",
                  faded ? "opacity-[0.28]" : "opacity-100",
                  active && "z-20 scale-[1.06]",
                )}
                style={{ left: creator.x, top: creator.y }}
                onMouseEnter={(e) => {
                  if (dragRef.current.active) return;
                  stopInertia();
                  velocityRef.current = { x: 0, y: 0 };
                  setPromptPlacement(resolvePromptPlacement(e.currentTarget));
                  setHoveredId(creator.id);
                }}
                onMouseLeave={() =>
                  setHoveredId((id) => (id === creator.id ? null : id))
                }
                onClick={() => openCreator(creator.slug)}
              >
                <div className="relative w-full">
                  {active && promptPlacement === "above" ? (
                    <span className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-3 w-max max-w-[230px] -translate-x-1/2 rounded-md bg-forest px-4 py-2.5 text-center text-[13px] leading-snug font-medium text-cream shadow-[0_8px_24px_rgba(52,91,71,0.35)]">
                      {creator.prompt}
                    </span>
                  ) : null}

                  <div
                    className={cn(
                      "relative mx-auto h-[230px] w-[170px] overflow-hidden rounded-t-[2.75rem] bg-cream-dark shadow-[0_14px_36px_rgba(28,26,23,0.08)] transition-shadow duration-300",
                      active && "shadow-[0_18px_44px_rgba(28,26,23,0.14)]",
                    )}
                  >
                    <Image
                      src="/images/creator-placeholder.png"
                      alt={creator.name}
                      fill
                      sizes="170px"
                      className="pointer-events-none object-cover object-[center_18%]"
                      draggable={false}
                      priority={Number(creator.id) <= 6}
                    />
                    <div
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-cream/40 to-transparent"
                      aria-hidden
                    />
                  </div>
                </div>

                <p className="mt-3.5 text-center text-[12px] leading-snug text-muted">
                  {creator.title}
                </p>
                <p className="mt-1 text-center font-display text-[1.15rem] leading-tight tracking-tight text-charcoal">
                  {creator.name}
                </p>

                {active && promptPlacement === "below" ? (
                  <span className="pointer-events-none mt-3 w-max max-w-[230px] rounded-md bg-forest px-4 py-2.5 text-center text-[13px] leading-snug font-medium text-cream shadow-[0_8px_24px_rgba(52,91,71,0.35)]">
                    {creator.prompt}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-cream to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-cream via-cream/85 to-transparent"
          aria-hidden
        />
      </div>

      {/* Compact copy band — kept inside first viewport */}
      <div className="relative z-10 shrink-0 bg-cream px-6 pb-8 pt-3 md:px-10 md:pb-10 md:pt-4 lg:px-12">
        <div className="mx-auto grid max-w-352 gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-start lg:gap-10">
          <h1 className="font-display text-[2.6rem] leading-[1.08] tracking-tight text-charcoal sm:text-[3.15rem] md:text-[3.65rem]">
            Book <span className="text-forest">B2B creators</span>
            <br />
            for your brand.
          </h1>

          <div className="flex flex-col gap-3">
            <p className="max-w-xl text-[0.8125rem] leading-snug text-charcoal/70 md:text-[0.875rem] md:leading-relaxed">
              Credible represents the founders, operators, investors and
              specialists whose voices your buyers already trust — and turns that
              trust into content, campaigns and stage time for your brand.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-sm bg-forest px-4 py-2 text-[0.8125rem] text-cream transition-colors hover:bg-forest-dark"
              >
                Send brief
              </Link>
              <Link
                href="/roster"
                className="inline-flex items-center justify-center rounded-sm border border-charcoal/25 bg-transparent px-4 py-2 text-[0.8125rem] text-charcoal transition-colors hover:border-forest hover:text-forest"
              >
                Browse roster
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
