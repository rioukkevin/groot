"use client";

import mixpanel from "mixpanel-browser";
import { v4 as uuidv4 } from "uuid";

const MIXPANEL_LOCALE_STORAGE_KEY = "mixpanel_browser_id";

mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_PROJECT_ID ?? "", {
  debug: false,
  track_pageview: true,
  persistence: "localStorage",
  ignore_dnt: true,
});

// const actions = {
//   identify: (id: string) => {
//     mixpanel.identify(id);
//   },
//   track: (name: string, props: Record<string, string>) => {
//     mixpanel.track(name, props);
//   },
//   pageView: () => {
//     mixpanel.track_pageview();
//   },
// };

export const identifyBrowser = () => {
  const existingId = localStorage.getItem(MIXPANEL_LOCALE_STORAGE_KEY);

  if (existingId) {
    mixpanel.identify(existingId);
    return;
  }

  const uuid = uuidv4();
  localStorage.setItem(MIXPANEL_LOCALE_STORAGE_KEY, uuid);
  mixpanel.identify(uuid);
  mixpanel.people.set({
    $browser: window.navigator.userAgent,
    $screen_resolution: `${window.screen.width}x${window.screen.height}`,
    $referring_domain: window.location.hostname,
    $name: uuid,
  });
};

// actions.pageView();
console.log("mixpanel initialized");

// export const Mixpanel = actions;
