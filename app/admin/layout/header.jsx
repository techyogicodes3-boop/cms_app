'use client';

import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Menu, Plus } from "lucide-react";
import { useCatalogueActions } from "./CatalogueContext";

export default function Header({ onMenuClick }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { onOpenCreateCatalogue } = useCatalogueActions() || {};
  const isItemsPage = pathname === "/admin/items";
  const isCataloguePage = pathname === "/admin/catalogue";
  const isSettingsPage = pathname === "/admin/settings";
  const isDashboard = pathname === "/admin/dashboard" || pathname === "/admin";
  const canCreate = isCataloguePage || isItemsPage;

  const page = (() => {
    if (isDashboard) {
      return { title: "Dashboard", subtitle: "Welcome back, Admin. Here is your component activity." };
    }
    if (isCataloguePage) {
      return { title: "Parent Components", subtitle: "Create, read, update, delete, and publish parent categories." };
    }
    if (isItemsPage) {
      return { title: "Child Components", subtitle: "Manage child products, stock, pricing, and active status." };
    }
    if (isSettingsPage) {
      return { title: "Setting", subtitle: "Manage home page slider images." };
    }
    return { title: "", subtitle: "" };
  })();

  const handleCreate = () => {
    if (isItemsPage) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("addItem", "1");
      router.push(`${pathname}?${params.toString()}`);
      return;
    }
    if (isCataloguePage && onOpenCreateCatalogue) onOpenCreateCatalogue();
  };

  return (
    <header className="border-b border-[#E8D8CC] bg-[#FFF9F3]/95 px-3 py-4 backdrop-blur sm:px-5 lg:px-7 lg:py-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 items-start gap-3 sm:gap-5">
          <button
            type="button"
            onClick={onMenuClick}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#E8D8CC] bg-[#FFFCF8] text-[#4A2318] shadow-sm lg:hidden"
            aria-label="Open admin menu"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
          <div className="min-w-0">
            <h1 className="brand-serif text-3xl font-bold leading-none text-[#2E1A14] sm:text-4xl">{page.title}</h1>
          </div>
        </div>

        {canCreate && (
          <div className="flex w-full items-center justify-end xl:w-auto">
            <button
              type="button"
              onClick={handleCreate}
              className="inline-flex h-11 w-full shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#D85C6B] px-4 text-sm font-bold text-white shadow-[0_10px_30px_rgba(43,20,14,0.08)] transition hover:bg-[#4A2318] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D85C6B] focus-visible:ring-offset-2 sm:w-auto sm:px-5"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              {isCataloguePage ? "Add Parent" : "Add Child"}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
