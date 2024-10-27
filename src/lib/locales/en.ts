import { ProjectType } from "@/modules/Root/Windows/ProjectsWindow/data";

import contactEn from "./contact/en";
import emailEn from "./email/en";
import experiencesEn from "./experiences/en";
import newsEn from "./news/en";
import { projectsEn } from "./projects/en";

const en = {
  // Root/Page
  "dock.whoami": "Who am I ?",
  "dock.experiences": "Experiences",
  "dock.projects": "Projects",
  "dock.news": "News",
  "dock.contact": "Contact",
  "dock.tictactoe": "TicTacToe",
  "dock.settings": "Settings",
  "dock.awards": "Awards",

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

  // Root/Windows/ProjectsWindow
  "projects.title": "Projects",
  "projects.filter.allTechnologies": "All Technologies",
  "projects.filter.allProjectTypes": "All Project Types",
  "projects.filter.searchPlaceholder": "Search by title or description",
  "projects.filter.projectsFound": "projects found",
  "projects.thumbnail.viewMore": "View More",
  "projects.window.projectNotFound": "Project not found",
  "projects.gallery.previewTitle": "Gallery Preview",
  "projects.types": {
    [ProjectType.DISPLAY_WEBSITE]: "Display Website",
    [ProjectType.ADMIN_WEBSITE]: "Admin Website",
    [ProjectType.VSCODE]: "VSCode Extension",
    [ProjectType.MOBILE_APP]: "Mobile App",
    [ProjectType.GRAPHISM]: "Graphism",
    [ProjectType.CHROME_EXTENSION]: "Chrome Extension",
    [ProjectType.OTHER]: "Other",
  },
  ...projectsEn,

  // Root/Windows/NewsWindow
  "news.title": "News",
  "news.sortBy": "Sort by:",
  "news.mostRecent": "Most recent",
  "news.oldest": "Oldest",
  "news.subscribe": "Subscribe",
  "news.error.subscribe": "Failed to subscribe. Please try again later.",
  "news.emailPlaceholder": "Enter your email...",
  "news.subscribed": "You are subscribed to my news.",
  "news.error.alreadySubscribed":
    "You are already subscribed to my news with this email.",
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
  "settings.chatUsername": "Chat username",
  "settings.chatUsernamePlaceholder": "Anonymous",

  // Theme/Background
  "theme.background.changeBackground": "Change Background",
  "theme.background.currentBackgroundPreview": "Current background preview",
  "theme.background.invalidImageFile": "Please select a valid image file.",
  "theme.background.fileTooLarge":
    "File size exceeds 4MB. Please choose a smaller file.",

  // WindowManager
  "window.close": "Close",
  "window.minimize": "Minimize",
  "window.maximize": "Maximize",
  "window.restore": "Restore",

  // Cookies
  "cookies.cookieMessage":
    "This website uses cookies to enhance your experience. By continuing to use this site, you agree to our use of cookies.",
  "cookies.accept": "Accept",
  "cookies.moreInfo": "More Info",
  "cookies.cookiePolicy": "Cookie Policy",
  "cookies.cookiePolicyContent":
    "Our website uses cookies to improve your browsing experience and provide personalized content. Cookies are small text files stored on your device that help us analyze site usage, remember your preferences, and optimize performance. By using our site, you consent to our use of cookies in accordance with our Cookie Policy.",

  // Screen/ScreenSizeWarning
  "screenSizeWarning.message":
    "This experience is designed primarily for computers with a minimum HD screen resolution.",

  // Root/Windows/ChatWindow
  "chat.title": "Chat",
  "chat.inputPlaceholder": "Type a message...",
  "chat.send": "Send",
  "chat.chooseUsername": "Choose a username...",
  "chat.saveUsername": "Save",
  "chat.liveDescription":
    "This chat is live with all person connected on this website all around the world ! \n Please be respectful and kind to each other (your IP address is saved).",
  "chat.error.sendMessage":
    "Failed to send message. Please try again later. Our chat provider is currently down.",
  "chat.error.fetchMessages":
    "Failed to fetch messages. Please try again later. Our chat provider is currently down.",

  // Unsubscribe
  "unsubscribe.title": "Unsubscribe",
  "unsubscribe.success": "You have been unsubscribed from our mailing list.",
  "unsubscribe.returnHome": "Return to Home",
  "unsubscribe.error":
    "An error occurred while processing your request. Please try again later.",

  // Emails
  ...emailEn,
} as const;

export default en;
