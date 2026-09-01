import { notFound } from "next/navigation";

import { Terminal } from "@/components/terminal/Terminal";
import { LOCALES, isLocale } from "@/lib/terminal/locale";

/** Both locales are known ahead of time, so both prerender. */
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <Terminal locale={locale} />;
}
