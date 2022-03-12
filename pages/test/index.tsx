/* eslint-disable @next/next/no-script-component-in-head */
import Head from "next/head";
import React from "react";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Riou Kévin - Test</title>
        <meta content="I am groot" name="description" />
        <link href="/favicon.png" rel="icon" />
      </Head>

      <main suppressHydrationWarning>{"TOTO"}</main>
    </div>
  );
}
