import { notFound } from "next/navigation";

import { Terminal } from "@/components/terminal/Terminal";
import { getShellContent } from "@/lib/terminal/cms";
import { LOCALES, isLocale } from "@/lib/terminal/locale";

/** Both locales are known ahead of time. */
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

/**
 * Reads the shell's content from Payload for this locale and hands it to the
 * client. Localisation is Payload's — asking for `fr` returns French where it
 * exists and English where it does not, so nothing downstream implements a
 * fallback of its own.
 */
export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = await getShellContent(locale);
  return <Terminal locale={locale} content={content} />;
}
