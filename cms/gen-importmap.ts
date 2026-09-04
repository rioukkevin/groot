/**
 * Regenerates app/(payload)/admin/[[...segments]]/importMap.js.
 *
 * `payload generate:importmap` cannot load this config under Node 24 or bun's
 * loaders here (see gen-types.ts), so the generator is imported from its
 * built path and run under bun. `next dev` regenerates the map on start as
 * well; this is for a build that has not run dev since a plugin changed.
 *
 *   bun run cms:importmap
 */
import "lexical";

import { generateImportMap } from "../node_modules/payload/dist/bin/generateImportMap/index.js";

import config from "@payload-config";
await generateImportMap(await config, { force: true, log: true });
process.exit(0);
