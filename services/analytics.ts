import Analytics from "analytics";
import mixpanelPlugin from "@analytics/mixpanel";
import { Router } from "next/router";

export const analytics = Analytics({
  app: "portfolio",
  debug: true,
  plugins: [
    mixpanelPlugin({
      token: process.env.NEXT_PUBLIC_ANALYTICS_TOKEN,
    }),
  ],
});

Router.events.on("routeChangeComplete", (path) => {
  analytics.track("Page", {
    path,
  });
});
