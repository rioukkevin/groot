import "../styles/globals.css";
import type { AppProps } from "next/app";
import "../services/analytics";

// FA
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { useEffect } from "react";
import { analytics } from "../services/analytics";
import { useRouter } from "next/router";
import Transition from "../components/graphics/Transition";
import { TransitionProvider } from "../components/graphics/Transition/TransitionContext";
config.autoAddCss = false;

const MyApp = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  useEffect(() => {
    analytics.track("Page", {
      path: router.pathname,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <TransitionProvider>
      <Component {...pageProps} />
      <Transition />
    </TransitionProvider>
  );
};
export default MyApp;
