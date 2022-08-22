import {
  RiChromeLine,
  RiCodeLine,
  RiComputerLine,
  RiMoreLine,
  RiPaletteLine,
  RiRobotLine,
  RiRouteLine,
  RiSmartphoneLine,
} from "react-icons/ri";
import { IWork } from "../typings/Work";

import IMGVSCodeGitCommit1 from "../assets/projects/VSCodeGitCommit1.png";
import IMGVSCodeGitCommit2 from "../assets/projects/VSCodeGitCommit2.png";

import IMGBritch1 from "../assets/projects/Britch1.png";
import IMGBritch2 from "../assets/projects/Britch2.png";

import IMGController1 from "../assets/projects/Controller1.png";
import IMGController2 from "../assets/projects/Controller2.png";
import IMGController3 from "../assets/projects/Controller3.png";

import IMGDiscordBotAmongus1 from "../assets/projects/DiscordBotAmongus1.png";
import IMGDiscordBotAmongus2 from "../assets/projects/DiscordBotAmongus2.png";

import IMGGreevel1 from "../assets/projects/Greevel1.png";
import IMGGreevel2 from "../assets/projects/Greevel2.png";
import IMGGreevel3 from "../assets/projects/Greevel3.png";
import IMGGreevel4 from "../assets/projects/Greevel4.png";

import IMGDiagevol1 from "../assets/projects/Diagevol1.png";
import IMGDiagevol2 from "../assets/projects/Diagevol2.png";
import IMGDiagevol3 from "../assets/projects/Diagevol3.png";
import IMGDiagevol4 from "../assets/projects/Diagevol4.png";

import IMGSubiby1 from "../assets/projects/Subiby1.png";
import IMGSubiby2 from "../assets/projects/Subiby2.png";
import IMGSubiby3 from "../assets/projects/Subiby3.png";

export const WORKS_ICONS: { [key in IWork["type"]]: any } = {
  vscode: RiCodeLine,
  chrome: RiChromeLine,
  bot: RiRobotLine,
  frontend: RiComputerLine,
  backend: RiRouteLine,
  graphic: RiPaletteLine,
  mobile: RiSmartphoneLine,
  other: RiMoreLine,
};

export const WORKS_ICONS_LABEL: { [key in IWork["type"]]: string } = {
  vscode: "Extensions VSCode",
  chrome: "Extensions Chrome",
  bot: "Bots",
  frontend: "Clients web",
  backend: "APIs",
  graphic: "Graphismes",
  mobile: "Applications Mobiles",
  other: "Autres",
};

export const WORKS_CONTENT: IWork[] = [
  {
    name: "VSCode git commit",
    description: "vscodeGitCommit",
    type: "vscode",
    url: "https://gcm-config.netlify.app/",
    techs: ["VSCode", "Typescript", "React", "Netlify"],
    images: [IMGVSCodeGitCommit1, IMGVSCodeGitCommit2],
  },
  {
    name: "Britch",
    description: "britch",
    type: "chrome",
    url: "https://chrome.google.com/webstore/detail/britch-twitch-brightness/mbakeppieaiacmnfckfmaijhjlelokph",
    techs: ["Chrome API", "Typescript", "React", "Webpack"],
    images: [IMGBritch1, IMGBritch2],
  },
  {
    name: "Controller overlay",
    description: "controllerOverlay",
    type: "graphic",
    url: "https://github.com/rioukkevin/custom-thustmaster-overlay",
    techs: ["Figma", "CSS", "Paint.net", "Netlify"],
    images: [IMGController1, IMGController2, IMGController3],
  },
  {
    name: "Bot Discord AmongUs",
    description: "discordBotAmongus",
    type: "bot",
    url: "https://github.com/rioukkevin/discord-bot-amongus",
    techs: [
      "DiscordJS",
      "Typescript",
      "NodeJS",
      "Webpack",
      "Custom Framework",
      "Heroku",
    ],
    images: [IMGDiscordBotAmongus1, IMGDiscordBotAmongus2],
  },
  {
    name: "Greevel",
    description: "greevel",
    type: "mobile",
    url: "mailto:kevin@riou.pro",
    techs: ["ReactNative", "Expo", "Typescript", "Docker"],
    images: [IMGGreevel1, IMGGreevel2, IMGGreevel3, IMGGreevel4],
  },
  {
    name: "Diagevol",
    description: "diagevol",
    type: "frontend",
    url: "https://diagevol.fr",
    techs: ["React", "TailwindCSS", "Typescript", "Netlify"],
    images: [IMGDiagevol1, IMGDiagevol2, IMGDiagevol3, IMGDiagevol4],
  },
  {
    name: "Subiby",
    description: "subiby",
    type: "mobile",
    url: "https://subiby.vercel.app",
    techs: [
      "React",
      "Typescript",
      "Firebase.Firestore",
      "Firebase.Auth",
      "Vercel",
    ],
    images: [IMGSubiby1, IMGSubiby2, IMGSubiby3],
  },
];

// - RAF

// TRR
// VSCodeGitButtons
