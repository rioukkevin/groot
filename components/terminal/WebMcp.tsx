"use client";

import { useEffect } from "react";

import { TOOLS } from "@/lib/mcp-tools";

import type { ShellContentData } from "@/lib/terminal/shell-content";

/**
 * Registers the site's tools with an in-page agent, when the browser has one.
 *
 * WebMCP puts `navigator.modelContext` in the page so a site can hand an agent
 * running alongside the user the same tools a remote agent gets over HTTP. No
 * shipping browser exposes it yet, so this is written to be inert: it checks,
 * registers if it can, and tears down on unmount. The tool definitions are the
 * shared ones, so an in-page agent and the MCP endpoint cannot answer
 * differently.
 */

interface ModelContext {
  registerTool?: (tool: {
    name: string;
    description: string;
    inputSchema: unknown;
    execute: (args: Record<string, unknown>) => Promise<{ content: { type: string; text: string }[] }>;
  }) => { unregister?: () => void } | void;
  provideContext?: (ctx: { tools: unknown[] }) => void;
}

export function WebMcp({ content }: { content: ShellContentData }) {
  useEffect(() => {
    const nav = navigator as Navigator & { modelContext?: ModelContext };
    const mc = nav.modelContext;
    if (!mc?.registerTool) return;

    const handles = TOOLS.map((t) =>
      mc.registerTool?.({
        name: t.name,
        description: t.description,
        inputSchema: t.inputSchema,
        execute: async (args) => ({
          content: [
            { type: "text", text: JSON.stringify(t.run(args, content), null, 2) },
          ],
        }),
      }),
    );

    return () => {
      for (const h of handles) h?.unregister?.();
    };
  }, [content]);

  return null;
}
