import { LOCALES } from "@app/lib-shared-types";
import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const PROTECTED_ROUTES = ["/checkout", "/orders"];

function getLocale(pathname: string) {
  const segment = pathname.split("/")[1];
  return LOCALES.includes(segment as any) ? segment : routing.defaultLocale;
}

export default function middleware(req: NextRequest) {
  const token = req.cookies.get("accessToken");
  const pathname = req.nextUrl.pathname;

  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.includes(route),
  );

  if (isProtectedRoute && !token) {
    const locale = getLocale(pathname);
    const url = new URL(`/${locale}/auth/sign-in`, req.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
