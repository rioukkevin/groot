/**
 * Regenerates app/(payload)/admin/[[...segments]]/importMap.js.
 *
 * `payload generate:importmap` cannot load this config under Node 24 or bun's
 * loaders here (see gen-types.ts), so the generator is imported from its
 * built path and run under bun. The Blob plugin is forced on for the
 * generation: it is off locally for want of a token, and an import map
 * generated without it lacks the plugin's client upload component, which the
 * production admin then cannot find.
 *
 *   bun run cms:importmap
 */
import "lexical";

import { generateImportMap } from "../node_modules/payload/dist/bin/generateImportMap/index.js";

// The adapter checks the token's shape even though it never uploads here.
process.env.BLOB_READ_WRITE_TOKEN ||= "vercel_blob_rw_importmap_generation";

const { default: config } = await import("@payload-config");
await generateImportMap(await config, { force: true, log: true });
process.exit(0);
