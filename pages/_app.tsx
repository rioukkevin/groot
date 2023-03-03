import "../styles/globals.css";
import type { AppProps } from "next/app";
import Script from "next/script";
import { SettingsProvider } from "../components/Settings";
import { useEffect } from "react";
import { TranslationsProvider } from "../translations/Translations";
import { storyblokInit, apiPlugin } from "@storyblok/react";
import { StoryblokComponents } from "../storyblok";

storyblokInit({
  accessToken: "lDceqJHP7uC0ORGXIV5hxwtt",
  use: [apiPlugin],
  components: StoryblokComponents,
});

const GTM_ID = "GTM-W95S4H2";

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", function () {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          registrations.forEach((registration) => {
            registration.unregister();
          });
        });
      });
    }
  });

  return (
    <>
      <Script id="google-tag-manager" strategy="afterInteractive">
        {`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${GTM_ID}');
      `}
      </Script>
      <SettingsProvider>
        <TranslationsProvider>
          <Component {...pageProps} />
        </TranslationsProvider>
      </SettingsProvider>
    </>
  );
}

export default MyApp;
