"use client";
import React, { FC, PropsWithChildren, useEffect } from "react";
import { umamiAnalyticsContextFactory as umami } from "umami-analytics-next";

const events = [
  "subscribe",
  "unsubscribe", // Not implemented, should be done server-side
  "windowOpen",
  "windowClose",
  "windowFocus",
  "windowToggleFullscreen",
  "changeLanguage",
  "changeBackground",
  "changePseudonyme",
  "chatMessage",
  "ticTacToeWin",
  "ticTacToeLoss",
  "ticTacToeDraw",
  "visit",
] as const;

export const { UmamiAnalyticsContext, UmamiAnalyticsProvider, useUmami } =
  umami(events);

export const UmamiKey = process.env.NEXT_PUBLIC_UMAMI_KEY! as string;
export const UmamiUrl = process.env.NEXT_PUBLIC_UMAMI_URL! as string;

const PageView = () => {
  const { track } = useUmami();

  useEffect(() => {
    if (track) {
      track("visit");
    }
  }, [track]);

  return null;
};

export const UmamiAnalytics: FC<PropsWithChildren> = ({ children }) => {
  return (
    <UmamiAnalyticsProvider
      autoTrack={true}
      src={UmamiUrl}
      websiteId={UmamiKey}
    >
      <PageView />
      {children}
    </UmamiAnalyticsProvider>
  );
};
