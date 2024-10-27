// middleware.ts
import { NextRequest } from "next/server";
import { createI18nMiddleware } from "next-international/middleware";

const I18nMiddleware = createI18nMiddleware({
  locales: ["en", "fr"],
  defaultLocale: "en",
});

export function middleware(request: NextRequest) {
  return I18nMiddleware(request);
}

export const config = {
  matcher: ["/((?!static|.*\\..*|_next|favicon.ico|robots.txt).*)"],
};
