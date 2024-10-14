"use client";

import { useState } from "react";
import { Dock, DockElement } from "../Dock";
import { useOpenWindow, WindowManager } from "../WindowManager";
import {
  BriefcaseBusinessIcon,
  JoystickIcon,
  MailIcon,
  NewspaperIcon,
  PackageIcon,
  PersonStandingIcon,
  SettingsIcon,
} from "lucide-react";
import {
  ContactWindow,
  WhoWindow,
  NewsWindow,
  SettingsWindow,
  ExperiencesWindow,
  TicTacToeWindow,
} from "./Windows";
import { useScopedI18n } from "@/lib/locales/client";
import { ProjectsWindow } from "./Windows/ProjectsWindow";

const useDockData = () => {
  const t = useScopedI18n("dock");
  const openWindow = useOpenWindow();
  const [data] = useState<DockElement[]>([
    {
      title: t("whoami"),
      icon: (
        <PersonStandingIcon className="size-full text-neutral-600 dark:text-neutral-300" />
      ),
      onPress: () =>
        openWindow({
          title: t("whoami"),
          children: (props) => <WhoWindow {...props} />,
          id: "who",
          size: {
            width: "400px",
            height: "fit-content",
          },
        }),
    },
    {
      title: t("experiences"),
      icon: (
        <BriefcaseBusinessIcon className="size-full text-neutral-600 dark:text-neutral-300" />
      ),
      onPress: () =>
        openWindow({
          title: t("experiences"),
          children: (props) => <ExperiencesWindow {...props} />,
          isFullscreenAllowed: true,
          id: "experiences",
          size: {
            width: "80vw",
            height: "60vh",
          },
        }),
    },
    {
      title: t("projects"),
      icon: (
        <PackageIcon className="size-full text-neutral-600 dark:text-neutral-300" />
      ),
      onPress: () =>
        openWindow({
          title: t("projects"),
          children: (props) => <ProjectsWindow {...props} />,
          id: "projects",
          size: {
            width: "1280px",
            height: "60vh",
          },
        }),
    },
    {
      title: t("news"),
      icon: (
        <NewspaperIcon className="size-full text-neutral-600 dark:text-neutral-300" />
      ),
      onPress: () =>
        openWindow({
          title: t("news"),
          children: (props) => <NewsWindow {...props} />,
          id: "news",
          size: {
            width: "400px",
            height: "500px",
          },
        }),
    },
    {
      title: t("contact"),
      icon: (
        <MailIcon className="size-full text-neutral-600 dark:text-neutral-300" />
      ),
      onPress: () =>
        openWindow({
          title: t("contact"),
          children: (props) => <ContactWindow {...props} />,
          id: "contact",
          size: {
            width: "350px",
            height: "250px",
          },
        }),
    },
    {
      title: t("tictactoe"),
      icon: (
        <JoystickIcon className="size-full text-neutral-600 dark:text-neutral-300" />
      ),
      onPress: () =>
        openWindow({
          title: t("tictactoe"),
          children: (props) => <TicTacToeWindow {...props} />,
          id: "tictactoe",
          size: {
            width: "352px",
            height: "392px",
          },
        }),
    },
    {
      title: t("settings"),
      icon: (
        <SettingsIcon className="size-full text-neutral-600 dark:text-neutral-300" />
      ),
      onPress: () =>
        openWindow({
          title: t("settings"),
          children: (props) => <SettingsWindow {...props} />,
          id: "settings",
          size: {
            width: "300px",
            height: "470px",
          },
        }),
    },
  ]);

  return data;
};

export const Page = () => {
  const dockData = useDockData();

  return (
    <>
      <Dock items={dockData} />
      <WindowManager />
    </>
  );
};
