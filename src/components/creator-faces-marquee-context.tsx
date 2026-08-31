"use client";

import { createContext, useContext, type ReactNode } from "react";

export type CreatorMarqueeFace = {
  slug: string;
  name: string;
  image: string;
};

const CreatorMarqueeFacesContext = createContext<CreatorMarqueeFace[]>([]);

export function CreatorMarqueeFacesProvider({
  faces,
  children,
}: {
  faces: CreatorMarqueeFace[];
  children: ReactNode;
}) {
  return (
    <CreatorMarqueeFacesContext.Provider value={faces}>
      {children}
    </CreatorMarqueeFacesContext.Provider>
  );
}

export function useCreatorMarqueeFaces(): CreatorMarqueeFace[] {
  return useContext(CreatorMarqueeFacesContext);
}
