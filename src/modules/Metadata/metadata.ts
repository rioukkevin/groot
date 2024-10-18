import { Metadata } from "next";

export const METADATA: Metadata = {
  title: "RIOU Kevin - Portfolio",
  description:
    "Développeur web fullstack expérimenté présentant un portfolio diversifié de projets innovants. Spécialisé dans les technologies web modernes, le design responsive et les solutions backend évolutives. Explorez mon travail et découvrez comment je peux donner vie à vos idées numériques.",
  keywords: ["RIOU", "Kevin", "Portfolio", "Web", "Developer", "Freelance"],
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
  openGraph: {
    siteName: "RIOU Kevin - Portfolio",
    url: `${process.env.NEXT_PUBLIC_URL}`,
    type: "website",
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
