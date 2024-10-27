import { RootPage } from "@/modules/Root";
import { Screen } from "@/modules/Screen";
import IMGBackground from "@/assets/background.jpg";
import { BackgroundProvider } from "@/modules/Theme";
import { LoadingOverlay } from "@/modules/Loading";
import { ScreenSizeWarning } from "@/modules/Screen/ScreenSizeWarning";
import { Metadata } from "next";
import { METADATA } from "@/modules/Metadata/metadata";
import { BreadcrumbJsonLd } from "next-seo";
import { ChatUserProvider } from "@/modules/Root/Windows/ChatWindow";
import { Clock, Widgets } from "@/modules/Widgets";
import { Cookies } from "@/modules/Cookies";

export const metadata: Metadata = METADATA;

export default function TestPage() {
  return (
    <ChatUserProvider>
      <BackgroundProvider defaultBackground={IMGBackground.src}>
        <BreadcrumbJsonLd
          useAppDir
          itemListElements={[
            {
              position: 1,
              name: "Home",
              item: "https://kevin.riou.pro",
            },
          ]}
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
