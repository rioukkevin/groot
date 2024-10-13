"use client";

import { RootPage } from "@/modules/Root";
import { Screen } from "@/modules/Screen";
import { BackgroundProvider } from "@/modules/Screen/Background";
import IMGBackground from "@/assets/background.jpg";

export default function Home() {
  return (
    <BackgroundProvider defaultBackground={IMGBackground.src}>
      <Screen>
        <RootPage />
      </Screen>
    </BackgroundProvider>
  );
}
