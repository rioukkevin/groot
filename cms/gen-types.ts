/**
 * Generates cms/payload-types.ts.
 *
 * `payload generate:types` cannot load this config under Node 24 — it requires
 * the module and hits ERR_REQUIRE_ASYNC_MODULE. The generator is not on the
 * package barrel either, so it is imported from its built path and run under
 * bun, which handles the ESM config natively.
 *
 *   bun run cms:types
 */
import { generateTypes } from "../node_modules/payload/dist/bin/generateTypes.js";

import config from "@payload-config";

const run = async () => {
  await generateTypes(await config, { log: true });
  process.exit(0);
};

run().catch((e: unknown) => {
  console.error(e);
  process.exit(1);
});
