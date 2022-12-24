import { marked } from "marked";
import twemoji from "twemoji";
import { ITranslation } from ".";

export const fr: ITranslation = {
  socials: {
    resume: "CV",
  },
  home: {
    job1: "Développeur",
    job2: "Web",
    info: marked.parse(
      twemoji.parse(
        "Je suis développeur fullstack chez Technis, je suis aussi développeur open-source ! Fan de Groot et du JS bien évidemment ❤️"
      )
    ),
  },
  settings: {
    isATechlabel: "Voir les informations techniques",
  },
  me: {
    title: "Qui suis-je ?",
    p1: marked.parse(
      "Actuellement développeur web chez **Technis**, je suis aussi un **indépendant** pour des missions occasionnelles mais surtout, je suis développeur d'utilitaires **open-source** pour le quotidien des développeurs et des joueurs."
    ),
    p2: marked.parse(
      "Passionné par **l'automobile**, le **développement** et les **jeux vidéos**, ces éléments font partie de mon quotidien. Lorsque je peux, je développe des outils pour répondre à mes besoins ou ceux que je rencontre en entreprise ainsi que dans les communautés de **twitch** que je fréquente."
    ),
    p3: marked.parse(
      "Enfin, je suis friands des **meetups** pour y acquérir de nouvelles connaissances y compris sur des sujets non liés au développement."
    ),
    p4: marked.parse(
      "Que ce soit du frontend ou du backend, si c'est dans l'environnement **JS**, je suis votre homme. Pour l'hébergement pas de problèmes non plus, une infra à mettre en place ? je peux m'y ateler, une exploitation de **Docker avec/sans kubernetes**, j'adore, helm en plus pour le templating de kub, quel **bonheur** !"
    ),
  },
  works: {
    title: "Mes projets récents",
    all: "Tout",
    access: "accès",
    types: {
      vscode: "Extensions VSCode",
      chrome: "Extensions Chrome",
      bot: "Bots",
      frontend: "Clients web",
      backend: "APIs",
      graphic: "Graphismes",
      mobile: "Applications Mobiles",
      other: "Autres",
    },
    descriptions: {
      vscodeGitCommit: marked.parse(
        "Une extension qui offre une harmonie des messages de commit pour les utilisateurs de VSCode, plus de **7k** installations et **30 stars github**, c'est mon projet le plus célèbre"
      ),
      britch: marked.parse(
        "Une extension chrome pour twitch, permet un réglage de la **luminosité** et du **contraste** des streams sur twitch sans impacter au diffuseur."
      ),
      controllerOverlay: marked.parse(
        "Quelques **overlays** de **manettes** réalisés pour des streameurs twitch selon leur charte graphique"
      ),
      discordBotAmongus: marked.parse(
        "C'est un bot qui permet à des personnes d'**organiser** une soirée en définissant les **disponibilités** journalières et horaires de chacun"
      ),
      greevel: marked.parse(
        "Greevel est un **prototype** conçu pour un investisseur sur Angers. Celui-ci souhaite une application pour inciter les employés des entreprises de ville à utiliser des moyens de transports en commun ou plus écologiques."
      ),
      diagevol: marked.parse(
        "Diagevol est le site vitrine du produit mis en vente par **Alpha8**, j'ai développé la première version du site en me basant sur une maquette partielle."
      ),
      subiby: marked.parse(
        "Subiby est une interface web que j'ai créée afin de répertorier toutes les **souscriptions** que je paie et savoir quand arrivent les prochains **prélèvements**."
      ),
    },
  },
  footer: {
    title: "Dédicaces",
    link: "Accéder",
    elements: {
      oxidya: {
        name: "Oxidya_",
        description:
          "Pilote / détective / dresseuse / chasseuse de fantôme.. bref une gameuse quoi ¯_(ツ)_/¯",
      },
      chezkyou: {
        name: "chezkyou",
        description:
          "ChezKyou est une entreprise créée par un jeune auto-entrepreneur, qui aime travailler le bois et fabriquer toutes sortes d'objets.",
      },
      castomize: {
        name: "Castomize",
        description:
          "Castomize est une entreprise belge personnalisant vos tissus à petits prix. Travail sur Hoodies, T-Shirt, etc...",
      },
      poachiclash: {
        name: "Poachiclash",
        description:
          "Le Poachiclash est un tournoi de jeu vidéo organisé par la streameuse Poachimpa sur twitch les 21 et 22 janvier.",
      },
    },
  },
};
