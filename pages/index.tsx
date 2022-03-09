/* eslint-disable @next/next/no-script-component-in-head */
import Head from "next/head";
import Script from "next/script";
import React, { CSSProperties } from "react";
import Me from "../components/functionnal/Me";
import Search from "../components/functionnal/Search";
import { TRACKING_SCRIPT } from "../config/config";
import styles from "./index.module.scss";

export interface VariableCSS extends CSSProperties {
  "--is-dark": string;
}

export default function Home() {
  return (
    <div>
      <Head>
        <title>Riou Kévin</title>
        <meta content="I am groot" name="description" />
        <link href="/favicon.ico" rel="icon" />
        <Script id="track" strategy="afterInteractive">
          {TRACKING_SCRIPT}
        </Script>
      </Head>

      <main suppressHydrationWarning className={styles.container}>
        <Me />
        <Search />
      </main>
    </div>
  );
}
