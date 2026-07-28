"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Box,
  LayoutDashboard,
  LogOut,
  MoreVertical,
  Package,
  Settings,
  X,
} from "lucide-react";
import { logoutAuthSession } from "../../../utils/authStorage";
import { clearCartStorage } from "../../../services/cart.service";

const menuItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Parent Components", href: "/admin/catalogue", icon: Package },
  { name: "Child Components", href: "/admin/items", icon: Box },
  { name: "Setting", href: "/admin/settings", icon: Settings },
];

function getStoredSidebarUser() {
  if (typeof window === "undefined") return { name: "Admin", role: "Super Admin" };
  try {
    const stored = localStorage.getItem("user");
    const parsed = stored ? JSON.parse(stored) : null;
    return {
      name: parsed?.name || parsed?.email || "Admin",
      role: parsed?.role ? `${parsed.role.charAt(0).toUpperCase()}${parsed.role.slice(1)}` : "Super Admin",
    };
  } catch {
    return { name: "Admin", role: "Super Admin" };
  }
}

export default function Sidebar({ onNavigate, onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user] = useState(getStoredSidebarUser);
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setOpenMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    await logoutAuthSession();
    clearCartStorage();
    window.dispatchEvent(new Event("token-changed"));
    onNavigate?.();
    router.replace("/login");
  };

  const initials = (user.name || "Admin")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "A";

  return (
    <aside className="flex h-dvh w-[min(84vw,18rem)] max-w-[18rem] flex-col bg-[#2B140E] text-[#FFF9F3] shadow-[0_16px_40px_rgba(43,20,14,0.15)] lg:w-64">
      <div className="relative px-5 py-6 sm:px-6 sm:py-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg border border-[#C98A78]/35 text-[#FFF9F3] hover:bg-[#4A2318] lg:hidden"
          aria-label="Close admin menu"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
        <div className="text-center">
        
          <h1 className="brand-serif text-3xl font-bold leading-none text-[#C89A4B] sm:text-4xl">chocotraill</h1>
        
        </div>
      </div>

      <nav className="flex-1 space-y-2 px-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href === "/admin/dashboard" && pathname === "/admin");
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition ${
                isActive
                  ? "bg-gradient-to-r from-[#C98A78] to-[#D85C6B] text-white shadow-[0_10px_30px_rgba(43,20,14,0.18)]"
                  : "text-[#FFF9F3] hover:bg-[#4A2318]"
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? "text-white" : "text-[#C98A78]"}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

     
      <div className="relative border-t border-[#C98A78]/30 p-4" ref={menuRef}>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#C89A4B] bg-[#2B140E] text-lg font-bold text-[#C89A4B]">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{user.name}</p>
            <p className="text-xs text-[#FFF9F3]/65">{user.role}</p>
          </div>
          <button onClick={() => setOpenMenu((value) => !value)} className="rounded-md p-1 hover:bg-[#4A2318]" aria-label="Open profile menu">
            <MoreVertical className="cursor-pointer h-4 w-4" />
          </button>
        </div>

        {openMenu && (
          <div className="absolute bottom-16 right-4 w-40 overflow-hidden rounded-lg border border-[#E8D8CC] bg-[#FFFCF8] shadow-[0_16px_40px_rgba(43,20,14,0.15)]">
            <button onClick={handleLogout} className="cursor-pointer flex w-full items-center gap-2 px-4 py-2 text-sm font-semibold text-[#D95C5C] hover:bg-[#FFF0F0]">
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
