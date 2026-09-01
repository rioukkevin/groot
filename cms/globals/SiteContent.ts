import type { GlobalConfig } from "payload";

const chipGroup = (name: string, label: string) => ({
  name,
  type: "array" as const,
  label,
  localized: true,
  fields: [
    { name: "group", type: "text" as const, required: true },
    {
      name: "tint",
      type: "select" as const,
      defaultValue: "var(--accent)",
      options: [
        { label: "accent", value: "var(--accent)" },
        { label: "accent 2", value: "var(--accent2)" },
        { label: "warn", value: "var(--warn)" },
        { label: "add", value: "var(--add)" },
      ],
    },
    {
      name: "items",
      type: "array" as const,
      fields: [{ name: "label", type: "text" as const, required: true }],
    },
  ],
});

/**
 * Everything the site says *about Kévin* — the substance. Interface wording
 * lives in the UI Text global instead, so a copy tweak to a button can never
 * be confused with a change to the record.
 */
export const SiteContent: GlobalConfig = {
  slug: "site-content",
  label: "Site content",
  admin: { group: "Content" },
  access: { read: () => true },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Identity",
          fields: [
            { name: "name", type: "text", required: true, defaultValue: "Kévin Riou" },
            { name: "tagline", type: "text", localized: true, required: true },
            { name: "location", type: "text", localized: true },
            { name: "about", type: "textarea", localized: true, required: true },
          ],
        },
        {
          label: "Availability",
          fields: [
            {
              name: "headline",
              type: "text",
              localized: true,
              required: true,
              admin: { description: "First line of /now, also shown by the prompt." },
            },
            {
              name: "nowRows",
              type: "array",
              localized: true,
              label: "/now diff",
              fields: [
                { name: "num", type: "number", required: true },
                {
                  name: "sign",
                  type: "select",
                  required: true,
                  defaultValue: " ",
                  options: [
                    { label: "context", value: " " },
                    { label: "added", value: "+" },
                    { label: "removed", value: "-" },
                  ],
                },
                { name: "text", type: "text" },
              ],
            },
          ],
        },
        {
          label: "Skills",
          fields: [
            chipGroup("softSkills", "Soft skills"),
            chipGroup("stack", "Hard skills / stack"),
          ],
        },
        {
          label: "Rates & contact",
          fields: [
            {
              name: "rates",
              type: "array",
              localized: true,
              fields: [
                { name: "label", type: "text", required: true },
                { name: "value", type: "text", required: true },
              ],
            },
            {
              name: "contact",
              type: "array",
              fields: [
                { name: "label", type: "text", required: true },
                { name: "value", type: "text", required: true },
              ],
            },
            { name: "contactFooter", type: "text", localized: true },
            { name: "resume", type: "textarea", localized: true },
          ],
        },
      ],
    },
  ],
};
