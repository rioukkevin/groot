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

Vercel Postgres (Neon) for data, Vercel Blob for media. Set `POSTGRES_URL`,
`PAYLOAD_SECRET`, `NEXT_PUBLIC_SERVER_URL` and `BLOB_READ_WRITE_TOKEN`. With no
blob token the plugin stays off and uploads fall back to `public/uploads`,
which is the right behaviour locally and the wrong one in production — set it.

## Filling content

`@payloadcms/plugin-mcp` exposes the collections and both globals to an MCP
client. Media is create/read/update but **not** delete over MCP: an accidental
delete takes the blob with it.

## Where content lives today

The shell still reads `lib/terminal/content.ts`. The CMS is seeded and serving,
but nothing reads from it yet — that wiring is the next step, and until it
lands `content:export` → `cms:seed` is how the two are kept in step.
