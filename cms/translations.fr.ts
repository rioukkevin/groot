/**
 * French content, written rather than machine-translated: the register is
 * first person and professional, the way Kévin would write it, not an English
 * sentence with French words in it.
 *
 * Keys match the English source in content-export/content.json. Anything
 * absent here is simply not written yet — Payload's `fallback: true` serves the
 * English, so a partial file still renders a working site.
 */

interface FrProject {
  name?: string;
  what: string;
  status: string;
  detail: string[];
  links?: string[];
}

export const FR_PROJECTS: Record<string, FrProject> = {
  "vscode-commit": {
    what: "Une extension VSCode qui met les messages de commit au gabarit, depuis l'éditeur.",
    status: "en pause",
    detail: [
      "Une extension qui normalise les messages de commit Git depuis VSCode : une interface qui génère des messages structurés et cohérents, pour qu'un historique de projet reste lisible.",
      "L'idée vient du travail en entreprise, où chaque développeur écrivait ses messages à sa façon et où l'historique devenait difficile à suivre. Un cadre uniforme fait de la convention le chemin le plus court, plutôt qu'un document que personne n'ouvre.",
      "Plus de 40 étoiles sur GitHub et plus de 20 000 téléchargements. Les chiffres disent qu'elle a trouvé les développeurs qui avaient le même problème.",
      "Après la première version, j'ai ajouté un site dédié : un générateur de configuration avec une vraie interface, et une version web de la documentation.",
      "Le développement est en pause, délibérément. La suite étend la même idée à plusieurs éditeurs, depuis un seul fichier de configuration plus souple.",
    ],
    links: ["Marketplace", "Documentation", "Générateur de configuration"],
  },
  britch: {
    what: "Une extension Chrome qui ajoute un réglage de luminosité et de contraste à Twitch.",
    status: "en ligne",
    detail: [
      "Britch donne aux spectateurs de Twitch un contrôle précis sur la luminosité et le contraste d'un direct, pour ajuster l'image à l'écran sur lequel elle est réellement regardée.",
      "C'est parti d'une remarque revenue souvent : les spectateurs ne distinguaient pas clairement ce qui se passait à l'écran.",
      "La vidéo de Twitch est fréquemment plus sombre que ce que le streamer a envoyé, ce qui gêne surtout sur les jeux d'horreur et les scènes sombres. Chaque écran est différent, donc le réglage doit être individuel plutôt que global.",
    ],
    links: ["Chrome Web Store"],
  },
  overlays: {
    name: "Overlays de manette sur mesure",
    what: "Des overlays de manette interactifs, faits pour des streamers Twitch.",
    status: "en cours",
    detail: [
      "Des overlays que je construis de temps en temps pour des streamers — une façon de rendre quelque chose à la communauté, en ajoutant de la valeur visible à un direct.",
      "Ils affichent les entrées du streamer en temps réel : les spectateurs voient les gestes derrière le jeu, pas seulement le résultat. Ça rend le niveau lisible.",
      "Techniquement, ce sont des images animées en JavaScript, ce qui les garde assez souples pour être taillées pour chaque streamer.",
      "Pour Dgifou, un overlay sur mesure respectant sa charte graphique à la lettre, pour qu'il fasse partie de la chaîne plutôt que d'être posé dessus.",
      "Pour Amphirae, le projet a suivi le matériel : une version PS4 d'abord, puis une PS5.",
      "Oxidya_ montre jusqu'où va la personnalisation — une version générale d'abord, puis une déclinaison spécifique pour chaque jeu qu'elle diffuse au quotidien.",
    ],
    links: ["GitHub"],
  },
  "outrans-counter": {
    what: "Un compteur d'entrées synchronisé pour les 15 ans de l'association Outrans.",
    status: "livré",
    detail: [
      "Une application web mobile construite pour les quinze ans de l'association Outrans. La jauge était limitée, il fallait donc aux bénévoles un compteur synchronisé sur plusieurs appareils pour gérer les entrées précisément.",
      "L'accès passe par des codes hachés — léger, mais suffisant pour que seuls les bénévoles à l'entrée atteignent les données.",
      "Au-delà du comptage, des scripts produisent des statistiques détaillées : l'association garde une image de la façon dont l'événement s'est réellement déroulé, et de quoi préparer le suivant.",
    ],
    links: ["Site d'Outrans"],
  },
  diagevol: {
    what: "Le site vitrine du produit SaaS d'Alpha8, DiagEvol.",
    status: "en ligne",
    detail: [
      "Réalisé pendant mon CDI chez Alpha8 : le site vitrine diagevol.fr, mené depuis des maquettes partielles jusqu'à la production.",
      "Diagevol est le SaaS de questionnaires et de diagnostics d'Alpha8. Le site devait rendre ses fonctions lisibles — questionnaires sur mesure, analyse automatique des réponses, rapports générés — et montrer en quoi il change la manière dont une entreprise recueille et lit ses propres données.",
      "J'ai produit les visuels et développé la majeure partie du site seul, dans un délai serré : il a fallu prioriser les modules qui portaient l'enjeu commercial et laisser le reste attendre.",
    ],
    links: ["Site"],
  },
  ooof: {
    what: "Le site d'ooof.dev, l'activité freelance devenue Nareli.",
    status: "remplacé par Nareli",
    detail: [
      "Un portfolio interactif pour l'activité freelance — compétences, projets, et une porte d'entrée pour les clients cherchant quelqu'un pour construire la chose.",
      "Le nom est le son du moment où un client trouve enfin le développeur qu'il cherchait. Mémorable, et honnête sur ce qu'est le métier.",
      "Le site détaille la méthode en entier : analyse du besoin, cycles courts, communication transparente, livraison. C'est la structure qui rend la collaboration prévisible.",
      "Les prestations allaient des sites responsives et applications iOS/Android à la formation et aux travaux d'architecture.",
    ],
    links: ["Profil GitHub"],
  },
  "portfolio-v6": {
    what: "Le portfolio resté en ligne deux ans, jusqu'en octobre 2024.",
    status: "retiré en 2024",
    detail: [
      "Conçu en 2022 pour attirer l'attention des recruteurs sur un poste en CDI, et resté en ligne deux ans.",
      "Volontairement minimal : un design sobre, pour qu'un visiteur regarde le travail plutôt que l'emballage.",
      "La performance et le référencement ont eu une vraie attention — en partie pour les apprendre correctement, en partie parce que l'essentiel du trafic venait du mobile. Le résultat était rapide, responsive et bien indexé.",
      "Il portait des recommandations pour des projets qui le méritaient, dont le tournoi poachiclash.com et les produits d'un artisan alsacien.",
      "La partie la plus difficile, et la meilleure, a été d'écrire un système de traduction de zéro, ce qui oblige à démonter le fonctionnement réel des bibliothèques existantes.",
      "Storyblok gérait le contenu — un CMS headless choisi pour apprendre, et l'expérience est passée directement dans les missions freelance.",
    ],
    links: ["GitHub"],
  },
  "portfolio-v5": {
    what: "Le portfolio de 2021, écrit pour la candidature chez Brioche Pasquier.",
    status: "retiré",
    detail: [
      "La version cinq, de 2021 — la carte de visite numérique écrite pour le processus de recrutement de Brioche Pasquier.",
      "C'était aussi un laboratoire : un prétexte pour pousser les animations CSS plus loin qu'aucun projet client ne l'aurait permis, et voir ce qui se construit sans recourir à une bibliothèque.",
      "Son hébergement raconte sa propre histoire — une machine Docker d'abord, puis Netlify, puis Vercel, chaque déplacement achetant des déploiements plus simples et de meilleures performances.",
    ],
    links: ["GitHub"],
  },
  "twitch-bot": {
    name: "Bot de stream Poachimpa",
    what: "Un bot d'engagement pour le stream de Poachimpa — événements, statistiques, spectateurs.",
    status: "en ligne",
    detail: [
      "Une chaîne en direct produit des événements plus vite que quiconque peut les suivre, et rien n'en était conservé.",
      "Le bot suit ce qui se passe, gère les spectateurs, construit des statistiques et fait tourner les mécaniques d'engagement pendant le direct.",
      "Le mien de bout en bout, y compris le support quand il casse en pleine diffusion.",
    ],
  },
  chariteam: {
    what: "Un site pour l'association Chariteam, pour suivre événements et dons.",
    status: "en ligne",
    detail: [
      "Les dons et les événements étaient suivis à la main, par qui se trouvait les organiser.",
      "Un seul endroit pour les événements et les dons qui s'y rattachent, construit et maintenu pour l'association.",
    ],
  },
};

export const FR_ROLES: Record<
  string,
  { when: string; what: string; where: string; detail: [string, string][] }
> = {
  nareli: {
    when: "2024 — auj.",
    what: "CEO · Nareli",
    where: "Paris / à distance",
    detail: [
      ["Périmètre", "Fondation de Nareli, en partenariat avec @StartAndBrand. Toute l'activité freelance fullstack passe par elle — cadrage, architecture, livraison, et l'appel de support qui suit."],
      ["Historique", "Sous le nom ooof.dev depuis août 2024 ; l'activité est devenue Nareli en octobre 2025. Le même travail, un seul nom."],
      ["Au quotidien", "Des développements fullstack et mobile pour des équipes qui ont besoin d'une personne pour porter l'ensemble."],
    ],
  },
  technis: {
    when: "2022 — 2024",
    what: "Développeur fullstack · Technis",
    where: "Paris",
    detail: [
      ["Entreprise", "Société suisse de sols intelligents : des sols à capteurs qui suivent les déplacements, dans le sport, la santé et le commerce."],
      ["Périmètre", "Les applications web qui présentent le résultat de ces données, et l'architecture derrière, pour une équipe d'expérimentation."],
      ["Encadrement", "Une équipe de développeurs pendant trois mois à l'échelle internationale, et un projet mené de bout en bout — idée, production, support, planning, et les personnes dessus."],
      ["Livré", "Participation au projet des Jeux Olympiques à son démarrage, pendant que l'entreprise recrutait une équipe dédiée."],
      ["Laissé", "Une habitude de documentation dans l'équipe web, et de meilleures pratiques front que celles trouvées en arrivant."],
    ],
  },
  freelance: {
    when: "2020 — 2022",
    what: "Développeur web freelance",
    where: "France",
    detail: [
      ["Périmètre", "Développement web indépendant, mené en parallèle du contrat Alpha8 sur la majeure partie de sa durée."],
      ["Au quotidien", "Des développements fullstack pour qui en avait besoin, sous mon propre nom, avant qu'ooof.dev existe."],
    ],
  },
  alpha8: {
    when: "2020 — 2022",
    what: "Développeur fullstack · Alpha8",
    where: "Denée",
    detail: [
      ["Entreprise", "Un SaaS tout-en-un dans l'esprit de Google Workspace, destiné aux consultants."],
      ["Périmètre", "Fullstack sur une partie de la plateforme, puis l'architecture pour la mettre à l'échelle. Deux ans, deux contrats, le même travail."],
      ["Encadrement", "Une équipe sur le générateur de rapports personnalisables — la partie la plus complexe du produit."],
      ["Résolu", "Faire dialoguer les systèmes entre eux avec la fédération Apollo, et construire un environnement de développement que les gens utilisent vraiment."],
      ["Aussi", "Conception de l'interface de l'application, et conseil aux fondateurs sur la direction à prendre."],
    ],
  },
  pasquier: {
    when: "2019 — 2020",
    what: "Assistant R&D · Brioche Pasquier",
    where: "Les Cerqueux",
    detail: [
      ["Entreprise", "Groupe agroalimentaire français, avec une DSI qui mène sa propre R&D sur ses outils internes."],
      ["Construit", "Un kit d'interface en Vue 2, pensé autour des habitudes réelles des utilisateurs internes, et l'écosystème autour."],
      ["Livré", "Des composants modulaires et réutilisables à partir desquels les équipes assemblaient leurs applications, ce qui a réduit le temps de développement des projets internes."],
      ["Transmis", "Formation des développeurs du service à l'écosystème, et rédaction de la documentation de chaque choix qui le compose."],
    ],
  },
  triskalia: {
    when: "2018 — 2019",
    what: "Développeur web · Triskalia",
    where: "Landerneau",
    detail: [
      ["Entreprise", "Grande coopérative agricole française, devenue Eureden, en pleine transformation numérique."],
      ["Périmètre", "Le front pour le web et le mobile, et l'architecture des applications Vue."],
      ["Encadrement", "Le passage à Vue comme framework front principal, avec l'équipe."],
      ["Construit", "Une application de gestion comptable, une application de suivi de parcelles utilisée par les agriculteurs, et une vue chronologique complexe écrite en JavaScript natif pour les anciens systèmes."],
    ],
  },
  cdg29: {
    when: "2017 — 2018",
    what: "Technicien informatique · CDG29",
    where: "Quimper",
    detail: [
      ["Structure", "Centre de Gestion de la Fonction Publique Territoriale du Finistère."],
      ["Périmètre", "Technicien informatique, en alternance. La première."],
    ],
  },
};

export const FR_EDUCATION: Record<string, string> = {
  "2019 — 2021": "MBA · Expert en système d'information",
  "2018 — 2019": "Licence pro · Métiers du web",
  "2016 — 2018": "DUT Informatique",
};

export const FR_SITE = {
  tagline: "fullstack web & mobile, freelance",
  location: "Paris, France",
  about:
    "Développeur web et mobile fullstack, freelance, basé à Paris. Je dirige Nareli, en partenariat avec @StartAndBrand.",
  headline: "Disponible à partir de mi-septembre 2026.",
  contactFooter: "Paris, France · CET · français, anglais",
  nowRows: [
    "## Disponibilité",
    "",
    "Complet jusqu'à la fin de l'été.",
    "Pas de nouveaux appels de cadrage.",
    "Disponible à partir de mi-septembre 2026.",
    "J'accepte de nouvelles missions — les appels de cadrage sont gratuits.",
    "",
    "## En ce moment",
    "Je dirige Nareli, en partenariat avec @StartAndBrand.",
    "Développements fullstack et mobile pour de petites équipes.",
    "",
    "## En cours",
    "Portfolio v9 · un terminal que vous pilotez. Vous y êtes.",
    "Projets personnels · bots, outils, et le compteur.",
    "",
    "## Tarifs",
    "600 € dev · 500 € management · 1 000 € conseil",
  ],
  softSkills: [
    ["diriger", ["Management d'équipe", "Pilotage de projet", "Direction technique", "Avis sur le recrutement"]],
    ["avec les autres", ["Mentorat", "Formation", "Empathie", "Relation client", "Refuser une dérive de périmètre"]],
    ["ma façon de travailler", ["Documentation", "Pragmatisme", "Autonomie", "Support après livraison", "Livrer petit d'abord"]],
  ] as [string, string[]][],
  stackGroups: [
    ["langages", ["TypeScript", "JavaScript", "PHP", "C#"]],
    ["front", ["React", "Next.js", "Vue", "Nuxt", "Tailwind", "Sass", "CSS-in-JS"]],
    ["back", ["Node", "NestJS", "Express", "Koa", "GraphQL", "REST", "Socket.io"]],
    ["mobile", ["React Native", "Expo", "Cordova", "NativeScript"]],
    ["données", ["PostgreSQL", "MongoDB", "Prisma", "Firebase", "Supabase"]],
    ["ia", ["API de LLM", "Agents & MCP", "RAG", "Embeddings", "Développement assisté par IA"]],
    ["infra", ["Docker", "Kubernetes", "Helm", "Vercel", "Netlify", "OVHcloud", "Scaleway"]],
    ["tests", ["Playwright", "Vitest", "Jest"]],
  ] as [string, string[]][],
  rates: [
    ["développement", "600 € / jour · fullstack, web et mobile"],
    ["management", "500 € / jour · encadrement d'équipe ou de projet"],
    ["conseil", "1 000 € / jour · architecture et direction technique"],
    ["forfait", "quand le périmètre est assez clair pour être honnête"],
  ] as [string, string][],
  resume: [
    "KÉVIN RIOU — DÉVELOPPEUR WEB & MOBILE FULLSTACK (FREELANCE)",
    "Paris, France · kevin@nare.li · github.com/rioukkevin · in/kevinatooof",
    "",
    "EXPÉRIENCE",
    "2024—auj.  CEO · Nareli (ooof.dev jusqu'en oct. 2025) · Paris / à distance",
    "2022—2024  Développeur fullstack · Technis · Paris",
    "2020—2022  Développeur web freelance · France",
    "2020—2022  Développeur fullstack · Alpha8 · Denée",
    "2019—2020  Assistant R&D · Brioche Pasquier · Les Cerqueux",
    "2018—2019  Développeur web · Triskalia (Eureden) · Landerneau",
    "2017—2018  Technicien informatique · CDG29 · Quimper",
    "",
    "FORMATION",
    "2019—2021  MBA Expert en système d'information · MyDigitalSchool Angers",
    "2018—2019  Licence pro Métiers du web · Université de Rennes I",
    "2016—2018  DUT Informatique · Université de Rennes I",
    "",
    "STACK",
    "TypeScript, React/Next.js, Vue/Nuxt, Node/NestJS, GraphQL, React Native,",
    "PostgreSQL, MongoDB, Docker, Kubernetes",
    "",
    "TARIFS",
    "600 €/jour développement · 500 €/jour management · 1 000 €/jour conseil",
    "Disponible à partir de mi-septembre 2026.",
  ].join("\n"),
};

/** Command descriptions, keyed by the command itself. */
export const FR_COMMANDS: Record<string, string> = {
  "/projects": "projets personnels — stack, statut, ce qu'ils résolvaient",
  "/project": "un projet en détail · /project portfolio",
  "/roles": "postes, dates, ce que j'y ai fait",
  "/role": "un poste en détail · /role nareli",
  "/education": "diplômes et d'où ils viennent",
  "/about": "la version courte, avec un visage",
  "/skills": "savoir-être — comment je travaille avec les gens",
  "/stack": "compétences techniques, IA comprise · alias /techs",
  "/email": "juste l'adresse, rien d'autre",
  "/now": "ce qui a changé ce mois-ci (diff)",
  "/photos": "travaux, écrans, logos",
  "/rates": "tarifs journaliers et comment je chiffre",
  "/contact": "email, github, linkedin",
  "/resume": "télécharger un CV en texte brut",
  "/theme": "huit palettes, cinq sombres et trois claires",
  "/voice": "chaleureux · bref · sec",
  "/clear": "effacer la transcription",
  "/components": "le kit d'interface du terminal, en direct",
  "/help": "tout ce qui précède",
};

/** Contact wizard, keyed by step. */
export const FR_WIZARD: Record<
  string,
  {
    group: string;
    question: string;
    label?: string;
    options?: { value: string; label: string; hint: string }[];
  }
> = {
  project: {
    group: "Projet",
    question: "Quel type de projet avez-vous en tête ?",
    options: [
      { value: "Web application", label: "Application web", hint: "fullstack, du front au déploiement" },
      { value: "Mobile application", label: "Application mobile", hint: "React Native · Expo" },
      { value: "Architecture & consulting", label: "Architecture", hint: "conseil · direction" },
      { value: "Team lead / management", label: "Encadrement", hint: "diriger une équipe ou un projet" },
      { value: "Something else", label: "Autre chose", hint: "dites-le moi ci-dessous" },
    ],
  },
  budget: {
    group: "Budget",
    question: "Sur quel budget travaillez-vous ?",
    options: [
      { value: "Under €6K", label: "Moins de 6 000 €", hint: "une dizaine de jours" },
      { value: "€6K – €15K", label: "6 000 – 15 000 €", hint: "environ un mois" },
      { value: "€15K – €40K", label: "15 000 – 40 000 €", hint: "deux à trois mois" },
      { value: "€40K+", label: "Plus de 40 000 €", hint: "une mission longue" },
      { value: "Not sure yet", label: "Pas encore fixé", hint: "on peut le cadrer ensemble" },
    ],
  },
  timeline: {
    group: "Délai",
    question: "Pour quand ?",
    options: [
      { value: "As soon as possible", label: "Dès que possible", hint: "libre à partir de mi-septembre" },
      { value: "1–2 months", label: "1 à 2 mois", hint: "démarrage proche" },
      { value: "3–6 months", label: "3 à 6 mois", hint: "on anticipe" },
      { value: "Flexible", label: "Flexible", hint: "pas de date fixe" },
    ],
  },
  name: { group: "Détails", question: "À qui ai-je affaire ?", label: "nom" },
  email: { group: "Détails", question: "Où dois-je répondre ?", label: "email" },
  company: { group: "Détails", question: "L'entreprise, s'il y en a une.", label: "société" },
  details: {
    group: "Détails",
    question: "Parlez-m'en — que construisez-vous, et qu'est-ce qui bloque ?",
    label: "détails",
  },
};

export const FR_THEMES: Record<string, string> = {
  green: "phosphore sur presque noir",
  ember: "ambre chaud, plus doux",
  ice: "bleu froid, peu éblouissant",
  plum: "violet sur presque noir",
  mono: "niveaux de gris, sans teinte",
  paper: "clair, manuel imprimé",
  white: "blanc franc, encre bleue",
  linen: "blanc chaud, encre rouille",
};

export const FR_VOICES: Record<string, string> = {
  warm: "phrases complètes, à la première personne",
  brief: "complet, mais rien de superflu",
  terse: "sec, énergie sysadmin",
};

export const FR_UI = {
  promptPlaceholder: "posez une question, ou / pour les commandes",
  banner: "Disponible pour de nouvelles missions à partir de mi-septembre",
  modeHint: "(shift+tab pour changer de langue) · ? pour les raccourcis",
};
