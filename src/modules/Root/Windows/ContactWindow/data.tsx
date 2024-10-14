import { LinkedinIcon, MailIcon, PhoneIcon, TwitterIcon } from "lucide-react";
import { ReactNode, useMemo } from "react";
import { useScopedI18n } from "@/lib/locales/client";

export interface ContactData {
  label: string;
  value: string;
  href?: string;
  icon: ReactNode;
}

export const useContactData = () => {
  const t = useScopedI18n("contact");

  const contactData = useMemo<ContactData[]>(
    () => [
      {
        label: t("email.label"),
        value: t("email.value"),
        href: "mailto:kevin@ooof.dev",
        icon: <MailIcon />,
      },
      {
        label: t("phone.label"),
        value: t("phone.value"),
        href: "tel:+33699011380",
        icon: <PhoneIcon />,
      },
      {
        label: t("linkedin.label"),
        value: t("linkedin.value"),
        href: "https://www.linkedin.com/in/kevinatooof",
        icon: <LinkedinIcon />,
      },
      {
        label: t("twitter.label"),
        value: t("twitter.value"),
        href: "https://twitter.com/kevinatooof",
        icon: <TwitterIcon />,
      },
    ],
    [t],
  );

  return contactData;
};
