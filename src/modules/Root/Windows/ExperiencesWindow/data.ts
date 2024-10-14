import { useMemo } from "react";

export interface ExperienceData {
  company: string;
  job: string;
  startDate: string;
  endDate: string;
  about: string;
  technologies: string[];
  missions: string[];
  achievements: string[];
  color: string;
}

export const useExperiencesData = () => {
  const experiencesData = useMemo<ExperienceData[]>(
    () => [
      {
        company: "Ooof.dev",
        job: "Fullstack web developer - Freelance",
        startDate: "2024-09-01",
        endDate: "Present",
        about:
          "Ooof.dev is my commercial name for freelancing. As a freelance developer, I operate under this brand to provide professional web development services.",
        technologies: [
          "React",
          "Next.js",
          "Node.js",
          "TypeScript",
          "GraphQL",
          "REST APIs",
        ],
        missions: [
          "Full-stack web development",
          "Custom software solutions",
          "Technical consulting",
        ],
        achievements: [],
        color: "#FF6B6B",
      },
      {
        company: "Side projects",
        job: "Fullstack web developer - No Contract",
        startDate: "2016-01-01",
        endDate: "Present",
        about:
          "In my free time, i'm working on personal subjects I have, some for my needs, others for streaming needs or association needs",
        technologies: [
          "Javascript",
          "Typescript",
          "React.js",
          "Vue.js2/3",
          "NextJS",
          "NuxtJS",
          "Pug",
          "CSS",
          "Sass/Scss",
          "Less",
          "TailwindCSS",
          "ReactNative",
          "Expo.js",
          "Node.JS",
          "REST",
          "GraphQL",
          "NestJS",
          "Socket.io",
          "Express",
          "Koa",
          "Vercel",
          "Netlify",
          "Firebase",
          "Supabase",
          "Glitch",
          "Heroku",
          "Docker",
          "Kubernetes",
          "Helm",
          "OVHCloud (dedicated server)",
          "Expo Cloud",
          "Github",
          "Gitlab",
        ],
        missions: [],
        achievements: [
          "Open-source VSCode extension to manage commit messages with a customizable template",
          "A Portfolio to showcase some of my projects and explore technologies, 6 differents versions since 2016",
          "A website for the Chariteam association to track events and donations",
          "A complex twitch bot for Poachimpa's streaming to help creating engagement, track any events that occur, get statistics, manage viewers",
          "Scripts and Bots for discord to help organize meetings or help everyday with funny interactions",
          "A beting mobile application canceled before it was published",
          "Some web interfaces to have subscriptions statistics",
          "A multiple devices synced counter for Outtrans 15 years association event to manage entries in the event",
        ],
        color: "#4ECDC4",
      },
      {
        company: "Technis",
        job: "Fullstack web developer - Permanent Contract",
        startDate: "2022-11-01",
        endDate: "2024-08-02",
        about:
          "Technis is a Swiss technology company specializing in smart flooring solutions. They develop intelligent flooring systems that use sensor technology to track movement and gather data. Technis' products are applied in various sectors including sports facilities, healthcare environments, and retail spaces, enabling real-time analysis of foot traffic, movement patterns, and other metrics.",
        technologies: [
          "React.js",
          "Node.js",
          "TypeScript",
          "CSS-in-JS/Styled component/TailwindCSS",
          "GraphQL",
          "REST",
          "MongoDB",
          "PostgreSQL",
          "Google Cloud",
          "Firebase",
          "Supabase",
          "Git",
        ],
        missions: [
          "Developing web application to display data exploitation result",
          "Managed development teams",
          "Designed and implemented architecture for web-based systems for an experiment team",
          "Led end-to-end project, including human ressources management, timeline, communication with dependencies, technical solutions, ...",
          "Conducted design reviews to optimize user experience and system performance",
        ],
        achievements: [
          "Managing a developer team for 3 months in a row on international level.",
          "Initialise a documentation movement in the web team",
          "Lead a project from A to Z, from the idea to the production and support",
          "Participate in Olympics project at start while the company was looking for a dedicated team recruitment",
          "Push good practices on the frontend side of web development",
        ],
        color: "#45B7D1",
      },
      {
        company: "ALPHA8",
        job: "Fullstack web developer - Alternance & Permanent Contract",
        startDate: "2020-09-01",
        endDate: "2022-10-25",
        about:
          "Alpha8 is a company specializing in web development of digital solutions. They focus on creating an all-in-one SaaS similar to the GSuite from Google, mostly with target of consulting peoples",
        technologies: [
          "React.js",
          "Node.js",
          "Typescript",
          "CSS-in-JS",
          "GraphQL (Apollo suite)",
          "Koa.js",
          "Headless browser",
          "Docker",
          "Kubernetes",
          "Helm",
          "Scaleway cloud",
          "Jest",
        ],
        missions: [
          "Led full-stack web development for part of the Saas",
          "Participation in design and implementation of scalable architectures for complex web applications",
          "Contributed to the overall design and user experience of web solutions",
          "Provided strategic input on enterprise-level decisions",
          "Collaborated with cross-functional teams to align technical solutions with business objectives",
        ],
        achievements: [
          "Imagine and develop as a leader of a team a complex part of the SaaS platform (Customizable report generator section)",
          "Solve architecture problems to interact between every systems using Apollo federation",
          "Imagine a UI for the application",
          "Create a simple to use development environment",
          "Help bosses to choose direction for the company",
        ],
        color: "#FFA500",
      },
      {
        company: "Brioche Pasquier",
        job: "R&D Web developer - Alternance",
        startDate: "2019-09-01",
        endDate: "2020-08-31",
        about:
          "Pasquier is a well-known French food company. They have a significant IT department with a dedicated R&D section, focusing on creating innovative internal tools and frameworks to streamline their software development processes.",
        technologies: [
          "Vue.js 2",
          "Javascript",
          "Sass",
          "C#",
          "Windows server hosting",
          "REST",
          "Internal CI",
          "SVN/Git",
          "Sharepoint",
        ],
        missions: [
          "Worked in the R&D section of the IT department",
          "Collaborated with designers to create a comprehensive UI kit following habits of internals users",
          "Developed the UI kit using Vue.js 2",
          "Contributed to building a full ecosystem for internal web developers",
          'Created modular, reusable components ("bricks") for efficient software assembly',
          "Served as a formation teacher, training other developers on the new ecosystem",
          "Doing support for developers on any frontend related question",
        ],
        achievements: [
          "Successfully developed a comprehensive UI kit that standardized the company's web application design",
          "Created a modular ecosystem that significantly reduced development time for internal projects",
          "Trained developers on the new ecosystem, facilitating its adoption across the IT department",
          "Creating a big documentation about the ecosystem and every choice made in developing it",
        ],
        color: "#FFD700",
      },
      {
        company: "Eureden/Triskalia",
        job: "Web developer - Alternance",
        startDate: "2018-09-01",
        endDate: "2019-08-31",
        about:
          "Eureden (previously known as Triskalia) is a major French agricultural cooperative. The company appears to have been undergoing digital transformation, investing in modern web and mobile solutions to enhance their operations and services.",
        technologies: [
          "Vue.js 2",
          "CSS/Sass",
          "REST",
          "PHP 5/7",
          "Javascript",
          "SVN/Git",
          "Cordova",
          "NativeScript",
        ],
        missions: [
          "Served as a key frontend web and mobile developer",
          "Spearheaded the adoption of Vue.js as the primary frontend framework",
          "Defined and implemented the architectural structure for Vue.js-based applications",
          "Developed frontend solutions for both web and mobile platforms",
          "Ensured best practices and consistency in frontend development",
          "Worked on maintaining and evolving a web applaction that give agricultor the ability to track their parcel at anytime",
          "Maintain hybrid mobile application",
        ],
        achievements: [
          "Successfully led the transition to Vue.js, improving development efficiency and application performance with my teammates",
          "Designed and implemented a comptability account management web app",
          "Created a complex timeline view in native Javascript for old systems",
        ],
        color: "#32CD32",
      },
      {
        company: "CDG29",
        job: "Alternance - Technician",
        startDate: "2017-09-01",
        endDate: "2018-08-31",
        about:
          "Worked as a technician performing a variety of roles including IT support, software development, network management, and operations tasks. This diverse experience provided a solid foundation in multiple aspects of IT infrastructure and operations.",
        technologies: [],
        missions: [],
        achievements: [],
        color: "#9370DB",
      },
    ],
    [],
  );

  return experiencesData;
};
