import Head from "next/head";
import React, { CSSProperties, useState } from "react";
import Me from "../components/functionnal/Me";
import Nav from "../components/functionnal/Nav";
import Search from "../components/functionnal/Search";
import { Aluminium } from "../components/graphics/Aluminium/Aluminium";
import BarCode from "../components/graphics/BarCode";
import styles from "./index.module.scss";

export interface VariableCSS extends CSSProperties {
  "--is-dark": string;
}

export default function Home() {
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const handleSearchChangeIsVisible = (value: boolean) => {
    setIsSearchVisible(value);
  };

  return (
    <div>
      <Head>
        <title>Riiiou Kévin</title>
        <meta content="I am groot" name="description" />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <Search onChangeIsVisible={handleSearchChangeIsVisible} />
      <main suppressHydrationWarning className={styles.container}>
        <Aluminium
          bottom="0px"
          height="250px"
          left="5vw"
          position="absolute"
          width="150px"
        />
        <Aluminium
          height="40vh"
          position="absolute"
          right="-200px"
          top="0"
          width="300px"
        />
        <Nav isSearchVisible={isSearchVisible} />
        <BarCode />
        <Me />
      </main>
    </div>
  );
}
