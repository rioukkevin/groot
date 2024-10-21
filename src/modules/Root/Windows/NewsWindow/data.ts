import { useMemo } from "react";
import { useScopedI18n } from "@/lib/locales/client";

export interface NewData {
  title: string;
  description: string;
  date: string;
}

export const useNewsData = () => {
  const t = useScopedI18n("news");

  const newsData = useMemo<NewData[]>(
    () => [
      {
        title: t("lookingForNewMission.title"),
        description: t("lookingForNewMission.description"),
        date: "2024-10-01",
      },
      {
        title: t("newWebsiteVersion.title"),
        description: t("newWebsiteVersion.description"),
        date: "2024-10-18",
      },
    ],
    [t],
  );

  return newsData;
};
