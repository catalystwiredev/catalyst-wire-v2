import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED = ["/dashboard", "/account", "/watchlist"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );

  if (!isProtected) return NextResponse.next();

  // next-auth v4 stores the session token in one of these cookies
  const token =
    request.cookies.get("next-auth.session-token") ??
    request.cookies.get("__Secure-next-auth.session-token");

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/account/:path*", "/watchlist/:path*"],
};
