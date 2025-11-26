import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_NAME } from "./lib/shared/consts";
import { ROUTES } from "./lib/routes";

const PUBLIC_PAGES = ["/", "/signin", "/signup"];

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PAGES.includes(pathname)) {
    return NextResponse.next();
  }

  const hasAccessToken = request.cookies.get(COOKIE_NAME);

  if (!hasAccessToken) {
    const loginUrl = new URL(ROUTES.SIGN_IN, request.url);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}
