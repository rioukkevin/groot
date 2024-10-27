"use server";

import { Heading, Hr, Text } from "@react-email/components";
import * as React from "react";
import { FC } from "react";

import { getScopedI18n } from "@/lib/locales/server";

import { EmailProps } from "./email";
import { EmailBase } from "./EmailBase";

type EmailSubscribedProps = EmailProps;

export const EmailSubscribed: FC<EmailSubscribedProps> = async ({
  lang,
  to,
  baseUrl,
  preview,
  subject,
  from,
}) => {
  const t = await getScopedI18n("email.subscribed");

  return (
    <EmailBase {...{ lang, baseUrl, from, to, preview, subject }}>
      <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
        {t("subject")}
      </Heading>
      <Text className="text-[14px] leading-[24px] text-black">Hello {to},</Text>
      <Text className="text-[14px] leading-[24px] text-black">
        {t("message")} {to}
      </Text>
      <Text className="text-[14px] leading-[24px] text-black">
        {t("updates")}
      </Text>
      <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
      <Text className="text-[14px] leading-[24px] text-black">
        {t("greeting")}
      </Text>
    </EmailBase>
  );
};

export default EmailSubscribed;
