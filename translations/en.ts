import { marked } from "marked";
import { ITranslation } from ".";

export const en: ITranslation = {
  home: {
    job1: "Web",
    job2: "Developer",
    info: "I'm looking for a new adventure, if you have one, contact me !",
  },
  settings: {
    isATechlabel: "Show technical informations",
  },
  me: {
    title: "Who am I ?",
    p1: marked.parse(
      "I'm a web developper working at <strong>Alpha8</strong>, a little startup in France, I am a <strong>Freelancer</strong> for occasional assignments, but above all, I am an <strong>open-source</strong> utility developper doing tools for other developpers and players."
    ),
    p2: marked.parse(
      "Passionnate by <strong>automobile</strong>, <strong>development</strong> and <strong>video games</strong>, those are parts of my life. When I can, I develop needs of <strong>twitch commnunity</strong> I am in and needs I find in organizations."
    ),
    p3: marked.parse(
      "I love <strong>meetups</strong>, these are good way to learn new things and meet people."
    ),
    p4: marked.parse(
      "Frontend or Backend, if it is in <strong>JS</strong>, I am your man. For hosting, no problem, a new infrastructure to create ? I can work on it, with <strong>Docker / kubernetes</strong>, I love, helm templating on kub, it is the <strong>paradise</strong> !"
    ),
  },
  works: {
    title: "My recent projects",
    all: "All",
    access: "access",
    types: {
      vscode: "VSCode Extension",
      chrome: "Chrome Extension",
      bot: "Bots",
      frontend: "Web client",
      backend: "APIs",
      graphic: "Graphics",
      mobile: "Smartphone application",
      other: "Other",
    },
    descriptions: {
      vscodeGitCommit: marked.parse(
        "An extension for VSCode that permit colleagues to harmonize their comit messages, more than **7k** install and **30 github stars**, that is my most famous project."
      ),
      britch: marked.parse(
        "A chrome extension for twitch, it permit **luminosity** and **contrast** change without impact of streamer."
      ),
      controllerOverlay: marked.parse(
        "Many **controller overlay** made for streamers following their graphic chart. The overlay is animated with inputs of the streamer."
      ),
      discordBotAmongus: marked.parse(
        "This is a discord bot helping people to **schedule** games of AmongUs in the weeek and in the day by giving **availability** of everyone."
      ),
      greevel: marked.parse(
        "Greevel is a **prototype** made for an Angers investitor. he want a mobile application that incite town's worker to use common transports."
      ),
      diagevol: marked.parse(
        "Diagevol is a website for the product of **Alpha8**, I develop the initial version based on a partial mockup."
      ),
      subiby: marked.parse(
        "Subiby is a **subscription** tracking app, I made it for my needs, I want a place to list all subscriptions I have and a way to know when the account debit append."
      ),
    },
  },
};
