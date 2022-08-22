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
      "I'm a web developper working at **Alpha8**, a little startup in France, I am a **Freelancer** for occasional assignments, but above all, I am an **open-source** utility developper doing tools for other developpers and players."
    ),
    p2: marked.parse(
      "Passionnate by **automobile**, **development** and **video games**, those are parts of my life. When I can, I develop needs of **twitch commnunity** I am inside and needs I find in organizations."
    ),
    p3: marked.parse(
      "I love **meetups**, these are good way to learn new things and meet people."
    ),
    p4: marked.parse(
      "Frontend or Backend, if it is in **JS**, I am your man. For hosting, no problem, a new infrastructure to create ? I can work on it, with **Docker / kubernetes**, I love, helm templating on kub, this is **heaven** !"
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
        "An extension for VSCode that allows colleagues to harmonize their commit messages, more than **7k** installs and **30 github stars**, this is my most famous project."
      ),
      britch: marked.parse(
        "A chrome extension for twitch, which allows users to change **luminosity** and **contrast** without any impact on the streamer."
      ),
      controllerOverlay: marked.parse(
        "Many **controller overlay** made for streamers following their graphic chart. The overlay is animated with inputs made by the streamer."
      ),
      discordBotAmongus: marked.parse(
        "This is a discord bot helping people to **schedule** games of AmongUs in weeks and days by giving **availability** of everyone."
      ),
      greevel: marked.parse(
        "Greevel is a **prototype** made for an Angevine investor. He wanted a mobile application that encourages city workers to use public transport."
      ),
      diagevol: marked.parse(
        "Diagevol is a website for the product of **Alpha8**, I develop the initial version based on a partial mockup."
      ),
      subiby: marked.parse(
        "Subiby is a **subscription** tracking application, I did it for my purposes. I want a place to list all the subscriptions I have and a way to find out when the account charge is added."
      ),
    },
  },
};
