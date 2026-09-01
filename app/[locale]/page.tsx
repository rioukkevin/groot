import { notFound } from "next/navigation";

import { Terminal } from "@/components/terminal/Terminal";
import { getShellContent } from "@/lib/terminal/cms";
import { LOCALES, isLocale } from "@/lib/terminal/locale";

import type { Locale } from "@/lib/terminal/locale";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

/**
 * Reads both locales and hands both to the client.
 *
 * Switching language is then a swap rather than a navigation: the transcript
 * survives, and the URL is rewritten in place. The second locale costs one
 * more read of content that is already in memory on the server, which is
 * cheaper than making a visitor lose their session to change language.
 */
export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const entries = await Promise.all(
    LOCALES.map(async (l) => [l, await getShellContent(l)] as const),
  );
  const content = Object.fromEntries(entries) as Record<
    Locale,
    Awaited<ReturnType<typeof getShellContent>>
  >;

  return <Terminal initialLocale={locale} content={content} />;
}
