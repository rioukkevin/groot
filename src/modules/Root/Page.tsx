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
  ExperiencesWindow,
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
        <BriefcaseBusinessIcon className="h-full w-full text-neutral-600 dark:text-neutral-300" />
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
        <PackageIcon className="h-full w-full text-neutral-600 dark:text-neutral-300" />
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
        <NewspaperIcon className="h-full w-full text-neutral-600 dark:text-neutral-300" />
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
        <MailIcon className="h-full w-full text-neutral-600 dark:text-neutral-300" />
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
      title: "Settings",
      icon: (
        <SettingsIcon className="h-full w-full text-neutral-600 dark:text-neutral-300" />
      ),
      onPress: () =>
        openWindow({
          title: "Settings",
          children: (props) => <SettingsWindow {...props} />,
          id: "settings",
          size: {
            width: "300px",
            height: "600px",
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
