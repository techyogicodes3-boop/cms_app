"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getRoleRedirectPath,
  refreshAuthSession,
} from "../../utils/authStorage";

export default function AuthGuard({ children, requiredRole, guestOnly = false }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(!guestOnly && !requiredRole);
  const [checking, setChecking] = useState(Boolean(guestOnly || requiredRole));

  useEffect(() => {
    let active = true;

    const checkAccess = async () => {
      if (!guestOnly && !requiredRole) {
        if (active) {
          setAllowed(true);
          setChecking(false);
        }
        return;
      }

      const auth = await refreshAuthSession();
      if (!active) return;

      if (guestOnly) {
        if (auth.isAuthenticated) {
          setAllowed(false);
          router.replace(getRoleRedirectPath(auth.role));
        } else {
          setAllowed(true);
        }
        setChecking(false);
        return;
      }

      if (!auth.isAuthenticated) {
        setAllowed(false);
        router.replace("/login");
      } else if (auth.role !== requiredRole) {
        setAllowed(false);
        router.replace(getRoleRedirectPath(auth.role));
      } else {
        setAllowed(true);
      }
      setChecking(false);
    };

    checkAccess();
    return () => {
      active = false;
    };
  }, [guestOnly, requiredRole, router]);

  if (checking || !allowed) {
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
