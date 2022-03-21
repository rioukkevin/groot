import { faArrowLeft, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Group, Stepper, TextInput } from "@mantine/core";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import ContentEditable from "react-contenteditable";
import { Dropzone } from "../components/functionnal/Dropzone/Dropzone";
import RTE from "../components/functionnal/RTE/RTE";
import Container from "../components/graphics/Container";
import styles from "./freelance.module.scss";

interface IForm {
  name: string;
  subject: string;
  content: string;
  coordinates: string;
  attachments?: File[];
}

export default function Freelance() {
  const router = useRouter();

  const [isSended, setIsSended] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formContent, setFormContent] = useState<IForm>({
    name: "",
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
    // TODO add file size test
    // TODO handle errors
    // TODO handle max files

    if (isLoading || isSended) return;
    setIsLoading(true);
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
    setIsLoading(false);
    setIsSended(true);
  };

  const [active, setActive] = useState(0);
  const nextStep = () =>
    setActive((current) => (current < 5 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

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
          <Stepper
            active={active}
            breakpoint="sm"
            radius="xs"
            size="xs"
            onStepClick={setActive}
          >
            <Stepper.Step label="Nom">
              <span>{"Je m'appelle"}</span>
              <ContentEditable
                className={`${styles.input} ${
                  isLoading || isSended ? styles.lock : ""
                } ${formContent.name.length < 3 ? styles.block : ""}`}
                disabled={isLoading || isSended}
                html={formContent.name}
                tagName="span"
                onChange={(e) =>
                  handleChange("name")(e.currentTarget.innerText)
                }
              />
            </Stepper.Step>
            <Stepper.Step label="Sujet">
              <span>
                {"je cherche un freelance pour une mission dont l'objectif est"}
              </span>
              <ContentEditable
                className={`${styles.input} ${
                  isLoading || isSended ? styles.lock : ""
                } ${formContent.subject.length < 3 ? styles.block : ""}`}
                disabled={isLoading || isSended}
                html={formContent.subject}
                tagName="span"
                onChange={(e) =>
                  handleChange("subject")(e.currentTarget.innerText)
                }
              />
            </Stepper.Step>
            <Stepper.Step label="Détails">
              <div className={styles.paragraph}>
                <span>{"En détail celà donne: "}</span>
              </div>
              <RTE
                className={`${styles.rte} ${
                  isLoading || isSended ? styles.rteDisabled : ""
                }`}
                controls={[
                  ["bold", "italic", "underline", "strike"],
                  ["orderedList", "unorderedList"],
                  ["h1", "h2", "h3"],
                  ["alignLeft", "alignCenter", "alignRight"],
                  ["link"],
                ]}
                readOnly={isLoading || isSended}
                value={formContent.content}
                onChange={handleChange("content")}
              />
            </Stepper.Step>
            <Stepper.Step label="Pièces jointes">
              <div className={styles.paragraph}>
                <span>{"Quelques pièces jointes: "}</span>
              </div>
              <Dropzone
                disabled={isLoading || isSended}
                value={formContent.attachments ?? []}
                onChange={handleChange("attachments")}
              />
            </Stepper.Step>
            <Stepper.Step label="Coordonnées">
              <span>{"Recontacte moi ici"}</span>
              <span
                className={`${styles.input} ${
                  isLoading || isSended ? styles.lock : ""
                }`}
                contentEditable={!isLoading && !isSended}
                role="textbox"
                style={{
                  display:
                    formContent.coordinates.length < 1
                      ? "inline-block"
                      : "inline",
                }}
                onInput={(e) =>
                  handleChange("coordinates")(e.currentTarget.innerText)
                }
              ></span>
            </Stepper.Step>
          </Stepper>

          <Group mt="xl" position="center">
            <Button variant="default" onClick={prevStep}>
              Back
            </Button>
            <Button onClick={nextStep}>Next step</Button>
          </Group>
          {/* <h1 className={styles.title}>
            {"Demande de contrat Freelance".split(" ").map((t) => (
              <span key={t}>{t}&nbsp;</span>
            ))}
          </h1> */}
          {/* {true && (
            <div className={styles.form}>
              <div className={styles.submitButton} onClick={handleLocalSubmit}>
                {isLoading && <FontAwesomeIcon icon={faSpinner} spin={true} />}
                {!isLoading && !isSended && "Envoyer"}
                {isSended && !isLoading && "Merci !"}
              </div>
            </div>
          )} */}
        </Container>
      </main>
    </div>
  );
}
