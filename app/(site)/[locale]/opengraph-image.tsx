import { loadCardAssets } from "@/lib/og/assets";
import { CARD_SIZE, renderCard } from "@/lib/og/card";
import { SITE_URL } from "@/lib/seo";
import { getShellContent } from "@/lib/terminal/cms";
import { isLocale } from "@/lib/terminal/locale";

/**
 * The card a link to the site unfurls into, drawn per locale from the CMS.
 *
 * It is the shell's own header — the pixelated buddy, the identity line, the
 * availability banner — followed by the name at a size a feed can read, and
 * the prompt, so the card says what the page is before anyone opens it.
 * Twitter cards take this image too: the page declares none of its own.
 *
 * Rendered on demand and kept for the page's revalidation window, so a change
 * in the CMS reaches the card on the same schedule as the page. The route
 * group gives the URL a hash suffix; the page's og:image tag carries it.
 */

export const alt = "Kévin Riou — portfolio shell";
export const size = CARD_SIZE;
export const contentType = "image/png";
export const revalidate = 300;

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const c = await getShellContent(isLocale(locale) ? locale : "en");

  return renderCard(
    {
      name: c.name,
      tagline: c.tagline,
      location: c.location,
      prefix: c.strings["header.prefix"] || "portfolio shell",
      banner: c.ui.banner,
      placeholder: c.ui.promptPlaceholder,
      host: new URL(SITE_URL).host,
    },
    await loadCardAssets(),
  );
}
