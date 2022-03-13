import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import Container from "../../components/graphics/Container";
import { datas } from "../../data/projects";
import styles from "./slug.module.scss";

export default function Project() {
  const router = useRouter();

  const project = datas.find((d) => d.slug === router.query.slug);

  if (!project) console.log("REDIRECT");

  return (
    <div>
      <Head>
        <title>Riou Kévin | Project</title>
        <meta content="I am groot" name="description" />
        <link href="/favicon.png" rel="icon" />
      </Head>

      <main suppressHydrationWarning className={styles.container}>
        <div className={styles.backButton}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </div>
        <Container>
          <h1>{project?.name}</h1>
        </Container>
      </main>
    </div>
  );
}
