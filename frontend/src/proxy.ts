import { type NextRequest, NextResponse } from "next/server";

const AUTH_ROUTES = ["/login", "/register"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/") || pathname.startsWith("/static/")) {
    return NextResponse.next();
  }

  const hasTokens = request.cookies.has("logged_in");

  if (hasTokens && (pathname === "/" || AUTH_ROUTES.includes(pathname))) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!hasTokens && !AUTH_ROUTES.includes(pathname)) {
    const loginUrl = new URL("/login", request.url);
    if (pathname !== "/") {
      loginUrl.searchParams.set("next", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api|static).*)"],
};
