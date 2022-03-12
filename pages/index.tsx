/* eslint-disable @next/next/no-script-component-in-head */
import Head from "next/head";
// import Script from "next/script";
import React from "react";
import Me from "../components/functionnal/Me";
import Search from "../components/functionnal/Search";
import styles from "./index.module.scss";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Riou Kévin</title>
        <meta content="I am groot" name="description" />
        <link href="/favicon.png" rel="icon" />
      </Head>

      <main suppressHydrationWarning className={styles.container}>
        <Me />
        <Search />
      </main>
    </div>
  );
}
