import { RootPage } from "@/modules/Root";
import { Screen } from "@/modules/Screen";
import IMGBackground from "@/assets/background.jpg";
import { BackgroundProvider } from "@/modules/Theme/Background";
import { LoadingOverlay } from "@/modules/Loading";
import { Cookies } from "@/modules/Cookies";
import { Widgets } from "@/modules/Widgets";
import { Clock } from "@/modules/Widgets/Clock";
import { ScreenSizeWarning } from "@/modules/Screen/ScreenSizeWarning";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "RIOU Kevin - Portfolio",
  description:
    "Experienced fullstack web developer showcasing a diverse portfolio of innovative projects. Specializing in modern web technologies, responsive design, and scalable backend solutions. Explore my work and see how I can bring your digital ideas to life.",
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

export default function Home() {
  return (
    <BackgroundProvider defaultBackground={IMGBackground.src}>
      <LoadingOverlay />
      <Screen>
        <Widgets>
          <Clock />
        </Widgets>
        <Cookies />
        <RootPage />
      </Screen>
      <ScreenSizeWarning />
    </BackgroundProvider>
  );
}
