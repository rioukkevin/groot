import { llmsTxt } from "@/lib/llms";
import { getShellContent } from "@/lib/terminal/cms";
import { isLocale } from "@/lib/terminal/locale";

/**
 * /llms.txt — the convention for handing a language model a clean read of a
 * site. `?lang=fr` serves the French; the default follows Accept-Language.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const asked = url.searchParams.get("lang");
  const header = req.headers.get("accept-language") ?? "";
  const locale = isLocale(asked)
    ? asked
    : header.toLowerCase().startsWith("fr")
      ? "fr"
      : "en";

  const content = await getShellContent(locale);
  return new Response(llmsTxt(content, locale, false), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
