"use client";

import { RootPage } from "@/modules/Root";
import { Screen } from "@/modules/Screen";
import IMGBackground from "@/assets/background.jpg";
import { BackgroundProvider } from "@/modules/Theme/Background";

export default function Home() {
  return (
    <BackgroundProvider defaultBackground={IMGBackground.src}>
      <Screen>
        <RootPage />
      </Screen>
    </BackgroundProvider>
  );
}
