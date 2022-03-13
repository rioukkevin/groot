import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TextInput } from "@mantine/core";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Dropzone } from "../components/functionnal/Dropzone/Dropzone";
import RTE from "../components/functionnal/RTE/RTE";
import Container from "../components/graphics/Container";
import styles from "./freelance.module.scss";

interface IForm {
  subject: string;
  content: string;
  coordinates: string;
  attachments?: File[];
}

export default function Freelance() {
  const router = useRouter();

  const [formContent, setFormContent] = useState<IForm>({
    subject: "",
    content: "",
    coordinates: "",
  });

  const handleBack = () => router.push(`/`);

  const handleChange = (property: keyof IForm) => (v: any) => {
    setFormContent((oldValue) => ({ ...oldValue, [property]: v }));
  };

  const toBase64 = (file: File) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleLocalSubmit = async () => {
    const attachments = await Promise.all(
      (formContent.attachments ?? []).map(async (a) => ({
        name: a.name,
        type: a.type,
        base64: await toBase64(a),
      }))
    );
    await await fetch("/api/freelance", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ...formContent,
        attachments,
      }),
    });
  };

  return (
    <div>
      <Head>
        <title>Riou Kévin | Freelance</title>
        <meta content="I am groot" name="description" />
        <link href="/favicon.png" rel="icon" />
      </Head>

      <main suppressHydrationWarning className={styles.container}>
        <div className={styles.backButton} onClick={handleBack}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </div>
        <Container reff={null}>
          <h1>Demande de Freelance</h1>
          <p>
            {
              "Je suis ouvert aux missions de Freelance, si vous souhaitez que nous travaillons ensemble sur votre projet, n'hésitez pas à me contacter avec le formulaire ci-dessous"
            }
          </p>
          {true && (
            <div className={styles.form}>
              <h3>Coordonnées</h3>
              <TextInput
                required
                autoComplete="email"
                placeholder="Téléphone, Email..."
                value={formContent.coordinates}
                variant="filled"
                onChange={(e) => handleChange("coordinates")(e.target.value)}
              />
              <h3>Sujet</h3>
              <TextInput
                required
                autoComplete="none"
                placeholder="Demande de prestation pour..."
                value={formContent.subject}
                variant="filled"
                onChange={(e) => handleChange("subject")(e.target.value)}
              />
              <h3>Contenu</h3>
              <RTE
                className={styles.rte}
                controls={[
                  ["bold", "italic", "underline", "strike"],
                  ["orderedList", "unorderedList"],
                  ["h1", "h2", "h3"],
                  ["alignLeft", "alignCenter", "alignRight"],
                  ["link"],
                ]}
                value={formContent.content}
                onChange={handleChange("content")}
              />
              <h3>Pièces jointes</h3>
              <Dropzone
                value={formContent.attachments ?? []}
                onChange={handleChange("attachments")}
              />
              <div className={styles.submitButton} onClick={handleLocalSubmit}>
                Envoyer
              </div>
            </div>
          )}
        </Container>
      </main>
    </div>
  );
}
