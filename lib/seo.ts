import type { ShellContentData } from "./terminal/shell-content";
import type { Locale } from "./terminal/locale";

/** Canonical origin. Vercel sets the deployment URL; fall back to the domain. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://kevin.riou.pro")
).replace(/\/$/, "");

/**
 * JSON-LD for the person and the page.
 *
 * Person is the entity search engines and assistants resolve a name against;
 * ProfilePage tells them this page *is* that person's profile rather than a
 * page mentioning them. Both are generated from the CMS, so they cannot drift
 * from what the site says.
 */
export function personJsonLd(content: ShellContentData, locale: Locale) {
  const email = content.contact.find(([, v]) => v.includes("@"))?.[1];
  const sameAs = content.contact
    .map(([, v]) => v)
    .filter((v) => v.includes("."))
    .filter((v) => !v.includes("@"))
    .map((v) => (v.startsWith("http") ? v : `https://${v}`));

  const knows = [...content.stack, ...content.softSkills].flatMap(
    ([, , items]) => items,
  );

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: content.name,
        description: content.about,
        jobTitle: content.tagline,
        email: email ? `mailto:${email}` : undefined,
        url: SITE_URL,
        sameAs,
        knowsAbout: knows,
        knowsLanguage: ["fr", "en"],
        address: {
          "@type": "PostalAddress",
          addressLocality: "Paris",
          addressCountry: "FR",
        },
        alumniOf: content.education.map((e) => ({
          "@type": "EducationalOrganization",
          name: e.where,
        })),
        hasOccupation: {
          "@type": "Occupation",
          name: content.tagline,
          occupationLocation: { "@type": "City", name: "Paris" },
        },
      },
      {
        "@type": "ProfilePage",
        "@id": `${SITE_URL}/${locale}#page`,
        url: `${SITE_URL}/${locale}`,
        inLanguage: locale,
        name: `${content.name} — ${content.tagline}`,
        description: content.about,
        mainEntity: { "@id": `${SITE_URL}/#person` },
        isPartOf: { "@id": `${SITE_URL}/#website` },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: `${content.name} — portfolio`,
        inLanguage: ["en", "fr"],
        publisher: { "@id": `${SITE_URL}/#person` },
      },
      ...Object.values(content.projects).map((p) => ({
        "@type": "CreativeWork",
        name: p.name,
        description: p.what,
        about: p.stack,
        dateCreated: /^\d{4}/.test(p.year) ? p.year.slice(0, 4) : undefined,
        creator: { "@id": `${SITE_URL}/#person` },
        inLanguage: locale,
      })),
    ],
  };
}
