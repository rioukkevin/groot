"use server";

import {
  Html,
  Tailwind,
  Container,
  Head,
  Preview,
  Body,
  Section,
  Img,
  Link,
} from "@react-email/components";
import React, { FC } from "react";

import { getScopedI18n } from "@/lib/locales/server";

import { EmailProps, getUnsubscribeLink } from "./email";

const ICON_SIZE = 140;

type EmailBaseProps = EmailProps & React.PropsWithChildren;

export const EmailBase: FC<EmailBaseProps> = async ({
  baseUrl,
  to,
  preview,
  children,
  lang,
}) => {
  const t = await getScopedI18n("email.common");

  const unsubscribeLink = await getUnsubscribeLink(baseUrl, lang, to);

  return (
    <Tailwind>
      <Html lang={lang}>
        <Head />
        <Preview>{preview}</Preview>
        <Body className="m-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Section>
              <Img
                alt="logo"
                className="mx-auto my-10"
                height={ICON_SIZE}
                src={`${baseUrl}/icon.png`}
                width={ICON_SIZE}
              />
            </Section>
            {children}
          </Container>
          {!!unsubscribeLink && (
            <Section className="w-full">
              <Link className="mx-auto text-center" href={unsubscribeLink}>
                {t("unsubscribe")}
              </Link>
            </Section>
          )}
        </Body>
      </Html>
    </Tailwind>
  );
};
