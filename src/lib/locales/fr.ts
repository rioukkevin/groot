import { ProjectType } from "@/modules/Root/Windows/ProjectsWindow/data";
import contactFr from "./contact/fr";
import experiencesFr from "./experiences/fr";
import newsFr from "./news/fr";

const fr = {
  // Root/Page
  "dock.whoami": "Qui suis-je ?",
  "dock.experiences": "Expériences",
  "dock.projects": "Projets",
  "dock.news": "Actualités",
  "dock.contact": "Contact",
  "dock.tictactoe": "Morpion",
  "dock.settings": "Paramètres",

  // Root/Windows/WhoWindow
  "who.title": "Développeur web fullstack",
  "who.years": "Années d'exp.",
  "who.projects": "Projets",
  "who.about": "À propos",
  "who.description1":
    "Bonjour, je suis Kevin, un développeur web fullstack passionné avec une forte orientation vers les technologies front-end et une solide expérience back-end. En tant que professionnel freelance, je crée des solutions numériques innovantes couvrant tout le spectre du développement web. Je conçois des applications fluides, efficaces et conviviales, du concept au déploiement.",
  "who.description2":
    "J'aime expérimenter et repousser les limites de la technologie web. Je transforme des défis complexes en solutions élégantes et évolutives, de la création d'interfaces utilisateur réactives à l'optimisation des performances côté serveur. Mon enthousiasme pour le développement front-end, combiné à une connaissance approfondie du full-stack, me permet de fournir des expériences web holistiques qui dépassent les attentes. Je suis toujours ravi de collaborer sur des projets innovants et de créer des solutions web expérientielles et impactantes.",

  // Root/Windows/ExperiencesWindow
  "experiences.title": "Expériences",
  "experiences.sortBy": "Trier par :",
  "experiences.mostRecent": "Plus récent",
  "experiences.oldest": "Plus ancien",
  "experiences.present": "Présent",
  "experiences.technologies": "Technologies :",
  "experiences.missions": "Missions :",
  "experiences.achievements": "Réalisations :",
  "experiences.selectExperience":
    "Sélectionnez une expérience pour voir les détails",
  ...experiencesFr,

  // Root/Windows/ProjectsWindow
  "projects.title": "Projets",
  "projects.filter.allTechnologies": "Toutes les technologies",
  "projects.filter.allProjectTypes": "Tous les types de projets",
  "projects.filter.searchPlaceholder": "Rechercher par titre ou description",
  "projects.filter.projectsFound": "{count} projets trouvés",
  "projects.thumbnail.viewMore": "Voir plus",
  "projects.window.projectNotFound": "Projet non trouvé",
  "projects.types": {
    [ProjectType.DISPLAY_WEBSITE]: "Site web",
    [ProjectType.ADMIN_WEBSITE]: "Site d'administration",
    [ProjectType.VSCODE]: "Extension VSCode",
    [ProjectType.MOBILE_APP]: "Application mobile",
    [ProjectType.GRAPHISM]: "Graphisme",
    [ProjectType.CHROME_EXTENSION]: "Extension Chrome",
    [ProjectType.OTHER]: "Autre",
  },

  // Root/Windows/NewsWindow
  "news.title": "Actualités",
  "news.sortBy": "Trier par :",
  "news.mostRecent": "Plus récent",
  "news.oldest": "Plus ancien",
  ...newsFr,

  // Root/Windows/ContactWindow
  "contact.title": "Contact",
  ...contactFr,

  // Root/Windows/TicTacToeWindow
  "tictactoe.restart": "Recommencer",

  // Root/Windows/SettingsWindow
  "settings.title": "Paramètres",
  "settings.language": "Langue",
  "settings.english": "Anglais",
  "settings.french": "Français",
  "settings.theme": "Thème",

  // Theme/Background
  "theme.background.changeBackground": "Changer l'arrière-plan",
  "theme.background.currentBackgroundPreview":
    "Aperçu de l'arrière-plan actuel",
  "theme.background.invalidImageFile":
    "Veuillez sélectionner un fichier image valide.",
  "theme.background.fileTooLarge":
    "La taille du fichier dépasse 4 Mo. Veuillez choisir un fichier plus petit.",

  // WindowManager
  "window.close": "Fermer",
  "window.minimize": "Réduire",
  "window.maximize": "Agrandir",
  "window.restore": "Restaurer",

  // Cookies
  "cookies.cookieMessage":
    "Ce site utilise des cookies pour améliorer votre expérience. En continuant à utiliser ce site, vous acceptez notre utilisation des cookies.",
  "cookies.accept": "Accepter",
  "cookies.moreInfo": "Plus d'infos",
  "cookies.cookiePolicy": "Politique de cookies",
  "cookies.cookiePolicyContent":
    "Notre site web utilise des cookies pour améliorer votre expérience de navigation et fournir du contenu personnalisé. Les cookies sont de petits fichiers texte stockés sur votre appareil qui nous aident à analyser l'utilisation du site, à mémoriser vos préférences et à optimiser les performances. En utilisant notre site, vous consentez à notre utilisation des cookies conformément à notre Politique de cookies.",
} as const;

export default fr;
