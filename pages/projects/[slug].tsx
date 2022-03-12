import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";

export default function Project() {
  const router = useRouter();

  console.log(router.query.slug);

  return (
    <div>
      <Head>
        <title>Riou Kévin | Project</title>
        <meta content="I am groot" name="description" />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <main suppressHydrationWarning>{router.pathname}</main>
    </div>
  );
}
