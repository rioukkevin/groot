/* Payload's admin runs in its own route group with its own root layout — the
   site's lives in app/(site) — so the terminal's global stylesheet and
   monospace font never reach it. */
import { RootLayout, handleServerFunctions } from "@payloadcms/next/layouts";
import React from "react";

import config from "@payload-config";

import { importMap } from "./admin/importMap";

import type { ServerFunctionClient } from "payload";

import "@payloadcms/next/css";

const serverFunction: ServerFunctionClient = async function (args) {
  "use server";
  return handleServerFunctions({ ...args, config, importMap });
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
      {children}
    </RootLayout>
  );
}
