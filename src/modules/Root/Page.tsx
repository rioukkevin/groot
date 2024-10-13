"use client";

import { Dock, DockElement } from "../Dock";
import { useOpenWindow, WindowManager } from "../WindowManager";
import {
  Activity,
  Component,
  HomeIcon,
  Mail,
  Package,
  ScrollText,
  SunMoon,
} from "lucide-react";

export const Page = () => {
  const openWindow = useOpenWindow();

  const data: DockElement[] = [
    {
      title: "Home",
      icon: (
        <HomeIcon className="h-full w-full text-neutral-600 dark:text-neutral-300" />
      ),
      onPress: () =>
        openWindow({
          title: "Presentation",
          children: <div className="text-xl">Presentation</div>,
          id: "presentation",
        }),
    },
    {
      title: "Products",
      icon: (
        <Package className="h-full w-full text-neutral-600 dark:text-neutral-300" />
      ),
      onPress: () =>
        openWindow({
          id: "products",
          title: "Products",
          children: <div>Products</div>,
        }),
    },
    {
      title: "Components",
      icon: (
        <Component className="h-full w-full text-neutral-600 dark:text-neutral-300" />
      ),
      onPress: () =>
        openWindow({
          id: "components",
          title: "Components",
          children: <div>Components</div>,
        }),
    },
    {
      title: "Activity",
      icon: (
        <Activity className="h-full w-full text-neutral-600 dark:text-neutral-300" />
      ),
      onPress: () =>
        openWindow({
          id: "activity",
          title: "Activity",
          children: <div>Activity</div>,
        }),
    },
    {
      title: "Change Log",
      icon: (
        <ScrollText className="h-full w-full text-neutral-600 dark:text-neutral-300" />
      ),
      onPress: () =>
        openWindow({
          id: "change-log",
          title: "Change Log",
          children: <div>Change Log</div>,
        }),
    },
    {
      title: "Email",
      icon: (
        <Mail className="h-full w-full text-neutral-600 dark:text-neutral-300" />
      ),
      onPress: () =>
        openWindow({
          id: "email",
          title: "Email",
          children: <div>Email</div>,
        }),
    },
    {
      title: "Theme",
      icon: (
        <SunMoon className="h-full w-full text-neutral-600 dark:text-neutral-300" />
      ),
      onPress: () =>
        openWindow({
          id: "theme",
          title: "Theme",
          children: <div>Theme</div>,
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
