import { ProjectType } from "@/modules/Root/Windows/ProjectsWindow/data";

import contactFr from "./contact/fr";
import emailFr from "./email/fr";
import experiencesFr from "./experiences/fr";
import newsFr from "./news/fr";
import { projectsFr } from "./projects/fr";

const fr = {
  // Root/Page
  "dock.whoami": "Qui suis-je ?",
  "dock.experiences": "Expériences",
  "dock.projects": "Projets",
  "dock.news": "Actualités",
  "dock.contact": "Contact",
  "dock.tictactoe": "Morpion",
  "dock.settings": "Paramètres",
  "dock.awards": "Récompenses",

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
  "projects.filter.projectsFound": "projets trouvés",
  "projects.thumbnail.viewMore": "Voir plus",
  "projects.window.projectNotFound": "Projet non trouvé",
  "projects.gallery.previewTitle": "Aperçu de la galerie",
  "projects.types": {
    [ProjectType.DISPLAY_WEBSITE]: "Site web",
    [ProjectType.ADMIN_WEBSITE]: "Site d'administration",
    [ProjectType.VSCODE]: "Extension VSCode",
    [ProjectType.MOBILE_APP]: "Application mobile",
    [ProjectType.GRAPHISM]: "Graphisme",
    [ProjectType.CHROME_EXTENSION]: "Extension Chrome",
    [ProjectType.OTHER]: "Autre",
  },
  ...projectsFr,

  // Root/Windows/NewsWindow
  "news.title": "Actualités",
  "news.sortBy": "Trier par :",
  "news.mostRecent": "Plus récent",
  "news.oldest": "Plus ancien",
  "news.subscribe": "S'abonner",
  "news.error.subscribe":
    "Impossible de s'abonner. Veuillez réessayer plus tard.",
  "news.emailPlaceholder": "Entrez votre email...",
  "news.subscribed": "Vous êtes abonné à mes actualités.",
  "news.error.alreadySubscribed":
    "Vous êtes déjà abonné à mes actualités avec cet email.",
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
  "settings.chatUsername": "Nom d'utilisateur du chat",
  "settings.chatUsernamePlaceholder": "Anonyme",

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

  // Screen/ScreenSizeWarning
  "screenSizeWarning.message":
    "Cette expérience est conçue principalement pour les ordinateurs avec une résolution d'écran HD minimale.",

  // Root/Windows/ChatWindow
  "chat.title": "Chat",
  "chat.inputPlaceholder": "Tapez un message...",
  "chat.send": "Envoyer",
  "chat.chooseUsername": "Choisissez un nom d'utilisateur...",
  "chat.saveUsername": "Enregistrer",
  "chat.liveDescription":
    "Ce chat est en direct avec toutes les personnes connectées sur ce site web à travers le monde ! \n Soyez respectueux et gentil les uns envers les autres (votre adresse IP est enregistrée).",
  "chat.error.sendMessage":
    "Impossible d'envoyer un message. Veuillez réessayer plus tard. Notre fournisseur de chat est actuellement en panne.",
  "chat.error.fetchMessages":
    "Impossible de récupérer les messages. Veuillez réessayer plus tard. Notre fournisseur de chat est actuellement en panne.",

  // Unsubscribe
  "unsubscribe.title": "Désabonnement",
  "unsubscribe.success": "Vous avez été désabonné de notre liste de diffusion.",
  "unsubscribe.returnHome": "Retour à l'accueil",
  "unsubscribe.error":
    "Une erreur s'est produite lors du traitement de votre demande. Veuillez réessayer plus tard.",

  // Emails
  ...emailFr,
} as const;

export default fr;
