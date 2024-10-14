import { LinkedinIcon, MailIcon, PhoneIcon, TwitterIcon } from "lucide-react";
import { ReactNode, useMemo } from "react";

export interface ContactData {
  label: string;
  value: string;
  href?: string;
  icon: ReactNode;
}

export const useContactData = () => {
  const contactData = useMemo<ContactData[]>(
    () => [
      {
        label: "Email",
        value: "kevin@ooof.dev",
        href: "mailto:kevin@ooof.dev",
        icon: <MailIcon />,
      },
      {
        label: "Phone",
        value: "+33 6 99 01 13 80",
        href: "tel:+33699011380",
        icon: <PhoneIcon />,
      },
      {
        label: "Linkedin",
        value: "@kevinatooof",
        href: "https://www.linkedin.com/in/kevinatooof",
        icon: <LinkedinIcon />,
      },
      {
        label: "Twitter",
        value: "@kevinatooof",
        href: "https://twitter.com/kevinatooof",
        icon: <TwitterIcon />,
      },
    ],
    [],
  );

  return contactData;
};
