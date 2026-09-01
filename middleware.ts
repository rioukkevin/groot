import { NextResponse } from "next/server";

import { LOCALE_COOKIE, isLocale, pickLocale } from "@/lib/terminal/locale";

import type { NextRequest } from "next/server";

/**
 * Sends a bare path to a locale-prefixed one.
 *
 * Country comes from `x-vercel-ip-country`, which Vercel sets on every plan,
 * so geo costs nothing and needs no third-party lookup. It is only consulted
 * when the visitor has neither chosen before nor expressed a language
 * preference in their browser — a fact about a network is the weakest of the
 * three signals, so it decides last.
 */
export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Already localised: remember the choice so the next bare visit honours it.
  const first = pathname.split("/")[1];
  if (isLocale(first)) {
    const res = NextResponse.next();
    if (req.cookies.get(LOCALE_COOKIE)?.value !== first) {
      res.cookies.set(LOCALE_COOKIE, first, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
      });
    }
    return res;
  }

  const locale = pickLocale({
    cookie: req.cookies.get(LOCALE_COOKIE)?.value,
    acceptLanguage: req.headers.get("accept-language"),
    country:
      req.headers.get("x-vercel-ip-country") ??
      req.headers.get("cf-ipcountry"),
  });

  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  url.search = search;
  return NextResponse.redirect(url);
}

export const config = {
  /**
   * Everything except the admin, the API, Next's own assets and files with an
   * extension. Payload owns /admin and /api and must not be given a locale
   * prefix.
   */
  matcher: ["/((?!admin|api|_next|favicon\\.ico|.*\\.[\\w]+$).*)"],
};
