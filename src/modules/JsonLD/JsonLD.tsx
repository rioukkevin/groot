import { BreadcrumbJsonLd } from "next-seo";

export const JsonLD = () => {
  // const lang = getCurrentLocale();

  if (true) {
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

  // if (lang === "fr") {
  //   return (
  //     <BreadcrumbJsonLd
  //       useAppDir
  //       itemListElements={[
  //         {
  //           position: 1,
  //           name: "Home",
  //           item: "https://kevin.riou.pro",
  //         },
  //         {
  //           position: 1,
  //           name: "French",
  //           item: "https://kevin.riou.pro/fr",
  //         },
  //       ]}
  //     />
  //   );
  // }

  return <></>;
};
