import { Markdown } from "@/components/terminal/markdown/Markdown";
import type { ShellContentData } from "@/lib/terminal/shell-content";

/**
 * The same content the terminal serves, as a plain semantic document.
 *
 * The shell is a client-rendered transcript: a crawler that does not execute
 * JavaScript sees a prompt and nothing else, and one that does still sees a
 * terminal session rather than a CV. This renders the identical content — the
 * same CMS fields, the same locale — as headings, lists and paragraphs, so
 * search engines and language models read the substance.
 *
 * It is visually hidden but not hidden from assistive technology, which is the
 * honest arrangement in both directions: it is not cloaking, because the text
 * is exactly what the terminal shows, and a screen reader gets a linear
 * document instead of having to follow a transcript.
 */
export function ContentDocument({
  content,
  locale,
}: {
  content: ShellContentData;
  locale: string;
}) {
  const t = (key: string, fallback: string) => content.strings[key] || fallback;
  const projects = Object.values(content.projects);

  return (
    <div
      className="sr-only"
      // Not aria-hidden: this is the readable version of the same content.
      data-seo-document=""
      lang={locale}
    >
      <article>
        <h1>
          {content.name} — {content.tagline}
        </h1>
        <Markdown text={content.about} />
        <p>{content.location}</p>
        {content.nowHeadline && (
          <p>
            <strong>{t("seo.availability", "Availability")}:</strong>{" "}
            {content.nowHeadline}
          </p>
        )}

        <section>
          <h2>{t("seo.roles", "Experience")}</h2>
          <ul>
            {content.roles.map((r) => (
              <li key={r.key}>
                <h3>
                  {r.what} — {r.where}
                </h3>
                <p>
                  <time>{r.when}</time>
                </p>
                {r.detail.map((d, i) => (
                  <p key={i}>{d}</p>
                ))}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2>{t("seo.projects", "Projects")}</h2>
          <ul>
            {projects.map((p) => (
              <li key={p.key}>
                <h3>{p.name}</h3>
                <Markdown text={p.what} />
                <p>
                  {p.stack} · {p.year} · {p.status}
                </p>
                {p.detail.map((d, i) => (
                  <Markdown key={i} text={d} />
                ))}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2>{t("seo.education", "Education")}</h2>
          <ul>
            {content.education.map((e, i) => (
              <li key={i}>
                {e.what} — {e.where} (<time>{e.when}</time>)
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2>{t("seo.stack", "Skills and stack")}</h2>
          {[...content.stack, ...content.softSkills].map(([group, , items]) => (
            <div key={group}>
              <h3>{group}</h3>
              <ul>
                {items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {content.rates.length > 0 && (
          <section>
            <h2>{t("seo.rates", "Rates")}</h2>
            <ul>
              {content.rates.map(([label, value]) => (
                <li key={label}>
                  {label}: {value}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section>
          <h2>{t("seo.contact", "Contact")}</h2>
          <ul>
            {content.contact.map(([label, value]) => (
              <li key={label}>
                {label}:{" "}
                {value.includes("@") ? (
                  <a href={`mailto:${value}`}>{value}</a>
                ) : value.startsWith("github.com") ? (
                  <a href={`https://${value}`} rel="me noopener">
                    {value}
                  </a>
                ) : (
                  value
                )}
              </li>
            ))}
          </ul>
          <p>{content.contactFooter}</p>
        </section>
      </article>
    </div>
  );
}
