import type { CollectionConfig } from "payload";

/** A degree, as /education renders it. */
export const Education: CollectionConfig = {
  slug: "education",
  labels: { singular: "Study", plural: "Education" },
  admin: {
    group: "Content",
    useAsTitle: "what",
    defaultColumns: ["what", "where", "when", "order"],
  },
  access: { read: () => true },
  defaultSort: "order",
  fields: [
    { name: "order", type: "number", required: true, defaultValue: 0 },
    { name: "when", type: "text", required: true },
    { name: "what", type: "text", required: true, localized: true },
    { name: "where", type: "text", required: true },
  ],
};
