import { postgresAdapter } from "@payloadcms/db-postgres";
import { mcpPlugin } from "@payloadcms/plugin-mcp";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import path from "path";
import { buildConfig } from "payload";
import sharp from "sharp";
import { fileURLToPath } from "url";

import { Education } from "./cms/collections/Education";
import { Media } from "./cms/collections/Media";
import { Projects } from "./cms/collections/Projects";
import { Roles } from "./cms/collections/Roles";
import { Users } from "./cms/collections/Users";
import { SiteContent } from "./cms/globals/SiteContent";
import { UiText } from "./cms/globals/UiText";

const dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Blob storage only exists on Vercel. Locally the Media collection falls back
 * to `staticDir`, so `bun run dev` needs nothing but the database.
 */
const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: " · kr admin",
    },
  },

  // English is the source of record; French falls back to it until filled, so
  // a half-translated site still reads rather than showing gaps.
  localization: {
    locales: [
      { label: "English", code: "en" },
      { label: "Français", code: "fr" },
    ],
    defaultLocale: "en",
    fallback: true,
  },

  collections: [Projects, Roles, Education, Media, Users],
  globals: [SiteContent, UiText],

  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: { outputFile: path.resolve(dirname, "cms/payload-types.ts") },

  db: postgresAdapter({
    pool: {
      connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URI || "",
    },
  }),

  sharp,

  plugins: [
    // Lets an MCP client read and write the content directly, which is how the
    // collections get filled rather than by hand in the admin.
    mcpPlugin({
      collections: {
        [Projects.slug]: { enabled: true },
        [Roles.slug]: { enabled: true },
        [Education.slug]: { enabled: true },
        // Media is readable and writable but not deletable over MCP: an
        // accidental delete takes the blob with it.
        [Media.slug]: {
          enabled: { create: true, find: true, update: true, delete: false },
        },
      },
      globals: {
        [SiteContent.slug]: { enabled: true },
        [UiText.slug]: { enabled: true },
      },
    }),
    ...(blobToken
      ? [
          vercelBlobStorage({
            enabled: true,
            collections: { [Media.slug]: true },
            token: blobToken,
          }),
        ]
      : []),
  ],
});
