import { notFound } from "next/navigation";

import { ContentDocument } from "@/components/seo/ContentDocument";
import { Terminal } from "@/components/terminal/Terminal";
import { WebMcp } from "@/components/terminal/WebMcp";
import { SITE_URL, personJsonLd } from "@/lib/seo";
import { getShellContent } from "@/lib/terminal/cms";
import { LOCALES, isLocale } from "@/lib/terminal/locale";

import type { ShellContentData } from "@/lib/terminal/shell-content";
import type { Locale } from "@/lib/terminal/locale";
import type { Metadata } from "next";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

/** Per-locale metadata, with each language pointing at the other. */
export async function generateMetadata({
  params,
}: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const c = await getShellContent(locale);
  const title = `${c.name} — ${c.tagline}`;
  const description = c.about.split("\n")[0];

  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        fr: "/fr",
        "x-default": "/en",
      },
    },
    openGraph: {
      type: "profile",
      locale: locale === "fr" ? "fr_FR" : "en_GB",
      alternateLocale: locale === "fr" ? "en_GB" : "fr_FR",
      url: `${SITE_URL}/${locale}`,
      title,
      description,
      siteName: c.name,
    },
    twitter: { card: "summary_large_image", title, description },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-snippet": -1 },
    },
    keywords: [
      ...Object.values(c.projects).map((p) => p.name),
      ...c.stack.flatMap(([, , items]) => items),
    ].slice(0, 24),
  };
}

/**
 * Reads both locales and hands both to the client, so switching language is a
 * swap rather than a navigation. The same content is also rendered as a plain
 * document for crawlers, which cannot drive a terminal.
 */
export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const entries = await Promise.all(
    LOCALES.map(async (l) => [l, await getShellContent(l)] as const),
  );
  const content = Object.fromEntries(entries) as Record<Locale, ShellContentData>;

  return (
    <>
      <script
        type="application/ld+json"
        // Generated from the CMS, so the structured data cannot drift from
        // what the page actually says.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personJsonLd(content[locale], locale)),
        }}
      />
      <ContentDocument content={content[locale]} locale={locale} />
      <WebMcp content={content[locale]} />
      <Terminal initialLocale={locale} content={content} />
    </>
  );
}
