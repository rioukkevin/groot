import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useRef } from "react";
import Container from "../../components/graphics/Container";
import { TransitionContext } from "../../components/graphics/Transition/TransitionContext";
import { datas } from "../../data/projects";
import styles from "./slug.module.scss";

export default function Project() {
  const router = useRouter();

  const project = datas.find((d) => d.slug === router.query.slug);
  const containerRef = useRef(null);
  const transitions = useContext(TransitionContext);

  if (!project) return <></>;

  const handleBack = () => {
    transitions.trigger({
      type: "SlideLeft",
      ref: containerRef.current,
      callback: () => {
        router.push(`/`);
      },
    });
  };

  return (
    <div>
      <Head>
        <title>Riou Kévin | Project</title>
        <meta content="I am groot" name="description" />
        <link href="/favicon.png" rel="icon" />
      </Head>

      <main suppressHydrationWarning className={styles.container}>
        <div className={styles.backButton} onClick={handleBack}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </div>
        <Container reff={containerRef}>
          <h1>{project?.name}</h1>
        </Container>
      </main>
    </div>
  );
}
