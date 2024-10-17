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
import { METADATA } from "@/modules/Metadata/metadata";
import { BreadcrumbJsonLd } from "next-seo";

export const metadata: Metadata = METADATA;

export default function Home() {
  return (
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
  );
}
