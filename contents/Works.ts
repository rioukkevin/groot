import {
  RiChromeLine,
  RiCodeLine,
  RiComputerLine,
  RiMoreLine,
  RiPaletteLine,
  RiRobotLine,
  RiRouteLine,
} from "react-icons/ri";
import { IWork } from "../typings/Work";

import IMGVSCodeGitCommit from "../assets/projects/VSCodeGitCommit.png";

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

export const WORKS_ICONS: { [key in IWork["type"]]: any } = {
  vscode: RiCodeLine,
  chrome: RiChromeLine,
  bot: RiRobotLine,
  frontend: RiComputerLine,
  backend: RiRouteLine,
  graphic: RiPaletteLine,
  other: RiMoreLine,
};

export const WORKS_CONTENT: IWork[] = [
  {
    name: "VSCode git commit",
    description:
      "Une extension qui offre une harmonie des messages de commit pour les utilisateurs de VSCode, plus de 7k installations et 30 étoiles github c'est mon projet phare",
    type: "vscode",
    url: "https://gcm-config.netlify.app/",
    images: [IMGVSCodeGitCommit],
  },
  {
    name: "Britch",
    description:
      "Une extension chrome pour twitch, permet un réglage de la luminosité des streams sur twitch",
    type: "chrome",
    url: "https://chrome.google.com/webstore/detail/britch-twitch-brightness/mbakeppieaiacmnfckfmaijhjlelokph",
    images: [IMGBritch1, IMGBritch2],
  },
  {
    name: "Overlay de manette",
    description:
      "Quelques overlay de manette réalisés pour des streameurs twitch selon leur charte graphique",
    type: "graphic",
    url: "https://github.com/rioukkevin/custom-thustmaster-overlay",
    images: [IMGController1, IMGController2, IMGController3],
  },
  {
    name: "Bot Discord AmongUs",
    description:
      "C'est un bot qui permet à des personnes d'organiser une soirée en définissant les disponibilités journalières et horaires de chacun",
    type: "bot",
    url: "https://github.com/rioukkevin/discord-bot-amongus",
    images: [IMGDiscordBotAmongus1, IMGDiscordBotAmongus2],
  },
  {
    name: "Greevel",
    description:
      "Greevel est un prototype fait pour un investisseur sur Angers. Celui-ci souhaite un prototype d'application pour inciter les employés des entreprises de ville à utiliser des moyens de transports commun ou plus écologiques.",
    type: "other",
    url: "mailto:kevin@riou.pro",
    images: [IMGGreevel1, IMGGreevel2, IMGGreevel3, IMGGreevel4],
  },
];

// Reste à ajouter
// Diagevol
// TRR
// VSCodeGitButtons
// Subiby
