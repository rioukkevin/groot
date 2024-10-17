import { getCurrentLocale } from "@/lib/locales/server";
import { BreadcrumbJsonLd } from "next-seo";

export const JsonLD = () => {
  const lang = getCurrentLocale();

  if (lang === "en") {
    return (
      <BreadcrumbJsonLd
        useAppDir
        itemListElements={[
          {
            position: 1,
            name: "Home",
            item: "https://kevin.riou.pro",
          },
          {
            position: 1,
            name: "English",
            item: "https://kevin.riou.pro/en",
          },
        ]}
      />
    );
  }

  if (lang === "fr") {
    return (
      <BreadcrumbJsonLd
        useAppDir
        itemListElements={[
          {
            position: 1,
            name: "Home",
            item: "https://kevin.riou.pro",
          },
          {
            position: 1,
            name: "French",
            item: "https://kevin.riou.pro/fr",
          },
        ]}
      />
    );
  }

  return <></>;
};
