"use client";

import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

import type {
  ExpertAudienceSlice,
  ExpertTopicShare,
} from "@/lib/expert-profiles";
import { cn } from "@/lib/utils";

/** Marker positions as % of the map frame (calibrated to the world map projection). */
const REGION_COORDS: Record<string, { x: number; y: number }> = {
  US: { x: 22.5, y: 38 },
  USA: { x: 22.5, y: 38 },
  "United States": { x: 22.5, y: 38 },
  Canada: { x: 20.5, y: 24 },
  UK: { x: 48.2, y: 28 },
  "United Kingdom": { x: 48.2, y: 28 },
  Britain: { x: 48.2, y: 28 },
  EU: { x: 51, y: 30 },
  Europe: { x: 51, y: 30 },
  Singapore: { x: 76.5, y: 56 },
  Australia: { x: 84, y: 72 },
  Germany: { x: 51.5, y: 30 },
  France: { x: 49, y: 32 },
  India: { x: 70, y: 45 },
  Japan: { x: 84, y: 35 },
  Brazil: { x: 34, y: 62 },
  Asia: { x: 76, y: 38 },
  LATAM: { x: 30, y: 58 },
  Nigeria: { x: 50, y: 52 },
  "South Africa": { x: 55, y: 72 },
  UAE: { x: 62, y: 42 },
  "United Arab Emirates": { x: 62, y: 42 },
};

/** Map geography labels → SVG path ids in world-map.svg */
const REGION_PATH_IDS: Record<string, string[]> = {
  US: ["us"],
  USA: ["us"],
  "United States": ["us"],
  Canada: ["ca"],
  UK: ["gb"],
  "United Kingdom": ["gb"],
  Britain: ["gb"],
  Singapore: ["sg"],
  Australia: ["au"],
  Germany: ["de"],
  France: ["fr"],
  India: ["in"],
  Japan: ["jp"],
  Brazil: ["br"],
  Nigeria: [],
  UAE: ["ae"],
  "United Arab Emirates": ["ae"],
  "South Africa": [],
  EU: ["de", "fr", "it", "es", "nl", "be", "pl", "se", "at", "pt", "ie", "cz", "ro", "hu", "gr", "dk", "fi"],
  Europe: ["de", "fr", "it", "es", "nl", "be", "pl", "se", "at", "pt", "ie"],
  LATAM: ["br", "mx", "ar", "co", "pe", "cl", "ve", "ec"],
  Asia: ["cn", "in", "jp", "kr", "id", "th", "vn", "my", "sg"],
};

function resolveCoords(label: string) {
  if (REGION_COORDS[label]) return REGION_COORDS[label];
  const key = Object.keys(REGION_COORDS).find(
    (entry) => entry.toLowerCase() === label.toLowerCase(),
  );
  return key ? REGION_COORDS[key] : { x: 50, y: 50 };
}

function pathIdsForLabel(label: string) {
  if (REGION_PATH_IDS[label]) return REGION_PATH_IDS[label];
  const key = Object.keys(REGION_PATH_IDS).find(
    (entry) => entry.toLowerCase() === label.toLowerCase(),
  );
  return key ? REGION_PATH_IDS[key] : [];
}

export function ExpertAudienceMap({
  geography,
}: {
  geography: ExpertAudienceSlice[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [mapMarkup, setMapMarkup] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{
    active: boolean;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);

  const ranked = [...geography].sort((a, b) => b.percent - a.percent);
  const highlightIds = ranked.flatMap((item) => pathIdsForLabel(item.label));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        setVisible(true);
        observer.disconnect();
      },
      { threshold: 0.35 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadMap() {
      try {
        const response = await fetch("/images/world-map.svg");
        if (!response.ok) return;
        let svg = await response.text();
        svg = svg
          .replace(/fill="#1C1A17"/i, 'fill="#1C1A17"')
          .replace(
            /fill-opacity="0\.16"/i,
            'fill-opacity="0.1" class="audience-map-base"',
          );

        if (highlightIds.length > 0) {
          const unique = [...new Set(highlightIds)];
          const style = `<style>
            .audience-map-base, .audience-map-base path, .audience-map-base g { fill: #1C1A17; fill-opacity: 0.1; }
            ${unique
              .map(
                (id) =>
                  `#${id}, #${id} path, #${id} .mainland { fill: #345B47 !important; fill-opacity: 0.72 !important; }`,
              )
              .join("\n")}
          </style>`;
          svg = svg.replace(/<svg([^>]*)>/i, `<svg$1>${style}`);
        }

        if (!cancelled) setMapMarkup(svg);
      } catch {
        /* fallback to img */
      }
    }

    void loadMap();
    return () => {
      cancelled = true;
    };
  }, [highlightIds.join(",")]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    function onWheel(event: WheelEvent) {
      event.preventDefault();
      const delta = event.deltaY > 0 ? -0.12 : 0.12;
      setScale((current) => Math.min(3.2, Math.max(1, current + delta)));
    }

    viewport.addEventListener("wheel", onWheel, { passive: false });
    return () => viewport.removeEventListener("wheel", onWheel);
  }, []);

  useEffect(() => {
    if (scale === 1) setOffset({ x: 0, y: 0 });
  }, [scale]);

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (scale <= 1) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      active: true,
      startX: event.clientX,
      startY: event.clientY,
      originX: offset.x,
      originY: offset.y,
    };
  }

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag?.active) return;
    setOffset({
      x: drag.originX + (event.clientX - drag.startX),
      y: drag.originY + (event.clientY - drag.startY),
    });
  }

  function onPointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    if (!dragRef.current?.active) return;
    event.currentTarget.releasePointerCapture(event.pointerId);
    dragRef.current = null;
  }

  return (
    <div
      ref={ref}
      className="overflow-hidden rounded-sm border border-charcoal/8 bg-cream-dark"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-charcoal/8 px-5 py-4 md:px-6">
        <p className="text-[0.65rem] font-medium tracking-[0.14em] text-charcoal/45 uppercase">
          Audience geography
        </p>
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          {ranked.map((item, index) => (
            <li
              key={item.label}
              className={cn(
                "flex items-baseline gap-2 transition-all duration-700",
                visible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-1 opacity-0",
              )}
              style={{ transitionDelay: `${180 + index * 90}ms` }}
            >
              <span className="size-2 rounded-sm bg-forest" aria-hidden />
              <span className="text-[0.8rem] text-charcoal/70">{item.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <div
        ref={viewportRef}
        className={cn(
          "relative overflow-hidden px-3 pt-4 pb-6 sm:px-5 md:px-6 md:pt-5 md:pb-8",
          scale > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in",
        )}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div
          className={cn(
            "relative mx-auto w-full max-w-4xl origin-center transition-opacity duration-700",
            visible ? "opacity-100" : "opacity-40",
          )}
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            transition: dragRef.current?.active
              ? "none"
              : "transform 180ms ease-out, opacity 700ms",
          }}
        >
          {mapMarkup ? (
            <div
              className="h-auto w-full [&_svg]:h-auto [&_svg]:w-full"
              dangerouslySetInnerHTML={{ __html: mapMarkup }}
            />
          ) : (
            <img
              src="/images/world-map.svg"
              alt=""
              width={784}
              height={459}
              className="h-auto w-full opacity-70"
              decoding="async"
              draggable={false}
            />
          )}

          {ranked.map((item, index) => {
            const coords = resolveCoords(item.label);
            const code = item.label.slice(0, 2).toUpperCase();

            return (
              <div
                key={item.label}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
              >
                <div
                  className={cn(
                    "relative transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    visible ? "opacity-100" : "opacity-0",
                  )}
                  style={{
                    transitionDelay: `${220 + index * 140}ms`,
                    transform: visible ? "scale(1)" : "scale(0.55)",
                  }}
                >
                  <span
                    className={cn(
                      "absolute top-1/2 left-1/2 size-10 -translate-x-1/2 -translate-y-1/2 rounded-sm bg-forest/20",
                      visible && "animate-[geo-pulse_2.4s_ease-out_infinite]",
                    )}
                    style={{ animationDelay: `${index * 0.35}s` }}
                    aria-hidden
                  />
                  <span className="relative inline-flex items-center rounded-sm bg-charcoal px-2.5 py-1.5 shadow-[0_10px_24px_rgba(28,26,23,0.28)] ring-1 ring-cream/10">
                    <span className="text-[0.65rem] font-medium tracking-[0.12em] text-cream/65 uppercase">
                      {code}
                    </span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function AudienceShareList({
  title,
  items,
  delay = 0,
}: {
  title: string;
  items: ExpertAudienceSlice[];
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        setVisible(true);
        observer.disconnect();
      },
      { threshold: 0.25 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-sm bg-[#FBF8F5] px-5 py-6 transition-[opacity,transform] duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] md:px-6 md:py-7",
        visible ? "translate-y-0 opacity-100" : "translate-y-7 opacity-0",
      )}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
    >
      <p className="text-[0.65rem] font-medium tracking-[0.14em] text-charcoal/45 uppercase">
        {title}
      </p>
      <ul className="mt-5 divide-y divide-charcoal/8">
        {items.map((item) => (
          <li
            key={item.label}
            className="py-3.5 first:pt-0 last:pb-0"
          >
            <span className="text-[0.9375rem] leading-snug text-charcoal/75">
              {item.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function TopicMixPie({ topics }: { topics: ExpertTopicShare[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const ranked = [...topics].sort((a, b) => b.percent - a.percent);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        setVisible(true);
        observer.disconnect();
      },
      { threshold: 0.25 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-sm bg-cream-dark px-5 py-7 transition-[opacity,transform] duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] md:px-7 md:py-8",
        visible ? "translate-y-0 opacity-100" : "translate-y-7 opacity-0",
      )}
    >
      <p className="text-[0.65rem] font-medium tracking-[0.14em] text-charcoal/45 uppercase">
        Topic mix
      </p>
      <ul className="mt-6 divide-y divide-charcoal/8">
        {ranked.map((topic, index) => (
          <li
            key={topic.label}
            className={cn(
              "py-4 transition-[opacity,transform] duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] first:pt-0 last:pb-0",
              visible
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0",
            )}
            style={{
              transitionDelay: visible ? `${180 + index * 120}ms` : "0ms",
            }}
          >
            <p className="text-[1rem] leading-snug text-charcoal/80 md:text-[1.0625rem]">
              {topic.label}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
