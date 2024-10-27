import { StaticImageData } from "next/image";
import { useMemo } from "react";

import ImgBritchScreen1 from "@/assets/projects/britch/Screen1.png";
import ImgBritchScreen2 from "@/assets/projects/britch/Screen2.png";
import ImgBritchThumbnail from "@/assets/projects/britch/Thumbnail.png";
import ImgControllerScreen1 from "@/assets/projects/controller/Screen1.png";
import ImgControllerScreen2 from "@/assets/projects/controller/Screen2.png";
import ImgControllerScreen3 from "@/assets/projects/controller/Screen3.png";
import ImgControllerScreen4 from "@/assets/projects/controller/Screen4.png";
import ImgControllerThumbnail from "@/assets/projects/controller/Thumbnail.png";
import ImgDiagevolScreen1 from "@/assets/projects/diagevol/Screen1.png";
import ImgDiagevolScreen2 from "@/assets/projects/diagevol/Screen2.png";
import ImgDiagevolScreen3 from "@/assets/projects/diagevol/Screen3.png";
import ImgDiagevolScreen4 from "@/assets/projects/diagevol/Screen4.png";
import ImgDiagevolScreen5 from "@/assets/projects/diagevol/Screen5.png";
import ImgDiagevolThumbnail from "@/assets/projects/diagevol/Thumbnail.png";
import ImgOoofScreen1 from "@/assets/projects/ooof/Screen1.png";
import ImgOoofScreen2 from "@/assets/projects/ooof/Screen2.png";
import ImgOoofScreen3 from "@/assets/projects/ooof/Screen3.png";
import ImgOoofThumbnail from "@/assets/projects/ooof/Thumbnail.png";
import ImgOutransCounterScreen1 from "@/assets/projects/outransCounter/Screen1.png";
import ImgOutransCounterScreen2 from "@/assets/projects/outransCounter/Screen2.png";
import ImgOutransCounterScreen3 from "@/assets/projects/outransCounter/Screen3.png";
import ImgOutransCounterThumbnail from "@/assets/projects/outransCounter/Thumbnail.png";
import ImgPortfolioV5Screen1 from "@/assets/projects/portfoliov5/Screen1.png";
import ImgPortfolioV5Screen2 from "@/assets/projects/portfoliov5/Screen2.png";
import ImgPortfolioV5Screen3 from "@/assets/projects/portfoliov5/Screen3.png";
import ImgPortfolioV5Screen4 from "@/assets/projects/portfoliov5/Screen4.png";
import ImgPortfolioV5Thumbnail from "@/assets/projects/portfoliov5/Thumbnail.png";
import ImgPortfolioV6Screen1 from "@/assets/projects/portfoliov6/Screen1.png";
import ImgPortfolioV6Screen2 from "@/assets/projects/portfoliov6/Screen2.png";
import ImgPortfolioV6Screen3 from "@/assets/projects/portfoliov6/Screen3.png";
import ImgPortfolioV6Thumbnail from "@/assets/projects/portfoliov6/Thumbnail.png";
import ImgVSCodeGitCommitDemo from "@/assets/projects/vscodeGitCommitMessage/Demo.gif";
import ImgVSCodeGitCommitScreen1 from "@/assets/projects/vscodeGitCommitMessage/Screen1.png";
import ImgVSCodeGitCommitScreen2 from "@/assets/projects/vscodeGitCommitMessage/Screen2.png";
import ImgVSCodeGitCommitThumbnail from "@/assets/projects/vscodeGitCommitMessage/Thumbnail.png";
import { useScopedI18n } from "@/lib/locales/client";

export enum ProjectType {
  DISPLAY_WEBSITE = "display-website",
  ADMIN_WEBSITE = "admin-website",
  VSCODE = "vscode",
  MOBILE_APP = "mobile-app",
  GRAPHISM = "graphism",
  CHROME_EXTENSION = "chrome-extension",
  OTHER = "other",
}

export enum Technology {
  REACT = "React.js",
  NEXT = "Next.js",
  TYPESCRIPT = "TypeScript",
  JAVASCRIPT = "JavaScript",
  TAILWIND = "Tailwind CSS",
  FRAMER_MOTION = "Framer Motion",
  NODEMAILER = "Nodemailer",
  VERCEL = "Vercel",
  TWEMOJI = "Twemoji",
  MARKED = "Marked",
  STORYBLOK = "Storyblok",
  GOOGLE_ANALYTICS = "Google Analytics",
  NODE = "Node.js",
  NETLIFY = "Netlify",
  CHAKRA_UI = "Chakra UI",
  EMOTION = "Emotion",
  SLATE = "Slate.js",
  REACT_MARKDOWN = "React-Markdown",
  VSCE = "VSCE",
  CSS = "CSS",
  CHROME_EXTENSION = "Chrome extension",
  CLOUD_FUNCTIONS = "Cloud Functions",
  SENDGRID = "SendGrid",
  FIGMA = "Figma",
  PAINT_NET = "Paint.net",
  VUE = "Vue.js",
  SASS = "Sass",
  VUE_ROUTER = "Vue Router",
  VUETIFY = "Vuetify",
  ANIME_JS = "Anime.js",
  FONTAWESOME = "Fontawesome",
  MATOMO = "Matomo analytics",
  DOCKER = "Docker",
  NGINX = "Nginx",
  FIREBASE = "Firebase",
  REALTIME_DATABASE = "Realtime Database",
  BCRYPT = "Bcrypt",
}

export const FilterableTechnologies: Record<Technology, boolean> = {
  [Technology.REACT]: true,
  [Technology.NEXT]: true,
  [Technology.TYPESCRIPT]: true,
  [Technology.JAVASCRIPT]: true,
  [Technology.TAILWIND]: true,
  [Technology.FRAMER_MOTION]: true,
  [Technology.NODEMAILER]: false,
  [Technology.VERCEL]: true,
  [Technology.TWEMOJI]: false,
  [Technology.MARKED]: false,
  [Technology.STORYBLOK]: false,
  [Technology.GOOGLE_ANALYTICS]: false,
  [Technology.NODE]: true,
  [Technology.NETLIFY]: true,
  [Technology.CHAKRA_UI]: false,
  [Technology.EMOTION]: false,
  [Technology.SLATE]: false,
  [Technology.REACT_MARKDOWN]: false,
  [Technology.VSCE]: false,
  [Technology.CSS]: true,
  [Technology.CHROME_EXTENSION]: false,
  [Technology.CLOUD_FUNCTIONS]: true,
  [Technology.SENDGRID]: false,
  [Technology.FIGMA]: false,
  [Technology.PAINT_NET]: false,
  [Technology.VUE]: true,
  [Technology.SASS]: true,
  [Technology.VUE_ROUTER]: false,
  [Technology.VUETIFY]: false,
  [Technology.ANIME_JS]: false,
  [Technology.FONTAWESOME]: false,
  [Technology.MATOMO]: false,
  [Technology.DOCKER]: true,
  [Technology.NGINX]: false,
  [Technology.FIREBASE]: true,
  [Technology.REALTIME_DATABASE]: false,
  [Technology.BCRYPT]: false,
};

export interface ProjectThumbnail {
  imageSrc: StaticImageData;
  name: string;
  shortDescription: string;
  type: ProjectType;
  technologies: string[];
  date: {
    month: number;
    year: number;
  };
  images: StaticImageData[];
  descriptions: string[];
  links?: { label: string; href: string }[];
  color: string;
}

export const useProjectsData = (): ProjectThumbnail[] => {
  const t = useScopedI18n("projects");

  const projects: ProjectThumbnail[] = useMemo(
    () => [
      {
        imageSrc: ImgOoofThumbnail,
        name: t("ooof.name"),
        shortDescription: t("ooof.shortDescription"),
        type: ProjectType.DISPLAY_WEBSITE,
        technologies: [
          Technology.REACT,
          Technology.NEXT,
          Technology.TYPESCRIPT,
          Technology.JAVASCRIPT,
          Technology.TAILWIND,
          Technology.FRAMER_MOTION,
          Technology.NODEMAILER,
          Technology.VERCEL,
        ],
        date: { month: 8, year: 2024 },
        images: [
          ImgOoofThumbnail,
          ImgOoofScreen1,
          ImgOoofScreen2,
          ImgOoofScreen3,
        ],
        descriptions: [
          t("ooof.descriptions.0"),
          t("ooof.descriptions.1"),
          t("ooof.descriptions.2"),
          t("ooof.descriptions.3"),
        ],
        links: [
          { label: t("ooof.links.0"), href: "https://ooof.dev" },
          { label: t("ooof.links.1"), href: "https://github.com/dev-ooof" },
        ],
        color: "#FEDE03",
      },
      {
        imageSrc: ImgPortfolioV6Thumbnail,
        name: t("portfolioV6.name"),
        shortDescription: t("portfolioV6.shortDescription"),
        type: ProjectType.DISPLAY_WEBSITE,
        technologies: [
          Technology.REACT,
          Technology.NEXT,
          Technology.TYPESCRIPT,
          Technology.JAVASCRIPT,
          Technology.TAILWIND,
          Technology.TWEMOJI,
          Technology.MARKED,
          Technology.STORYBLOK,
          Technology.GOOGLE_ANALYTICS,
          Technology.NODE,
          Technology.VERCEL,
          Technology.NETLIFY,
        ],
        date: { month: 10, year: 2022 },
        images: [
          ImgPortfolioV6Thumbnail,
          ImgPortfolioV6Screen1,
          ImgPortfolioV6Screen2,
          ImgPortfolioV6Screen3,
        ],
        descriptions: [
          t("portfolioV6.descriptions.0"),
          t("portfolioV6.descriptions.1"),
          t("portfolioV6.descriptions.2"),
          t("portfolioV6.descriptions.3"),
          t("portfolioV6.descriptions.4"),
          t("portfolioV6.descriptions.5"),
        ],
        links: [
          {
            label: t("portfolioV6.links.0"),
            href: "https://v6-kevin.riou.pro",
          },
          {
            label: t("portfolioV6.links.1"),
            href: "https://github.com/rioukkevin/groot",
          },
        ],
        color: "#477979",
      },
      {
        imageSrc: ImgVSCodeGitCommitThumbnail,
        name: t("vscodeGitCommit.name"),
        shortDescription: t("vscodeGitCommit.shortDescription"),
        type: ProjectType.VSCODE,
        technologies: [
          Technology.REACT,
          Technology.TYPESCRIPT,
          Technology.JAVASCRIPT,
          Technology.CHAKRA_UI,
          Technology.EMOTION,
          Technology.SLATE,
          Technology.REACT_MARKDOWN,
          Technology.NEXT,
          Technology.VSCE,
          Technology.NETLIFY,
        ],
        date: { month: 9, year: 2022 },
        images: [
          ImgVSCodeGitCommitScreen1,
          ImgVSCodeGitCommitDemo,
          ImgVSCodeGitCommitScreen2,
          ImgVSCodeGitCommitThumbnail,
        ],
        descriptions: [
          t("vscodeGitCommit.descriptions.0"),
          t("vscodeGitCommit.descriptions.1"),
          t("vscodeGitCommit.descriptions.2"),
          t("vscodeGitCommit.descriptions.3"),
          t("vscodeGitCommit.descriptions.4"),
        ],
        links: [
          {
            label: t("vscodeGitCommit.links.0"),
            href: "https://marketplace.visualstudio.com/items?itemName=rioukkevin.vscode-git-commit",
          },
          {
            label: t("vscodeGitCommit.links.1"),
            href: "https://gcm-config.netlify.app/",
          },
          {
            label: t("vscodeGitCommit.links.2"),
            href: "https://gcm-config.netlify.app/configurator",
          },
        ],
        color: "#DB4535",
      },
      {
        imageSrc: ImgBritchThumbnail,
        name: t("britch.name"),
        shortDescription: t("britch.shortDescription"),
        type: ProjectType.CHROME_EXTENSION,
        technologies: [
          Technology.REACT,
          Technology.TYPESCRIPT,
          Technology.JAVASCRIPT,
          Technology.CSS,
          Technology.CHROME_EXTENSION,
        ],
        date: { month: 8, year: 2022 },
        images: [ImgBritchScreen1, ImgBritchScreen2, ImgBritchThumbnail],
        descriptions: [
          t("britch.descriptions.0"),
          t("britch.descriptions.1"),
          t("britch.descriptions.2"),
        ],
        links: [
          {
            label: t("britch.links.0"),
            href: "https://chromewebstore.google.com/detail/britch-twitch-brightness/mbakeppieaiacmnfckfmaijhjlelokph",
          },
        ],
        color: "#9246FF",
      },
      {
        imageSrc: ImgDiagevolThumbnail,
        name: t("diagevol.name"),
        shortDescription: t("diagevol.shortDescription"),
        type: ProjectType.DISPLAY_WEBSITE,
        technologies: [
          Technology.REACT,
          Technology.NEXT,
          Technology.TYPESCRIPT,
          Technology.JAVASCRIPT,
          Technology.TAILWIND,
          Technology.CLOUD_FUNCTIONS,
          Technology.SENDGRID,
          Technology.VERCEL,
        ],
        date: { month: 3, year: 2022 },
        images: [
          ImgDiagevolThumbnail,
          ImgDiagevolScreen1,
          ImgDiagevolScreen2,
          ImgDiagevolScreen3,
          ImgDiagevolScreen4,
          ImgDiagevolScreen5,
        ],
        descriptions: [
          t("diagevol.descriptions.0"),
          t("diagevol.descriptions.1"),
          t("diagevol.descriptions.2"),
        ],
        links: [{ label: t("diagevol.links.0"), href: "https://diagevol.fr" }],
        color: "#F86815",
      },
      {
        imageSrc: ImgControllerThumbnail,
        name: t("controller.name"),
        shortDescription: t("controller.shortDescription"),
        type: ProjectType.GRAPHISM,
        technologies: [
          Technology.CSS,
          Technology.JAVASCRIPT,
          Technology.FIGMA,
          Technology.PAINT_NET,
        ],
        date: { month: 6, year: 2021 },
        images: [
          ImgControllerScreen1,
          ImgControllerScreen2,
          ImgControllerScreen3,
          ImgControllerScreen4,
        ],
        descriptions: [
          t("controller.descriptions.0"),
          t("controller.descriptions.1"),
          t("controller.descriptions.2"),
          t("controller.descriptions.3"),
          t("controller.descriptions.4"),
          t("controller.descriptions.5"),
        ],
        links: [
          {
            label: t("controller.links.0"),
            href: "https://github.com/rioukkevin/custom-thustmaster-overlay",
          },
        ],
        color: "#92A7A2",
      },
      {
        imageSrc: ImgPortfolioV5Thumbnail,
        name: t("portfolioV5.name"),
        shortDescription: t("portfolioV5.shortDescription"),
        type: ProjectType.DISPLAY_WEBSITE,
        technologies: [
          Technology.VUE,
          Technology.JAVASCRIPT,
          Technology.SASS,
          Technology.VUE_ROUTER,
          Technology.VUETIFY,
          Technology.ANIME_JS,
          Technology.TWEMOJI,
          Technology.FONTAWESOME,
          Technology.MATOMO,
          Technology.NODE,
          Technology.DOCKER,
          Technology.NGINX,
          Technology.NETLIFY,
          Technology.VERCEL,
        ],
        date: { month: 8, year: 2021 },
        images: [
          ImgPortfolioV5Screen1,
          ImgPortfolioV5Screen2,
          ImgPortfolioV5Screen3,
          ImgPortfolioV5Screen4,
          ImgPortfolioV5Thumbnail,
        ],
        descriptions: [
          t("portfolioV5.descriptions.0"),
          t("portfolioV5.descriptions.1"),
          t("portfolioV5.descriptions.2"),
          t("portfolioV5.descriptions.3"),
        ],
        links: [
          {
            label: t("portfolioV5.links.0"),
            href: "https://github.com/rioukkevin/portfolio",
          },
          {
            label: t("portfolioV5.links.1"),
            href: "https://portfolio-chi-virid.vercel.app",
          },
        ],
        color: "#000",
      },
      {
        imageSrc: ImgOutransCounterThumbnail,
        name: t("outransCounter.name"),
        shortDescription: t("outransCounter.shortDescription"),
        type: ProjectType.ADMIN_WEBSITE,
        technologies: [
          Technology.REACT,
          Technology.NEXT,
          Technology.TYPESCRIPT,
          Technology.JAVASCRIPT,
          Technology.VERCEL,
          Technology.FIREBASE,
          Technology.REALTIME_DATABASE,
          Technology.BCRYPT,
          Technology.NODE,
        ],
        date: { month: 1, year: 2024 },
        images: [
          ImgOutransCounterThumbnail,
          ImgOutransCounterScreen1,
          ImgOutransCounterScreen2,
          ImgOutransCounterScreen3,
        ],
        descriptions: [
          t("outransCounter.descriptions.0"),
          t("outransCounter.descriptions.1"),
          t("outransCounter.descriptions.2"),
        ],
        links: [
          { label: t("outransCounter.links.0"), href: "https://outrans.org" },
        ],
        color: "#2F0A2A",
      },
    ],
    [t],
  );

  return projects;
};
