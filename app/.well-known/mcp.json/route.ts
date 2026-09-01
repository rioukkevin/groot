import { SITE_URL } from "@/lib/seo";
import { toolManifest } from "@/lib/mcp-tools";

/**
 * Discovery document. An agent that finds the site can learn it speaks MCP
 * without being told, which is the point of putting it under /.well-known.
 */
export function GET() {
  return Response.json(
    {
      name: "kevin-riou-portfolio",
      description:
        "Read-only tools describing Kévin Riou, freelance fullstack web and mobile developer, Paris.",
      version: "1.0.0",
      protocolVersion: "2024-11-05",
      endpoints: { jsonrpc: `${SITE_URL}/api/mcp` },
      documentation: `${SITE_URL}/llms.txt`,
      languages: ["en", "fr"],
      readOnly: true,
      tools: toolManifest().map((t) => ({
        name: t.name,
        description: t.description,
      })),
    },
    { headers: { "cache-control": "public, max-age=3600" } },
  );
}
