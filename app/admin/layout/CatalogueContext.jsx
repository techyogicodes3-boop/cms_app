"use client";

import { createContext, useContext, useRef, useCallback } from "react";

const CatalogueContext = createContext(null);

export function CatalogueProvider({ children }) {
  const onOpenCreateRef = useRef(null);

  const setOnOpenCreateCatalogue = useCallback((fn) => {
    onOpenCreateRef.current = fn;
  }, []);

  const onOpenCreateCatalogue = useCallback(() => {
    onOpenCreateRef.current?.();
  }, []);

  return (
    <CatalogueContext.Provider
      value={{ onOpenCreateCatalogue, setOnOpenCreateCatalogue }}
    >
      {children}
    </CatalogueContext.Provider>
  );
}

export function useCatalogueActions() {
  const ctx = useContext(CatalogueContext);
  return ctx;
}

