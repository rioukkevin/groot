import type { CollectionConfig } from "payload";

/** A side project or piece of client work, as /projects and /project render it. */
export const Projects: CollectionConfig = {
  slug: "projects",
  labels: { singular: "Project", plural: "Projects" },
  admin: {
    group: "Content",
    useAsTitle: "name",
    defaultColumns: ["name", "year", "status", "order"],
  },
  access: { read: () => true },
  defaultSort: "order",
  fields: [
    {
      name: "key",
      type: "text",
      required: true,
      unique: true,
      admin: { description: "URL-safe id, e.g. vscode-commit. Not translated." },
    },
    { name: "order", type: "number", required: true, defaultValue: 0 },
    { name: "name", type: "text", required: true, localized: true },
    { name: "what", type: "textarea", required: true, localized: true },
    {
      name: "stack",
      type: "text",
      required: true,
      admin: { description: "Tool names are the same in every language." },
    },
    { name: "year", type: "text", defaultValue: "—" },
    { name: "status", type: "text", required: true, localized: true },
    {
      name: "statusColor",
      type: "select",
      required: true,
      defaultValue: "var(--add)",
      options: [
        { label: "live / positive", value: "var(--add)" },
        { label: "in progress", value: "var(--accent2)" },
        { label: "attention", value: "var(--warn)" },
        { label: "ended", value: "var(--del)" },
        { label: "retired / quiet", value: "var(--dim)" },
      ],
    },
    {
      name: "detail",
      type: "array",
      localized: true,
      labels: { singular: "Paragraph", plural: "Paragraphs" },
      fields: [{ name: "text", type: "textarea", required: true }],
    },
    {
      name: "links",
      type: "array",
      localized: true,
      fields: [
        { name: "label", type: "text", required: true },
        { name: "url", type: "text" },
      ],
    },
    {
      name: "images",
      type: "array",
      labels: { singular: "Screenshot", plural: "Screenshots" },
      fields: [
        { name: "image", type: "upload", relationTo: "media" },
        {
          name: "path",
          type: "text",
          admin: {
            description:
              "Fallback path under /public for images not yet uploaded, e.g. /projects/britch/Screen1.png",
          },
        },
      ],
    },
  ],
};
