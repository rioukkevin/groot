"use client";

import { RootPage } from "@/modules/Root";
import { Screen } from "@/modules/Screen";
import IMGBackground from "@/assets/background.jpg";
import { BackgroundProvider } from "@/modules/Theme/Background";
import { LoadingOverlay } from "@/modules/Loading";
import { Cookies } from "@/modules/Cookies";

export default function Home() {
  return (
    <BackgroundProvider defaultBackground={IMGBackground.src}>
      <LoadingOverlay />
      <Screen>
        <Cookies />
        <RootPage />
      </Screen>
    </BackgroundProvider>
  );
}
