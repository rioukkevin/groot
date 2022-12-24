import { marked } from "marked";
import twemoji from "twemoji";
import { ITranslation } from ".";

export const en: ITranslation = {
  socials: {
    resume: "Resume",
  },
  home: {
    job1: "Web",
    job2: "Developer",
    info: marked.parse(
      twemoji.parse(
        "I'm a fullstack developer at Technis, and also an open-source developer ! Fan of Groot and JS obviously ❤️"
      )
    ),
  },
  settings: {
    isATechlabel: "Show technical informations",
  },
  me: {
    title: "Who am I ?",
    p1: marked.parse(
      "I'm a web developper working at **Technis**, a startup based in Swiss, I am a **Freelancer** for occasional assignments, but above all, I am an **open-source** utility developper doing tools for other developpers and players."
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
  footer: {
    title: "Shoutout",
    link: "Access",
    elements: {
      oxidya: {
        name: "Oxidya_",
        description:
          "Pilot / detective / trainer / ghost hunter .. in short a gamer what ¯_(ツ)_/¯",
      },
      chezkyou: {
        name: "Chezkyou",
        description:
          "ChezKyou is a company created by a young auto-entrepreneur, who likes working with wood and making all kinds of objects.",
      },
      castomize: {
        name: "Castomize",
        description:
          "Castomize is a Belgian company that personalizes your fabrics at low prices. Work on Hoodies, T-Shirt, etc...",
      },
      poachiclash: {
        name: "Poachiclash",
        description:
          "The Poachiclash is a video game tournament by Poachimpa on twitch on 21 & 22 january.",
      },
    },
  },
};
