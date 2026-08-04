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
  DEFAULT_HOME_SECTIONS,
  type HomePageSections,
} from "@/lib/cms";

type FooterField = "tagline" | "companyLine" | "email";

type HomeCmsContextValue = {
  footer: HomePageSections["footer"];
  setFooter: (footer: HomePageSections["footer"]) => void;
  editing: boolean;
  setEditing: (editing: boolean) => void;
  canEdit: boolean;
  setCanEdit: (canEdit: boolean) => void;
  selected: string | null;
  setSelected: (id: string | null) => void;
  onSelectFooterField: ((field: FooterField) => void) | null;
  setOnSelectFooterField: (fn: ((field: FooterField) => void) | null) => void;
};

const HomeCmsContext = createContext<HomeCmsContextValue | null>(null);

export function HomeCmsProvider({
  initialFooter,
  children,
}: {
  initialFooter: HomePageSections["footer"];
  children: ReactNode;
}) {
  const [footer, setFooterState] = useState(initialFooter);
  const [editing, setEditingState] = useState(false);
  const [canEdit, setCanEditState] = useState(false);
  const [selected, setSelectedState] = useState<string | null>(null);
  const [onSelectFooterField, setOnSelectFooterFieldState] = useState<
    ((field: FooterField) => void) | null
  >(null);

  const setFooter = useCallback((next: HomePageSections["footer"]) => {
    setFooterState(next);
  }, []);
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
      footer,
      setFooter,
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
      footer,
      setFooter,
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
    <HomeCmsContext.Provider value={value}>{children}</HomeCmsContext.Provider>
  );
}

export function useHomeCms() {
  const ctx = useContext(HomeCmsContext);
  if (!ctx) {
    return {
      footer: DEFAULT_HOME_SECTIONS.footer,
      setFooter: () => {},
      editing: false,
      setEditing: () => {},
      canEdit: false,
      setCanEdit: () => {},
      selected: null,
      setSelected: () => {},
      onSelectFooterField: null,
      setOnSelectFooterField: () => {},
    } satisfies HomeCmsContextValue;
  }
  return ctx;
}
