import { postgresAdapter } from "@payloadcms/db-postgres";
import { mcpPlugin } from "@payloadcms/plugin-mcp";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import path from "path";
import { buildConfig } from "payload";

import type { Config } from "./cms/payload-types";
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
 * Types the local API against the generated types, so `payload.find` returns
 * real documents rather than `unknown` rows.
 */
declare module "payload" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface GeneratedTypes extends Config {}
}

/**
 * Blob storage only exists on Vercel. Locally the Media collection falls back
 * to `staticDir`, so `bun run dev` needs nothing but the database.
 */
const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

/**
 * `DATABASE_URL` is what the Neon integration injects on Vercel;
 * `POSTGRES_URL` is the local Docker one from .env.example. An empty string
 * would make `pg` dial localhost:5432 and fail late, mid-prerender, with a
 * connection error that points nowhere — so a missing value fails here, by name.
 */
const connectionString =
  process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.DATABASE_URI || "";
if (!connectionString && process.env.NODE_ENV === "production") {
  throw new Error(
    "No Postgres connection string: set DATABASE_URL (Neon on Vercel) or POSTGRES_URL (local).",
  );
}

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
    pool: { connectionString },
    // Production never pushes the schema; it runs these. `vercel-build` in
    // package.json applies them before Next prerenders the pages.
    migrationDir: path.resolve(dirname, "cms/migrations"),
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
