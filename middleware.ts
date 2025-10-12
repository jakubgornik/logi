import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "app-session";
const PUBLIC_PAGES = ["/", "/signin", "/signup"];

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PAGES.includes(pathname)) {
    return NextResponse.next();
  }

  const hasAccessToken = request.cookies.get(COOKIE_NAME);

  if (!hasAccessToken) {
    const loginUrl = new URL("/signin", request.url);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}
