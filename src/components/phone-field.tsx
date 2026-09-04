"use client";

import { CaretDown, MagnifyingGlass } from "@phosphor-icons/react";
import { useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

const PHONE_COUNTRIES = [
  { code: "+44", name: "United Kingdom", flag: "🇬🇧" },
  { code: "+1", name: "United States", flag: "🇺🇸" },
  { code: "+353", name: "Ireland", flag: "🇮🇪" },
  { code: "+61", name: "Australia", flag: "🇦🇺" },
  { code: "+49", name: "Germany", flag: "🇩🇪" },
  { code: "+33", name: "France", flag: "🇫🇷" },
  { code: "+34", name: "Spain", flag: "🇪🇸" },
  { code: "+39", name: "Italy", flag: "🇮🇹" },
  { code: "+31", name: "Netherlands", flag: "🇳🇱" },
  { code: "+46", name: "Sweden", flag: "🇸🇪" },
  { code: "+41", name: "Switzerland", flag: "🇨🇭" },
  { code: "+971", name: "United Arab Emirates", flag: "🇦🇪" },
  { code: "+91", name: "India", flag: "🇮🇳" },
  { code: "+65", name: "Singapore", flag: "🇸🇬" },
  { code: "+852", name: "Hong Kong", flag: "🇭🇰" },
  { code: "+32", name: "Belgium", flag: "🇧🇪" },
  { code: "+45", name: "Denmark", flag: "🇩🇰" },
  { code: "+47", name: "Norway", flag: "🇳🇴" },
  { code: "+351", name: "Portugal", flag: "🇵🇹" },
  { code: "+48", name: "Poland", flag: "🇵🇱" },
  { code: "+81", name: "Japan", flag: "🇯🇵" },
  { code: "+82", name: "South Korea", flag: "🇰🇷" },
  { code: "+64", name: "New Zealand", flag: "🇳🇿" },
  { code: "+27", name: "South Africa", flag: "🇿🇦" },
  { code: "+55", name: "Brazil", flag: "🇧🇷" },
  { code: "+52", name: "Mexico", flag: "🇲🇽" },
  { code: "+1", name: "Canada", flag: "🇨🇦" },
] as const;

type PhoneCountry = (typeof PHONE_COUNTRIES)[number];

export function PhoneField({
  id,
  label = "Phone number",
  required = false,
  labelClassName,
  className,
  size = "sm",
  variant = "cream",
}: {
  id: string;
  label?: string;
  required?: boolean;
  labelClassName?: string;
  className?: string;
  /** `sm` matches apply form; `md` matches brief/contact field height. */
  size?: "sm" | "md";
  /** `cream` = apply form; `brief` = white + forest border like BriefForm inputs. */
  variant?: "cream" | "brief";
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState<PhoneCountry>(PHONE_COUNTRIES[0]!);
  const listId = `${id}-phone-country-list`;
  const inputId = `${id}-phone`;
  const tall = size === "md";
  const brief = variant === "brief";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PHONE_COUNTRIES;
    return PHONE_COUNTRIES.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.code.includes(q) ||
        item.code.replace("+", "").includes(q),
    );
  }, [query]);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    const frame = window.requestAnimationFrame(() => searchRef.current?.focus());
    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <label
        htmlFor={inputId}
        className={
          labelClassName ??
          "block text-[0.625rem] font-medium tracking-[0.12em] text-charcoal/50 uppercase"
        }
      >
        {label}
        {required ? " *" : ""}
      </label>
      <div
        className={cn(
          "flex min-w-0 overflow-hidden rounded-sm border transition-[border-color,box-shadow,outline]",
          brief ? "bg-white" : "mt-1 bg-cream",
          brief && (tall ? "h-12" : "h-11"),
          focused || open
            ? brief
              ? "border-forest outline outline-2 outline-offset-[-2px] outline-forest"
              : "border-forest shadow-[0_0_0_1px_rgba(42,73,57,0.35)]"
            : brief
              ? "border-forest/40"
              : "border-charcoal/15",
        )}
      >
        <input type="hidden" name="phoneCountryCode" value={country.code} />
        <button
          type="button"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={listId}
          aria-label={`Country code ${country.code}, ${country.name}`}
          onClick={() => setOpen((current) => !current)}
          className={cn(
            "inline-flex shrink-0 cursor-pointer items-center gap-1.5 border-r text-charcoal transition-colors",
            brief
              ? "border-forest/20 px-3 hover:bg-cream/70"
              : "border-charcoal/10 px-2.5 py-2 hover:bg-white/60",
            tall && !brief && "px-3",
          )}
        >
          <span className="text-[1rem] leading-none" aria-hidden>
            {country.flag}
          </span>
          <CaretDown
            weight="bold"
            className={cn(
              "size-3 text-charcoal/45 transition-transform duration-200",
              open && "rotate-180",
            )}
            aria-hidden
          />
        </button>
        <div
          className={cn(
            "flex min-w-0 flex-1 items-center gap-1.5",
            brief ? "h-full px-3.5" : "px-3",
            tall && !brief && "h-12 px-3",
          )}
        >
          <span
            className={cn(
              "shrink-0 text-charcoal/45",
              brief || tall ? "text-[0.9375rem]" : "text-[0.8125rem]",
            )}
          >
            {country.code}
          </span>
          <input
            id={inputId}
            name="phone"
            type="tel"
            required={required}
            autoComplete="tel-national"
            placeholder="7700 900123"
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={cn(
              "min-w-0 flex-1 bg-transparent text-charcoal outline-none",
              brief || tall
                ? "h-full text-[0.9375rem] leading-none placeholder:text-charcoal/45"
                : "py-2 text-[0.8125rem] leading-snug placeholder:text-charcoal/35",
            )}
          />
        </div>
      </div>

      {open ? (
        <div className="absolute top-[calc(100%+0.35rem)] left-0 z-30 w-[min(18.5rem,calc(100vw-2.5rem))] overflow-hidden rounded-sm border border-charcoal/10 bg-[#FBF8F5] shadow-[0_16px_36px_rgba(28,26,23,0.14)]">
          <div className="border-b border-charcoal/8 px-2.5 py-2">
            <label className="relative block">
              <MagnifyingGlass
                weight="bold"
                className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-charcoal/35"
                aria-hidden
              />
              <input
                ref={searchRef}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search for country"
                className="w-full rounded-sm border border-charcoal/10 bg-cream py-2 pr-3 pl-8 text-[0.8125rem] text-charcoal outline-none placeholder:text-charcoal/35 focus:border-forest"
              />
            </label>
          </div>
          <ul
            id={listId}
            role="listbox"
            aria-label="Country codes"
            className="max-h-52 overflow-y-auto py-1"
          >
            {filtered.length === 0 ? (
              <li className="px-3.5 py-3 text-[0.8125rem] text-charcoal/45">
                No countries match
              </li>
            ) : (
              filtered.map((item) => {
                const active =
                  item.code === country.code && item.name === country.name;
                return (
                  <li
                    key={`${item.name}-${item.code}`}
                    role="option"
                    aria-selected={active}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setCountry(item);
                        setOpen(false);
                        setQuery("");
                      }}
                      className={cn(
                        "flex w-full cursor-pointer items-center gap-2.5 px-3.5 py-2 text-left text-[0.8125rem] transition-colors",
                        active
                          ? "bg-forest/10 font-medium text-forest"
                          : "text-charcoal hover:bg-cream",
                      )}
                    >
                      <span className="text-[1rem] leading-none" aria-hidden>
                        {item.flag}
                      </span>
                      <span className="min-w-0 flex-1 truncate">{item.name}</span>
                      <span className="shrink-0 text-charcoal/45">
                        ({item.code})
                      </span>
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
