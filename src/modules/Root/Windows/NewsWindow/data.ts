import { useMemo } from "react";

export interface NewData {
  title: string;
  description: string;
  date: string;
}

export const useNewsData = () => {
  const newsData = useMemo<NewData[]>(
    () => [
      {
        title: "Looking for a new mission",
        description:
          "After 7 years of freelancing, I'm looking for a new adventure. If you have a project for me, don't hesitate to contact me.",
        date: "2024-10-01",
      },
      {
        title: "New website version",
        description:
          "I've been working on a new version of my website. I'm very happy to finally share it with you.",
        date: "2024-10-15",
      },
    ],
    [],
  );

  return newsData;
};
