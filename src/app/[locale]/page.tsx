import { Metadata } from "next";
import { BreadcrumbJsonLd } from "next-seo";

import IMGBackground from "@/assets/background.jpg";
import { Cookies } from "@/modules/Cookies";
import { LoadingOverlay } from "@/modules/Loading";
import { METADATA } from "@/modules/Metadata/metadata";
import { RootPage } from "@/modules/Root";
import { ChatUserProvider } from "@/modules/Root/Windows/ChatWindow";
import { Screen } from "@/modules/Screen";
import { ScreenSizeWarning } from "@/modules/Screen/ScreenSizeWarning";
import { BackgroundProvider } from "@/modules/Theme";
import { Clock, Widgets } from "@/modules/Widgets";

export const metadata: Metadata = METADATA;

export default function TestPage() {
  return (
    <ChatUserProvider>
      <BackgroundProvider defaultBackground={IMGBackground.src}>
        <BreadcrumbJsonLd
          itemListElements={[
            {
              position: 1,
              name: "Home",
              item: "https://kevin.riou.pro",
            },
          ]}
          useAppDir
        />
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
    </ChatUserProvider>
  );
}
