import Head from "next/head";
import React, { CSSProperties } from "react";
import Me from "../components/functionnal/Me";
import Search from "../components/functionnal/Search";
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
      </Head>

      <main suppressHydrationWarning className={styles.container}>
        <Me />
        <Search />
      </main>
    </div>
  );
}
