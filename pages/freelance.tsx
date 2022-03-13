import { useForm } from "@formspree/react";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MenuLabel, TextInput } from "@mantine/core";
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
    attachments: [],
  });

  const handleBack = () => router.push(`/`);

  const handleChange = (property: keyof IForm) => (v: any) => {
    setFormContent((oldValue) => ({ ...oldValue, [property]: v }));
  };

  // TODO remove formspree from code
  // TODO serverless nextjs function to send mail
  // TODO file handling in string into attachments on sending mail
  const [state, handleSubmit] = useForm(
    process.env.NEXT_PUBLIC_FORM_FREELANCE ?? "",
    {
      data: { ...formContent, attachments: "" },
    }
  );

  const handleLocalSubmit = () => {
    handleSubmit({});
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
          {!state.succeeded && (
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
