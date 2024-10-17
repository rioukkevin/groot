import { getCurrentLocale } from "@/lib/locales/server";
import { Metadata } from "next";

const COMMON_METADATA: Metadata = {
  authors: [{ name: "RIOU Kevin" }],
  creator: "RIOU Kevin",
  publisher: "RIOU Kevin",
  alternates: {
    canonical: "/",
    languages: {
      en: "/en",
      fr: "/fr",
    },
  },
  robots: {
    index: false,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const FRENCH_METADATA: Metadata = {
  title: "RIOU Kevin - Portfolio",
  description:
    "Développeur web fullstack expérimenté présentant un portfolio diversifié de projets innovants. Spécialisé dans les technologies web modernes, le design responsive et les solutions backend évolutives. Explorez mon travail et découvrez comment je peux donner vie à vos idées numériques.",
  keywords: ["RIOU", "Kevin", "Portfolio", "Web", "Developer", "Freelance"],
  ...COMMON_METADATA,
};
const ENGLISH_METADATA: Metadata = {
  title: "RIOU Kevin - Portfolio",
  description:
    "Experienced fullstack web developer showcasing a diverse portfolio of innovative projects. Specializing in modern web technologies, responsive design, and scalable backend solutions. Explore my work and see how I can bring your digital ideas to life.",
  keywords: ["RIOU", "Kevin", "Portfolio", "Web", "Developer", "Freelance"],
  ...COMMON_METADATA,
};

export const getMetadata = () => {
  const lang = getCurrentLocale();

  return {
    ...(lang === "fr" ? FRENCH_METADATA : ENGLISH_METADATA),
  };
};
