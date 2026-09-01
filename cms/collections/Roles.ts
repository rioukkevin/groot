import type { CollectionConfig } from "payload";

/** A job or engagement, as /roles and /role render it. */
export const Roles: CollectionConfig = {
  slug: "roles",
  labels: { singular: "Role", plural: "Roles" },
  admin: {
    group: "Content",
    useAsTitle: "what",
    defaultColumns: ["what", "when", "where", "order"],
  },
  access: { read: () => true },
  defaultSort: "order",
  fields: [
    { name: "key", type: "text", required: true, unique: true },
    { name: "order", type: "number", required: true, defaultValue: 0 },
    {
      name: "when",
      type: "text",
      required: true,
      localized: true,
      admin: { description: "e.g. 2024 — now. Localised: 'now' translates." },
    },
    { name: "what", type: "text", required: true, localized: true },
    { name: "where", type: "text", required: true, localized: true },
    {
      name: "detail",
      type: "array",
      localized: true,
      labels: { singular: "Line", plural: "Lines" },
      fields: [
        {
          name: "label",
          type: "text",
          admin: { description: "Left column, e.g. Scope, Led, Shipped." },
        },
        { name: "text", type: "textarea", required: true },
      ],
    },
  ],
};
