import { SITE_URL } from "./seo";

import type { ShellContentData } from "./terminal/shell-content";
import type { Locale } from "./terminal/locale";

/**
 * The site as markdown, for language models.
 *
 * A terminal is a hostile read for a crawler and worse for a model: the content
 * arrives as a transcript, interleaved with UI. This is the same CMS content in
 * the shape a model handles best — headed sections, short lines, no chrome.
 */
export function llmsTxt(c: ShellContentData, locale: Locale, full: boolean) {
  const L = (s: string) => s.replace(/\s+/g, " ").trim();
  const out: string[] = [
    `# ${c.name}`,
    "",
    `> ${L(c.tagline)}. ${L(c.about.split("\n")[0])}`,
    "",
    `- Language of this file: ${locale}`,
    `- Other language: ${SITE_URL}/${locale === "en" ? "fr" : "en"}`,
    `- Availability: ${c.nowHeadline}`,
    "",
  ];

  out.push("## Contact", "");
  for (const [label, value] of c.contact) out.push(`- ${label}: ${value}`);
  if (c.contactFooter) out.push("", c.contactFooter);
  out.push("");

  out.push("## Experience", "");
  for (const r of c.roles) {
    out.push(`### ${r.what} — ${r.where} (${r.when})`, "");
    for (const d of r.detail) out.push(full ? `- ${L(d)}` : `- ${L(d).slice(0, 160)}`);
    out.push("");
  }

  out.push("## Projects", "");
  for (const p of Object.values(c.projects)) {
    out.push(`### ${p.name}`, "", `${L(p.what)}`, "", `- Stack: ${p.stack}`,
      `- Year: ${p.year}`, `- Status: ${p.status}`);
    if (p.links.length) out.push(`- Links: ${p.links.join(", ")}`);
    if (full) {
      out.push("");
      for (const d of p.detail) out.push(L(d), "");
    }
    out.push("");
  }

  out.push("## Education", "");
  for (const e of c.education) out.push(`- ${e.what}, ${e.where} (${e.when})`);
  out.push("");

  out.push("## Skills", "");
  for (const [group, , items] of [...c.stack, ...c.softSkills]) {
    out.push(`- ${group}: ${items.join(", ")}`);
  }
  out.push("");

  if (c.rates.length) {
    out.push("## Rates", "");
    for (const [label, value] of c.rates) out.push(`- ${label}: ${value}`);
    out.push("");
  }

  out.push("## Machine access", "",
    `- MCP endpoint: ${SITE_URL}/api/mcp (read-only tools for this content)`,
    `- Discovery: ${SITE_URL}/.well-known/mcp.json`,
    `- Full text: ${SITE_URL}/llms-full.txt`,
    "");

  return out.join("\n");
}
