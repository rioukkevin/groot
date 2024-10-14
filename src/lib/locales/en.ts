import contactEn from "./contact/en";
import experiencesEn from "./experiences/en";
import newsEn from "./news/en";

const en = {
  // Root/Page
  "dock.whoami": "Who am I ?",
  "dock.experiences": "Experiences",
  "dock.projects": "Projects",
  "dock.news": "News",
  "dock.contact": "Contact",
  "dock.tictactoe": "TicTacToe",
  "dock.settings": "Settings",

  // Root/Windows/WhoWindow
  "who.title": "Fullstack web developer",
  "who.years": "Years of exp.",
  "who.projects": "Projects",
  "who.about": "About",
  "who.description1":
    "Hi, I'm Kevin, a passionate Fullstack Web Developer with a strong focus on front-end technologies and solid back-end experience. As a freelance professional, I create innovative digital solutions across the entire web development spectrum. I craft seamless, efficient, and user-friendly applications from concept to deployment.",
  "who.description2":
    "I love experimenting and pushing the boundaries of web technology. I turn complex challenges into elegant, scalable solutions, from building responsive UIs to optimizing server-side performance. My enthusiasm for front-end development, combined with comprehensive full-stack knowledge, enables me to deliver holistic web experiences that exceed expectations. I'm always excited to collaborate on innovative projects and create impactful, experiential web solutions.",

  // Root/Windows/ExperiencesWindow
  "experiences.title": "Experiences",
  "experiences.sortBy": "Sort by:",
  "experiences.mostRecent": "Most recent",
  "experiences.oldest": "Oldest",
  "experiences.present": "Present",
  "experiences.technologies": "Technologies:",
  "experiences.missions": "Missions:",
  "experiences.achievements": "Achievements:",
  "experiences.selectExperience": "Select an experience to view details",
  ...experiencesEn,

  // Root/Windows/NewsWindow
  "news.title": "News",
  "news.sortBy": "Sort by:",
  "news.mostRecent": "Most recent",
  "news.oldest": "Oldest",
  ...newsEn,

  // Root/Windows/ContactWindow
  "contact.title": "Contact",
  ...contactEn,

  // Root/Windows/TicTacToeWindow
  "tictactoe.restart": "Restart",

  // Root/Windows/SettingsWindow
  "settings.title": "Settings",
  "settings.language": "Language",
  "settings.english": "English",
  "settings.french": "French",
  "settings.theme": "Theme",

  // Theme/Background
  "theme.background.changeBackground": "Change Background",
  "theme.background.currentBackgroundPreview": "Current background preview",
  "theme.background.invalidImageFile": "Please select a valid image file.",

  // WindowManager
  "window.close": "Close",
  "window.minimize": "Minimize",
  "window.maximize": "Maximize",
  "window.restore": "Restore",
} as const;

export default en;
