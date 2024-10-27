import { useMemo } from "react";

import { useScopedI18n } from "@/lib/locales/client";

export interface ExperienceData {
  company: string;
  job: string;
  startDate: string;
  endDate: string;
  about: string;
  technologies: string[];
  missions: string[];
  achievements: string[];
  color: string;
}

export const useExperiencesData = () => {
  const t = useScopedI18n("experiences");

  const experiencesData = useMemo<ExperienceData[]>(
    () => [
      {
        company: t("ooof.company"),
        job: t("ooof.job"),
        startDate: "2024-09-01",
        endDate: "Present",
        about: t("ooof.about"),
        technologies: [
          "React",
          "Next.js",
          "Node.js",
          "TypeScript",
          "GraphQL",
          "REST APIs",
        ],
        missions: [
          t("ooof.missions.0"),
          t("ooof.missions.1"),
          t("ooof.missions.2"),
        ],
        achievements: [],
        color: "#FF6B6B",
      },
      {
        company: t("sideProjects.company"),
        job: t("sideProjects.job"),
        startDate: "2016-01-01",
        endDate: "Present",
        about: t("sideProjects.about"),
        technologies: [
          "Javascript",
          "Typescript",
          "React.js",
          "Vue.js2/3",
          "NextJS",
          "NuxtJS",
          "Pug",
          "CSS",
          "Sass/Scss",
          "Less",
          "TailwindCSS",
          "ReactNative",
          "Expo.js",
          "Node.JS",
          "REST",
          "GraphQL",
          "NestJS",
          "Socket.io",
          "Express",
          "Koa",
          "Vercel",
          "Netlify",
          "Firebase",
          "Supabase",
          "Glitch",
          "Heroku",
          "Docker",
          "Kubernetes",
          "Helm",
          "OVHCloud (dedicated server)",
          "Expo Cloud",
          "Github",
          "Gitlab",
        ],
        missions: [],
        achievements: [
          t("sideProjects.achievements.0"),
          t("sideProjects.achievements.1"),
          t("sideProjects.achievements.2"),
          t("sideProjects.achievements.3"),
          t("sideProjects.achievements.4"),
          t("sideProjects.achievements.5"),
          t("sideProjects.achievements.6"),
          t("sideProjects.achievements.7"),
        ],
        color: "#4ECDC4",
      },
      {
        company: t("technis.company"),
        job: t("technis.job"),
        startDate: "2022-11-01",
        endDate: "2024-08-02",
        about: t("technis.about"),
        technologies: [
          "React.js",
          "Node.js",
          "TypeScript",
          "CSS-in-JS/Styled component/TailwindCSS",
          "GraphQL",
          "REST",
          "MongoDB",
          "PostgreSQL",
          "Google Cloud",
          "Firebase",
          "Supabase",
          "Git",
        ],
        missions: [
          t("technis.missions.0"),
          t("technis.missions.1"),
          t("technis.missions.2"),
          t("technis.missions.3"),
          t("technis.missions.4"),
        ],
        achievements: [
          t("technis.achievements.0"),
          t("technis.achievements.1"),
          t("technis.achievements.2"),
          t("technis.achievements.3"),
          t("technis.achievements.4"),
        ],
        color: "#45B7D1",
      },
      {
        company: t("alpha8.company"),
        job: t("alpha8.job"),
        startDate: "2020-09-01",
        endDate: "2022-10-25",
        about: t("alpha8.about"),
        technologies: [
          "React.js",
          "Node.js",
          "Typescript",
          "CSS-in-JS",
          "GraphQL (Apollo suite)",
          "Koa.js",
          "Headless browser",
          "Docker",
          "Kubernetes",
          "Helm",
          "Scaleway cloud",
          "Jest",
        ],
        missions: [
          t("alpha8.missions.0"),
          t("alpha8.missions.1"),
          t("alpha8.missions.2"),
          t("alpha8.missions.3"),
          t("alpha8.missions.4"),
        ],
        achievements: [
          t("alpha8.achievements.0"),
          t("alpha8.achievements.1"),
          t("alpha8.achievements.2"),
          t("alpha8.achievements.3"),
          t("alpha8.achievements.4"),
        ],
        color: "#FFA500",
      },
      {
        company: t("pasquier.company"),
        job: t("pasquier.job"),
        startDate: "2019-09-01",
        endDate: "2020-08-31",
        about: t("pasquier.about"),
        technologies: [
          "Vue.js 2",
          "Javascript",
          "Sass",
          "C#",
          "Windows server hosting",
          "REST",
          "Internal CI",
          "SVN/Git",
          "Sharepoint",
        ],
        missions: [
          t("pasquier.missions.0"),
          t("pasquier.missions.1"),
          t("pasquier.missions.2"),
          t("pasquier.missions.3"),
          t("pasquier.missions.4"),
          t("pasquier.missions.5"),
          t("pasquier.missions.6"),
        ],
        achievements: [
          t("pasquier.achievements.0"),
          t("pasquier.achievements.1"),
          t("pasquier.achievements.2"),
          t("pasquier.achievements.3"),
        ],
        color: "#FFD700",
      },
      {
        company: t("eureden.company"),
        job: t("eureden.job"),
        startDate: "2018-09-01",
        endDate: "2019-08-31",
        about: t("eureden.about"),
        technologies: [
          "Vue.js 2",
          "CSS/Sass",
          "REST",
          "PHP 5/7",
          "Javascript",
          "SVN/Git",
          "Cordova",
          "NativeScript",
        ],
        missions: [
          t("eureden.missions.0"),
          t("eureden.missions.1"),
          t("eureden.missions.2"),
          t("eureden.missions.3"),
          t("eureden.missions.4"),
          t("eureden.missions.5"),
          t("eureden.missions.6"),
        ],
        achievements: [
          t("eureden.achievements.0"),
          t("eureden.achievements.1"),
          t("eureden.achievements.2"),
        ],
        color: "#32CD32",
      },
      // {
      //   company: t("cdg29.company"),
      //   job: t("cdg29.job"),
      //   startDate: "2017-09-01",
      //   endDate: "2018-08-31",
      //   about: t("cdg29.about"),
      //   technologies: [],
      //   missions: [],
      //   achievements: [],
      //   color: "#9370DB",
      // },
    ],
    [t],
  );

  return experiencesData;
};
