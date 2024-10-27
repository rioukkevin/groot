"use client";

import {
  BriefcaseBusinessIcon,
  JoystickIcon,
  MailIcon,
  MessageCircleIcon,
  NewspaperIcon,
  PackageIcon,
  PersonStandingIcon,
  SettingsIcon,
} from "lucide-react";
import React, { useEffect, useMemo } from "react";

import { useScopedI18n } from "@/lib/locales/client";
import useScreenSize from "@/lib/screen";

import { Dock, DockElement } from "../Dock";
import { useRootWindow, WindowProps, WindowsRenderer } from "../WindowManager";

import {
  ContactWindow,
  WhoWindow,
  NewsWindow,
  SettingsWindow,
  ExperiencesWindow,
  TicTacToeWindow,
} from "./Windows";
import { ChatWindow } from "./Windows/ChatWindow";
import { ProjectsWindow } from "./Windows/ProjectsWindow";

export const Page = () => {
  const t = useScopedI18n("dock");
  const { height: screenHeight } = useScreenSize();
  const { registerWindows, openWindow, unregisterWindows } = useRootWindow();

  const WINDOWS: WindowProps[] = useMemo(
    () => [
      {
        id: "who",
        title: t("whoami"),
        component: WhoWindow,
        defaultSize: {
          width: 400,
          height: screenHeight * 0.8,
        },
        defaultPosition: {
          left: 50,
          top: 50,
        },
      },
      {
        title: t("experiences"),
        component: ExperiencesWindow,
        isFullscreenAllowed: true,
        id: "experiences",
        defaultSize: {
          width: 1280,
          height: screenHeight * 0.8,
        },
      },
      {
        title: t("projects"),
        component: ProjectsWindow,
        id: "projects",
        defaultSize: {
          width: 1280,
          height: screenHeight * 0.8,
        },
        isFullscreenAllowed: true,
      },
      {
        title: t("news"),
        component: NewsWindow,
        id: "news",
        defaultSize: {
          width: 400,
          height: 500,
        },
        defaultPosition: {
          right: 20,
          top: 470,
        },
      },
      {
        title: t("contact"),
        component: ContactWindow,
        id: "contact",
        defaultSize: {
          width: 350,
          height: 270,
        },
        defaultPosition: {
          right: 20,
          top: 250,
        },
      },
      {
        title: "Chat",
        component: ChatWindow,
        id: "chat",
        defaultSize: {
          width: 400,
          height: 600,
        },
      },
      {
        title: t("tictactoe"),
        component: TicTacToeWindow,
        id: "tictactoe",
        defaultSize: {
          width: 352,
          height: 392,
        },
      },
      {
        title: t("settings"),
        component: SettingsWindow,
        id: "settings",
        defaultSize: {
          width: 300,
          height: 510,
        },
        defaultPosition: {
          right: 50,
        },
      },
    ],
    [screenHeight, t],
  );

  const DOCK: DockElement[] = useMemo(
    () => [
      {
        id: "who",
        title: t("whoami"),
        icon: <PersonStandingIcon className="size-full text-neutral-300" />,
        onPress: () => openWindow(WINDOWS[0].id),
      },
      {
        id: "experiences",
        title: t("experiences"),
        icon: <BriefcaseBusinessIcon className="size-full text-neutral-300" />,
        onPress: () => openWindow(WINDOWS[1].id),
      },
      {
        id: "projects",
        title: t("projects"),
        icon: <PackageIcon className="size-full text-neutral-300" />,
        onPress: () => openWindow(WINDOWS[2].id),
      },
      {
        id: "news",
        title: t("news"),
        icon: <NewspaperIcon className="size-full text-neutral-300" />,
        onPress: () => openWindow(WINDOWS[3].id),
      },
      {
        id: "contact",
        title: t("contact"),
        icon: <MailIcon className="size-full text-neutral-300" />,
        onPress: () => openWindow(WINDOWS[4].id),
      },
      {
        id: "chat",
        title: "Chat",
        icon: <MessageCircleIcon className="size-full text-neutral-300" />,
        onPress: () => openWindow(WINDOWS[5].id),
      },
      {
        id: "tictactoe",
        title: t("tictactoe"),
        icon: <JoystickIcon className="size-full text-neutral-300" />,
        onPress: () => openWindow(WINDOWS[6].id),
      },
      {
        id: "settings",
        title: t("settings"),
        icon: <SettingsIcon className="size-full text-neutral-300" />,
        onPress: () => openWindow(WINDOWS[7].id),
      },
    ],
    [WINDOWS, t, openWindow],
  );

  useEffect(() => {
    const ids = registerWindows(WINDOWS);
    return () => unregisterWindows(ids);
  }, [WINDOWS, registerWindows, unregisterWindows]);

  useEffect(() => {
    setTimeout(() => {
      openWindow(WINDOWS[4].id);
      openWindow(WINDOWS[0].id);
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Dock items={DOCK} />
      <WindowsRenderer />
    </>
  );
};
