/**
 * Migrations without the Payload CLI, which does not start under bun's or
 * Node 24's loaders here. Same API the CLI calls.
 *
 *   bun run --env-file=.env.local cms/migrate.ts create <name>   # write cms/migrations/*
 *   bun run cms/migrate.ts run                                    # apply pending ones
 *
 * `vercel-build` runs the second form before `next build`, so the tables
 * exist when the pages prerender.
 */
// Evaluated first on purpose: Bun 1.3 trips over the lexical ↔ @lexical/react
// import cycle when @lexical/react happens to load first ("Cannot access 't'
// before initialization"). Settling `lexical` here puts the cycle in the
// order Node would have used.
import "lexical";

import { getPayload } from "payload";

import config from "@payload-config";

const [mode, name] = process.argv.slice(2);

const payload = await getPayload({ config });
if (mode === "create") {
  if (!name) throw new Error("usage: cms/migrate.ts create <name>");
  await payload.db.createMigration({ payload, migrationName: name, forceAcceptWarning: true });
} else if (mode === "run") {
  await payload.db.migrate();
} else {
  throw new Error("usage: cms/migrate.ts create <name> | run");
}
await payload.db.destroy?.();
process.exit(0);
