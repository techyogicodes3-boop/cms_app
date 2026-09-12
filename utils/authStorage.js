"use client";

export const AUTH_TOKEN_COOKIE = "auth_token";
export const AUTH_ROLE_COOKIE = "auth_role";

const TOKEN_STORAGE_KEY = "token";
const USER_STORAGE_KEY = "user";
const VALID_ROLES = new Set(["admin", "user"]);

function canUseBrowser() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

function getCookie(name) {
  if (!canUseBrowser()) return null;

  const value = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];

  return value ? decodeURIComponent(value) : null;
}

function deleteCookie(name) {
  if (!canUseBrowser()) return;

  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function clearAuthSession() {
  if (canUseBrowser()) {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  }

  deleteCookie(AUTH_TOKEN_COOKIE);
  deleteCookie(AUTH_ROLE_COOKIE);
}

export async function logoutAuthSession() {
  const token = canUseBrowser() ? localStorage.getItem(TOKEN_STORAGE_KEY) : null;
  try {
    await fetch(`/api/v1/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
  } catch {
    // Local auth is still cleared below; middleware will clear stale cookies on the next navigation.
  } finally {
    clearAuthSession();
  }
}

export function getRoleRedirectPath(role) {
  if (role === "admin") return "/admin/dashboard";
  if (role === "user") return "/account";
  return "/login";
}

export function persistAuthSession({ token, user }) {
  const role = user?.role;

  if (!VALID_ROLES.has(role)) {
    clearAuthSession();
    return false;
  }

  if (canUseBrowser()) {
    const guestCartKey = "chocotraillCart:guest";
    const userCartKey = `chocotraillCart:${user.id || user.uuid || user.email}`;
    try {
      const guestCart = JSON.parse(localStorage.getItem(guestCartKey) || "[]");
      const userCart = JSON.parse(localStorage.getItem(userCartKey) || "[]");
      if (Array.isArray(guestCart) && guestCart.length) {
        const merged = [...(Array.isArray(userCart) ? userCart : [])];
        guestCart.forEach((guestItem) => {
          const existing = merged.find((item) => item.catalogueItemId === guestItem.catalogueItemId);
          if (existing) existing.quantity = Number(existing.quantity || 0) + Number(guestItem.quantity || 1);
          else merged.push(guestItem);
        });
        localStorage.setItem(userCartKey, JSON.stringify(merged));
        localStorage.removeItem(guestCartKey);
      }
    } catch {
      // A malformed legacy cart should not prevent a successful login.
    }
    if (typeof token === "string" && token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    }
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    window.dispatchEvent(new Event("cart-changed"));
  }

  return true;
}

export async function refreshAuthSession() {
  if (!canUseBrowser()) {
    return { isAuthenticated: false, token: null, user: null, role: null, shouldClear: false };
  }

  try {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    const response = await fetch(`/api/v1/auth/me`, {
      method: "GET",
      credentials: "include",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });

    if (!response.ok) {
      clearAuthSession();
      return { isAuthenticated: false, token: null, user: null, role: null, shouldClear: false };
    }

    const json = await response.json();
    const user = json?.data?.user;
    if (!persistAuthSession({ token, user })) {
      return { isAuthenticated: false, token: null, user: null, role: null, shouldClear: false };
    }

    return {
      isAuthenticated: true,
      token: null,
      user,
      role: user.role,
      shouldClear: false,
    };
  } catch {
    return { isAuthenticated: false, token: null, user: null, role: null, shouldClear: false };
  }
}

export function getClientAuthState() {
  if (!canUseBrowser()) {
    return { isAuthenticated: false, token: null, user: null, role: null, shouldClear: false };
  }

  const cookieRole = getCookie(AUTH_ROLE_COOKIE);
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);

  let user = null;
  try {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    user = stored ? JSON.parse(stored) : null;
  } catch {
    return { isAuthenticated: false, token: null, user: null, role: null, shouldClear: true };
  }

  const role = user?.role || cookieRole;
  const isAuthenticated = Boolean(
    user &&
      role &&
      (token || cookieRole) &&
      (!cookieRole || role === cookieRole) &&
      VALID_ROLES.has(role)
  );

  return {
    isAuthenticated,
    token: isAuthenticated ? token : null,
    user: isAuthenticated ? user : null,
    role: isAuthenticated ? role : null,
    shouldClear: Boolean(token || cookieRole || user) && !isAuthenticated,
  };
}
