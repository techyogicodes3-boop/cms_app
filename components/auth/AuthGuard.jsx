"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  clearAuthSession,
  getClientAuthState,
  getRoleRedirectPath,
} from "../../utils/authStorage";
import { clearCartStorage } from "../../services/cart.service";

export default function AuthGuard({ children, requiredRole, guestOnly = false }) {
  const router = useRouter();
  const auth = getClientAuthState();
  const allowed = (() => {
    if (typeof window === "undefined") return false;
    if (guestOnly) return !auth.isAuthenticated;
    if (requiredRole) return auth.isAuthenticated && auth.role === requiredRole;
    return true;
  })();

  useEffect(() => {
    const currentAuth = getClientAuthState();

    if (currentAuth.shouldClear) {
      clearAuthSession();
      clearCartStorage();
      window.dispatchEvent(new Event("token-changed"));
    }

    if (guestOnly) {
      if (currentAuth.isAuthenticated) {
        router.replace(getRoleRedirectPath(currentAuth.role));
      }
      return;
    }

    if (requiredRole) {
      if (!currentAuth.isAuthenticated) {
        router.replace("/login");
      } else if (currentAuth.role !== requiredRole) {
        router.replace(getRoleRedirectPath(currentAuth.role));
      }
    }
  }, [guestOnly, requiredRole, router]);

  if (!allowed) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-5 text-sm text-slate-600 shadow-sm">
          Checking access...
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
