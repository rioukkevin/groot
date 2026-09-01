import { SITE_URL } from "@/lib/seo";

import type { MetadataRoute } from "next";

/**
 * Open to crawlers, including the AI ones.
 *
 * A portfolio wants to be found and quoted — being summarised accurately by an
 * assistant is the modern equivalent of ranking. The admin and the API are the
 * only things kept out, because they are not content.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
