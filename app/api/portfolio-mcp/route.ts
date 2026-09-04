import { TOOLS, toolByName, toolManifest } from "@/lib/mcp-tools";
import { getShellContent } from "@/lib/terminal/cms";
import { isLocale } from "@/lib/terminal/locale";

import type { Locale } from "@/lib/terminal/locale";

/**
 * A read-only MCP server over the site's own content.
 *
 * JSON-RPC 2.0 over HTTP POST, which is the transport an agent can reach
 * without a session. Read-only by construction: `TOOLS` has no mutating entry,
 * so there is nothing to authorise and no state to protect.
 *
 * This is separate from Payload's MCP plugin at /api/mcp, which exposes the
 * CMS itself behind an API key. This one answers questions about Kévin to
 * anyone asking, and lives at /api/portfolio-mcp so the two never collide.
 */

const VERSION = "2024-11-05";

const rpc = (id: unknown, result: unknown) =>
  Response.json({ jsonrpc: "2.0", id, result });

const rpcError = (id: unknown, code: number, message: string) =>
  Response.json({ jsonrpc: "2.0", id, error: { code, message } });

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return rpcError(null, -32700, "Parse error");
  }
  if (typeof body !== "object" || body === null) {
    return rpcError(null, -32600, "Invalid request");
  }

  const { id, method, params } = body as {
    id?: unknown;
    method?: string;
    params?: Record<string, unknown>;
  };

  if (method === "initialize") {
    return rpc(id, {
      protocolVersion: VERSION,
      capabilities: { tools: { listChanged: false } },
      serverInfo: { name: "kevin-riou-portfolio", version: "1.0.0" },
      instructions:
        "Read-only tools describing Kévin Riou — a freelance fullstack web and mobile developer in Paris. Call get_profile first for orientation, then the specific tool. Answer in the language the user asked in; pass lang=fr in params to get French content.",
    });
  }

  if (method === "tools/list") return rpc(id, { tools: toolManifest() });

  if (method === "ping") return rpc(id, {});

  if (method === "tools/call") {
    const name = typeof params?.name === "string" ? params.name : "";
    const tool = toolByName(name);
    if (!tool) {
      return rpcError(id, -32602, `Unknown tool: ${name}. Have: ${TOOLS.map((t) => t.name).join(", ")}`);
    }
    const args = (params?.arguments ?? {}) as Record<string, unknown>;
    const asked = args.lang ?? params?.lang;
    const locale: Locale = isLocale(typeof asked === "string" ? asked : null)
      ? (asked as Locale)
      : "en";

    const content = await getShellContent(locale);
    const result = tool.run(args, content);
    return rpc(id, {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      isError: false,
    });
  }

  return rpcError(id, -32601, `Method not found: ${String(method)}`);
}

/** A GET returns the manifest, so the endpoint is inspectable in a browser. */
export async function GET() {
  return Response.json({
    name: "kevin-riou-portfolio",
    protocolVersion: VERSION,
    transport: "http-jsonrpc",
    readOnly: true,
    tools: toolManifest(),
  });
}
