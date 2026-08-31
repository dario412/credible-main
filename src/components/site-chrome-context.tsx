"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  DEFAULT_SITE_CHROME,
  type SiteChromeSections,
} from "@/lib/site-chrome";

type FooterField =
  | "tagline"
  | "companyLine"
  | "companyLineHref"
  | "companyLineLinkLabel"
  | "email";

type SiteChromeContextValue = {
  chrome: SiteChromeSections;
  setChrome: (chrome: SiteChromeSections) => void;
  patchFooter: (patch: Partial<SiteChromeSections["footer"]>) => void;
  editing: boolean;
  setEditing: (editing: boolean) => void;
  canEdit: boolean;
  setCanEdit: (canEdit: boolean) => void;
  selected: string | null;
  setSelected: (id: string | null) => void;
  onSelectFooterField: ((field: FooterField) => void) | null;
  setOnSelectFooterField: (fn: ((field: FooterField) => void) | null) => void;
};

const SiteChromeContext = createContext<SiteChromeContextValue | null>(null);

export function SiteChromeProvider({
  initialChrome,
  children,
}: {
  initialChrome: SiteChromeSections;
  children: ReactNode;
}) {
  const [chrome, setChromeState] = useState(initialChrome);
  const [editing, setEditingState] = useState(false);
  const [canEdit, setCanEditState] = useState(false);
  const [selected, setSelectedState] = useState<string | null>(null);
  const [onSelectFooterField, setOnSelectFooterFieldState] = useState<
    ((field: FooterField) => void) | null
  >(null);

  const setChrome = useCallback((next: SiteChromeSections) => {
    setChromeState(next);
  }, []);

  const patchFooter = useCallback(
    (patch: Partial<SiteChromeSections["footer"]>) => {
      setChromeState((prev) => ({
        ...prev,
        footer: { ...prev.footer, ...patch },
      }));
    },
    [],
  );

  const setEditing = useCallback((next: boolean) => {
    setEditingState(next);
  }, []);
  const setCanEdit = useCallback((next: boolean) => {
    setCanEditState(next);
  }, []);
  const setSelected = useCallback((id: string | null) => {
    setSelectedState(id);
  }, []);
  const setOnSelectFooterField = useCallback(
    (fn: ((field: FooterField) => void) | null) => {
      setOnSelectFooterFieldState(() => fn);
    },
    [],
  );

  const value = useMemo(
    () => ({
      chrome,
      setChrome,
      patchFooter,
      editing,
      setEditing,
      canEdit,
      setCanEdit,
      selected,
      setSelected,
      onSelectFooterField,
      setOnSelectFooterField,
    }),
    [
      chrome,
      setChrome,
      patchFooter,
      editing,
      setEditing,
      canEdit,
      setCanEdit,
      selected,
      setSelected,
      onSelectFooterField,
      setOnSelectFooterField,
    ],
  );

  return (
    <SiteChromeContext.Provider value={value}>
      {children}
    </SiteChromeContext.Provider>
  );
}

export function useSiteChrome() {
  const ctx = useContext(SiteChromeContext);
  if (!ctx) {
    return {
      chrome: DEFAULT_SITE_CHROME,
      setChrome: () => {},
      patchFooter: () => {},
      editing: false,
      setEditing: () => {},
      canEdit: false,
      setCanEdit: () => {},
      selected: null,
      setSelected: () => {},
      onSelectFooterField: null,
      setOnSelectFooterField: () => {},
    } satisfies SiteChromeContextValue;
  }
  return ctx;
}

/** @deprecated Use useSiteChrome — kept for live-edit footer hooks. */
export function useHomeCms() {
  const chrome = useSiteChrome();
  return {
    footer: {
      tagline: chrome.chrome.footer.tagline,
      companyLine: chrome.chrome.footer.companyLine,
      email: chrome.chrome.footer.email,
    },
    setFooter: (footer: {
      tagline: string;
      companyLine: string;
      email: string;
    }) => {
      chrome.patchFooter(footer);
    },
    editing: chrome.editing,
    setEditing: chrome.setEditing,
    canEdit: chrome.canEdit,
    setCanEdit: chrome.setCanEdit,
    selected: chrome.selected,
    setSelected: chrome.setSelected,
    onSelectFooterField: chrome.onSelectFooterField,
    setOnSelectFooterField: chrome.setOnSelectFooterField,
  };
}
