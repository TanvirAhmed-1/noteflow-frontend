import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/login", "/register"];

function decodeRoleFromToken(token: string): string | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    let base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4 !== 0) {
      base64 += "=";
    }
    const decodedStr = atob(base64);
    const parsed = JSON.parse(decodedStr);
    return parsed?.role || null;
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // 1. Unauthenticated users (no token): only allowed to access /login and /register
  if (!token && !isPublicRoute) {
    const loginUrl = new URL("/login", request.url);
    if (pathname !== "/") {
      loginUrl.searchParams.set("redirect", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  // 2. Authenticated users: cannot access /login or /register -> redirect to /
  if (token && isPublicRoute) {
    const homeUrl = new URL("/", request.url);
    return NextResponse.redirect(homeUrl);
  }

  // 3. Admin-only route guard: /admin and all /admin/* routes require role === 'admin'
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    const userRole = decodeRoleFromToken(token);
    if (userRole !== "admin") {
      // Non-admin user attempting to access admin route -> redirect to home
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|favicon.svg|icon|apple-icon|sitemap.xml|robots.txt).*)",
  ],
};
