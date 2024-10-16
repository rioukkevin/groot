"use client";

import { useEffect, useState } from "react";
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
import useScreenSize from "@/lib/screen";

const useDockData = () => {
  const t = useScopedI18n("dock");
  const { height: screenHeight } = useScreenSize();

  console.log(screenHeight);

  const openWindow = useOpenWindow();
  const [data] = useState<DockElement[]>([
    {
      id: "who",
      title: t("whoami"),
      icon: <PersonStandingIcon className="size-full text-neutral-300" />,
      onPress: () =>
        openWindow({
          title: t("whoami"),
          children: (props) => <WhoWindow {...props} />,
          id: "who",
          size: {
            width: 400,
            height: screenHeight * 0.8,
          },
          position: {
            left: 50,
            top: 50,
          },
        }),
    },
    {
      id: "experiences",
      title: t("experiences"),
      icon: <BriefcaseBusinessIcon className="size-full text-neutral-300" />,
      onPress: () =>
        openWindow({
          title: t("experiences"),
          children: (props) => <ExperiencesWindow {...props} />,
          isFullscreenAllowed: true,
          id: "experiences",
          size: {
            width: 1280,
            height: screenHeight * 0.8,
          },
        }),
    },
    {
      id: "projects",
      title: t("projects"),
      icon: <PackageIcon className="size-full text-neutral-300" />,
      onPress: () =>
        openWindow({
          title: t("projects"),
          children: (props) => <ProjectsWindow {...props} />,
          id: "projects",
          size: {
            width: 1280,
            height: screenHeight * 0.8,
          },
          isFullscreenAllowed: true,
        }),
    },
    {
      id: "news",
      title: t("news"),
      icon: <NewspaperIcon className="size-full text-neutral-300" />,
      onPress: () =>
        openWindow({
          title: t("news"),
          children: (props) => <NewsWindow {...props} />,
          id: "news",
          size: {
            width: 400,
            height: 500,
          },
          position: {
            right: 20,
            top: 470,
          },
        }),
    },
    {
      id: "contact",
      title: t("contact"),
      icon: <MailIcon className="size-full text-neutral-300" />,
      onPress: () =>
        openWindow({
          title: t("contact"),
          children: (props) => <ContactWindow {...props} />,
          id: "contact",
          size: {
            width: 350,
            height: 210,
          },
          position: {
            right: 20,
            top: 250,
          },
        }),
    },
    {
      id: "tictactoe",
      title: t("tictactoe"),
      icon: <JoystickIcon className="size-full text-neutral-300" />,
      onPress: () =>
        openWindow({
          title: t("tictactoe"),
          children: (props) => <TicTacToeWindow {...props} />,
          id: "tictactoe",
          size: {
            width: 352,
            height: 392,
          },
        }),
    },
    {
      id: "settings",
      title: t("settings"),
      icon: <SettingsIcon className="size-full text-neutral-300" />,
      onPress: () =>
        openWindow({
          title: t("settings"),
          children: (props) => <SettingsWindow {...props} />,
          id: "settings",
          size: {
            width: 300,
            height: 420,
          },
          position: {
            right: 50,
          },
        }),
    },
  ]);

  return data;
};

export const Page = () => {
  const dockData = useDockData();

  useEffect(() => {
    setTimeout(() => {
      dockData[0].onPress(dockData[0]);
      dockData[4].onPress(dockData[4]);
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Dock items={dockData} />
      <WindowManager />
    </>
  );
};
