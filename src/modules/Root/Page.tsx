"use client";

import { Dock, DockElement } from "../Dock";
import { useOpenWindow, WindowManager } from "../WindowManager";
import {
  BriefcaseBusinessIcon,
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
} from "./Windows";

export const Page = () => {
  const openWindow = useOpenWindow();

  const data: DockElement[] = [
    {
      title: "Who am I ?",
      icon: (
        <PersonStandingIcon className="h-full w-full text-neutral-600 dark:text-neutral-300" />
      ),
      onPress: () =>
        openWindow({
          title: "Who am I ?",
          children: <WhoWindow />,
          id: "who",
        }),
    },
    {
      title: "Experiences",
      icon: (
        <BriefcaseBusinessIcon className="h-full w-full text-neutral-600 dark:text-neutral-300" />
      ),
      onPress: () =>
        openWindow({
          title: "Experiences",
          children: <div className="text-xl">Expériences</div>,
          id: "experiences",
        }),
    },
    {
      title: "Projects",
      icon: (
        <PackageIcon className="h-full w-full text-neutral-600 dark:text-neutral-300" />
      ),
      onPress: () =>
        openWindow({
          title: "Projects",
          children: <div className="text-xl">Projects</div>,
          id: "projects",
        }),
    },
    {
      title: "News",
      icon: (
        <NewspaperIcon className="h-full w-full text-neutral-600 dark:text-neutral-300" />
      ),
      onPress: () =>
        openWindow({
          title: "News",
          children: <NewsWindow />,
          id: "news",
        }),
    },
    {
      title: "Contact",
      icon: (
        <MailIcon className="h-full w-full text-neutral-600 dark:text-neutral-300" />
      ),
      onPress: () =>
        openWindow({
          title: "Contact",
          children: <ContactWindow />,
          id: "contact",
        }),
    },
    {
      title: "Settings",
      icon: (
        <SettingsIcon className="h-full w-full text-neutral-600 dark:text-neutral-300" />
      ),
      onPress: () =>
        openWindow({
          title: "Settings",
          children: <SettingsWindow />,
          id: "settings",
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
