"use client";

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

export const Page = () => {
  const openWindow = useOpenWindow();

  const data: DockElement[] = [
    {
      title: "Who am I ?",
      icon: (
        <PersonStandingIcon className="size-full text-neutral-600 dark:text-neutral-300" />
      ),
      onPress: () =>
        openWindow({
          title: "Who am I ?",
          children: (props) => <WhoWindow {...props} />,
          id: "who",
          size: {
            width: "400px",
            height: "fit-content",
          },
        }),
    },
    {
      title: "Experiences",
      icon: (
        <BriefcaseBusinessIcon className="size-full text-neutral-600 dark:text-neutral-300" />
      ),
      onPress: () =>
        openWindow({
          title: "Experiences",
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
      title: "Projects",
      icon: (
        <PackageIcon className="size-full text-neutral-600 dark:text-neutral-300" />
      ),
      onPress: () =>
        openWindow({
          title: "Projects",
          children: () => <div>Projects</div>,
          id: "projects",
          size: {
            width: "80vw",
            height: "60vh",
          },
        }),
    },
    {
      title: "News",
      icon: (
        <NewspaperIcon className="size-full text-neutral-600 dark:text-neutral-300" />
      ),
      onPress: () =>
        openWindow({
          title: "News",
          children: (props) => <NewsWindow {...props} />,
          id: "news",
          size: {
            width: "400px",
            height: "500px",
          },
        }),
    },
    {
      title: "Contact",
      icon: (
        <MailIcon className="size-full text-neutral-600 dark:text-neutral-300" />
      ),
      onPress: () =>
        openWindow({
          title: "Contact",
          children: (props) => <ContactWindow {...props} />,
          id: "contact",
          size: {
            width: "350px",
            height: "250px",
          },
        }),
    },
    {
      title: "TicTacToe",
      icon: (
        <JoystickIcon className="size-full text-neutral-600 dark:text-neutral-300" />
      ),
      onPress: () =>
        openWindow({
          title: "TicTacToe",
          children: (props) => <TicTacToeWindow {...props} />,
          id: "tictactoe",
          size: {
            width: "352px",
            height: "392px",
          },
        }),
    },
    {
      title: "Settings",
      icon: (
        <SettingsIcon className="size-full text-neutral-600 dark:text-neutral-300" />
      ),
      onPress: () =>
        openWindow({
          title: "Settings",
          children: (props) => <SettingsWindow {...props} />,
          id: "settings",
          size: {
            width: "300px",
            height: "470px",
          },
        }),
    },
  ];

  return (
    <>
      <Dock items={data} />
      <WindowManager />
    </>
  );
};
