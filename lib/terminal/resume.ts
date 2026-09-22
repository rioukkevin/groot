import type { Locale } from "./locale";

/**
 * The CV, as the PDF it is designed as, served from public/cv.
 *
 * One file per language, and both are offered whichever language the shell
 * is in: a French recruiter may want the English one for a foreign client,
 * and the other way round. Drop a new export under the same name to update
 * a file. The text field in the CMS is what llms.txt and the content pack
 * carry; these are what a person downloads.
 */
export interface ResumeFile {
  lang: Locale;
  href: string;
  /** The file's own name, for the link and the saved download. */
  name: string;
}

const FILES: readonly ResumeFile[] = [
  { lang: "en", href: "/cv/Kevin-RIOU-CV-en.pdf", name: "Kevin-RIOU-CV-en.pdf" },
  { lang: "fr", href: "/cv/Kevin-RIOU-CV-fr.pdf", name: "Kevin-RIOU-CV-fr.pdf" },
];

/** Every CV, the one in the shell's language first. */
export function resumesFor(locale: Locale): ResumeFile[] {
  return [...FILES].sort((a, b) => Number(b.lang === locale) - Number(a.lang === locale));
}

/** The language's name in its own words, for a label beside the file. */
export const LANG_LABEL: Record<Locale, string> = { en: "English", fr: "Français" };
