import "../styles/globals.css";
import type { AppProps } from "next/app";
import Script from "next/script";
import { SettingsProvider } from "../components/Settings";

const GTM_ID = "GTM-W95S4H2";

navigator.serviceWorker.getRegistrations().then((registrations) => {
  registrations.forEach((registration) => {
    registration.unregister();
  });
});

function MyApp({ Component, pageProps }: AppProps) {
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
        <Component {...pageProps} />
      </SettingsProvider>
    </>
  );
}

export default MyApp;
