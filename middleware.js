import { NextResponse } from "next/server";

const AUTH_TOKEN_COOKIE = "auth_token";
const AUTH_ROLE_COOKIE = "auth_role";
const VALID_ROLES = new Set(["admin", "user"]);
const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
  process.env.BACKEND_API_URL ||
  "http://localhost:9000";

const guestOnlyRoutes = new Set(["/login", "/register"]);

function clearAuthCookies(response) {
  response.cookies.delete(AUTH_TOKEN_COOKIE);
  response.cookies.delete(AUTH_ROLE_COOKIE);
  return response;
}

function redirect(request, pathname, clearAuth = false) {
  const response = NextResponse.redirect(new URL(pathname, request.url));
  return clearAuth ? clearAuthCookies(response) : response;
}

async function getCurrentAuth(token, cookieHeader) {
  if (!token) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
      headers: {
        cookie: cookieHeader || "",
      },
      cache: "no-store",
    });

    if (!response.ok) return null;
    const json = await response.json();
    const role = json?.data?.user?.role;
    if (!VALID_ROLES.has(role)) return null;

    return {
      id: json.data.user.id,
      role,
      maxAge: 24 * 60 * 60,
    };
  } catch {
    return null;
  }
}

function setRoleCookie(response, role, maxAge = 24 * 60 * 60) {
  response.cookies.set(AUTH_ROLE_COOKIE, role, {
    path: "/",
    sameSite: "lax",
    maxAge,
  });
  return response;
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_TOKEN_COOKIE)?.value;
  const roleCookie = request.cookies.get(AUTH_ROLE_COOKIE)?.value;
  const auth = await getCurrentAuth(token, request.headers.get("cookie"));
  const role = auth?.role;
  const hasBrokenAuth = Boolean(token || roleCookie) && !auth;
  const isAuthenticated = Boolean(auth && VALID_ROLES.has(role));

  if (hasBrokenAuth) {
    if (pathname === "/login") {
      return clearAuthCookies(NextResponse.next());
    }

    if (pathname === "/admin" || pathname.startsWith("/admin/")) {
      return redirect(request, "/login", true);
    }

    return clearAuthCookies(NextResponse.next());
  }

  if (guestOnlyRoutes.has(pathname)) {
    if (!isAuthenticated) return NextResponse.next();
    return redirect(request, role === "admin" ? "/admin/dashboard" : "/home");
  }

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    if (!isAuthenticated) return redirect(request, "/login", true);
    if (role !== "admin") return redirect(request, "/home");
    return roleCookie === role ? NextResponse.next() : setRoleCookie(NextResponse.next(), role, auth.maxAge);
  }

  if (pathname === "/account" || pathname.startsWith("/account/")) {
    if (!isAuthenticated) return redirect(request, "/login", true);
    if (role !== "user") return redirect(request, "/admin/dashboard");
    return roleCookie === role ? NextResponse.next() : setRoleCookie(NextResponse.next(), role, auth.maxAge);
  }

  return role && roleCookie !== role ? setRoleCookie(NextResponse.next(), role, auth.maxAge) : NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
