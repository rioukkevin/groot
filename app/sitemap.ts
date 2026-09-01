import { SITE_URL } from "@/lib/seo";
import { LOCALES } from "@/lib/terminal/locale";

import type { MetadataRoute } from "next";

/** Both locales, each declaring the other as its alternate. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return LOCALES.map((locale) => ({
    url: `${SITE_URL}/${locale}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: locale === "en" ? 1 : 0.9,
    alternates: {
      languages: Object.fromEntries(
        LOCALES.map((l) => [l, `${SITE_URL}/${l}`]),
      ),
    },
  }));
}
