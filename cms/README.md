# CMS

Payload 3 on Postgres, serving two locales (`en`, `fr`) with English as the
fallback. Content and interface wording are kept apart on purpose: **Site
content** is what the site says about Kévin, **UI text** is what the interface
says about itself.

## Local

```bash
bun run db:up          # postgres 16 on :5433 (5432 is usually taken)
cp .env.example .env.local && $EDITOR .env.local
bun run cms:seed       # first admin + the English content
bun run dev            # /admin
```

`PAYLOAD_SECRET` signs sessions — generate with `openssl rand -base64 32`.
`SEED_ADMIN_PASSWORD` must be 12 characters or more; delete both seed vars once
the admin exists.

## Production

Neon Postgres for data, Vercel Blob (public) for media. The Neon integration
injects `DATABASE_URL`; the Blob store injects `BLOB_READ_WRITE_TOKEN`. Set
`PAYLOAD_SECRET`, `NEXT_PUBLIC_SERVER_URL` and `RESEND_API_KEY` by hand; the
Resend key also carries Payload's own mail (admin password resets) from
`contact@nare.li`. With
no blob token the plugin stays off and uploads fall back to `public/uploads`,
which is the right behaviour locally and the wrong one in production — set it.
The blob store must be public: the plugin only supports public access, and the
shell draws the images onto canvases, which needs the CORS headers a public
store sends.

### Import map

The admin loads plugin components through `app/(payload)/admin/importMap.js`,
which is generated, not written. Regenerate it after adding a plugin or a
custom component:

```bash
bun run cms:importmap
```

The Blob plugin stays in the config even with no token — disabled, uploads go
to disk — so the map generated on a laptop carries the same client upload
handler production needs. `next dev` regenerates the map on start too.

### Migrations

Development pushes the schema straight to Postgres; production never does, it
runs `cms/migrations/`. Vercel picks up the `vercel-build` script, which
applies pending migrations and then builds, so the tables exist when `/en`
and `/fr` prerender. After a schema change:

```bash
bun run migrate:create <name>   # diff against the last snapshot → cms/migrations/
```

Commit the generated `.ts` and `.json`. `bun run migrate` applies them to a
database that was created by migrations; do not run it against the local dev
database, which was pushed.

### First deploy

Once the build is green, seed the live database from your machine:

```bash
vercel env pull .env.production.local
bun run --env-file=.env.production.local cms/seed.ts
```

then delete `SEED_ADMIN_*` from that file.

## Filling content over MCP

`@payloadcms/plugin-mcp` serves the CMS to an MCP client at `/api/mcp`,
behind a bearer API key. Mint one in the admin under **MCP → API keys** and
tick, per collection and global, what that key may do. Media is
create/read/update but **not** delete over MCP: an accidental delete takes the
blob with it.

```bash
claude mcp add --transport http groot-cms https://<your-domain>/api/mcp \
  --header "Authorization: Bearer <api key>"
```

Locally the same with `http://localhost:3001/api/mcp`. Every collection and
global carries a description in `payload.config.ts` so a client knows what
each one holds without opening it.

The site's own MCP server — the read-only tools that describe Kévin to anyone,
no key — is a different thing at `/api/portfolio-mcp`, advertised by
`/.well-known/mcp.json` and `/llms.txt`.

## Content pack

`bun run content:pack` exports everything the CMS holds, both languages, as a
folder a person can read: one folder per project with its write-up and its
screenshots, then roles, education, skills, the site profile and the UI text,
plus a zip of it all — `content-export/pack/` and
`content-export/content-pack.zip`, both ignored by git.

## Where content lives today

The shell still reads `lib/terminal/content.ts`. The CMS is seeded and serving,
but nothing reads from it yet — that wiring is the next step, and until it
lands `content:export` → `cms:seed` is how the two are kept in step.
