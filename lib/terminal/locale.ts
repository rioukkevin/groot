/**
 * Locale plumbing for the shell.
 *
 * English is the source of record and French is layered over it: any string
 * the French layer does not carry falls through to the English one, so a
 * half-translated site reads rather than showing gaps. This mirrors Payload's
 * `fallback: true`, so when the shell is wired to the CMS the behaviour is the
 * same one, not a second version of it.
 */

export const LOCALES = ["en", "fr"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_LABEL: Record<Locale, string> = {
  en: "english",
  fr: "français",
};

export function isLocale(v: string | undefined | null): v is Locale {
  return v === "en" || v === "fr";
}

/** The other one. With two locales, switching is a toggle. */
export const otherLocale = (l: Locale): Locale => (l === "en" ? "fr" : "en");

/**
 * Countries where French is the sensible default. Vercel puts the visitor's
 * country in `x-vercel-ip-country` on every plan, so this costs nothing; it is
 * only consulted when the browser has not already asked for a language.
 */
const FRENCH_COUNTRIES = new Set(["FR", "BE", "CH", "LU", "MC", "CA"]);

/**
 * Picks a locale from what the request actually tells us, in order of how much
 * it reflects a real preference:
 *
 * 1. an explicit cookie — the visitor chose, and a choice outranks a guess
 * 2. `Accept-Language` — the browser's own setting, which the visitor set once
 * 3. the country the request came from, which is a guess about a person from
 *    a fact about a network, and so goes last
 */
export function pickLocale(input: {
  cookie?: string | null;
  acceptLanguage?: string | null;
  country?: string | null;
}): Locale {
  if (isLocale(input.cookie)) return input.cookie;

  const header = input.acceptLanguage ?? "";
  if (header) {
    // "fr-CH, fr;q=0.9, en;q=0.8" → the highest-weighted tag we serve.
    const ranked = header
      .split(",")
      .map((part) => {
        const [tag, ...params] = part.trim().split(";");
        const q = params
          .map((p) => p.trim())
          .find((p) => p.startsWith("q="))
          ?.slice(2);
        return { tag: tag.trim().toLowerCase(), q: q ? Number(q) : 1 };
      })
      .filter((x) => x.tag && Number.isFinite(x.q))
      .sort((a, b) => b.q - a.q);

    for (const { tag } of ranked) {
      const base = tag.split("-")[0];
      if (isLocale(base)) return base;
    }
  }

  const country = input.country?.toUpperCase();
  if (country && FRENCH_COUNTRIES.has(country)) return "fr";

  return DEFAULT_LOCALE;
}

/** Name of the cookie holding an explicit choice. */
export const LOCALE_COOKIE = "kr-locale";

/** Swaps the locale segment of a path, keeping everything after it. */
export function pathForLocale(pathname: string, next: Locale): string {
  const rest = pathname.replace(/^\/(en|fr)(?=\/|$)/, "");
  return `/${next}${rest}`;
}
