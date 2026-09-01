import type { CollectionConfig } from "payload";

/** Uploads. Served from Vercel Blob in production, from disk in development. */
export const Media: CollectionConfig = {
  slug: "media",
  access: { read: () => true },
  upload: {
    staticDir: "public/uploads",
    mimeTypes: ["image/*"],
    imageSizes: [
      { name: "thumb", width: 480, height: undefined, position: "centre" },
      { name: "full", width: 1920, height: undefined, position: "centre" },
    ],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      localized: true,
      required: true,
      admin: { description: "Described for screen readers, per language." },
    },
    { name: "caption", type: "text", localized: true },
  ],
};
