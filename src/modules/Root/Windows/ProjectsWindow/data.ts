import { useState } from "react";

import ImgOoofThumbnail from "@/assets/projects/ooof/Thumbnail.png";
import ImgOoofScreen1 from "@/assets/projects/ooof/Screen1.png";
import ImgOoofScreen2 from "@/assets/projects/ooof/Screen2.png";
import ImgOoofScreen3 from "@/assets/projects/ooof/Screen3.png";

import ImgPortfolioV6Thumbnail from "@/assets/projects/portfoliov6/Thumbnail.png";
import ImgPortfolioV6Screen1 from "@/assets/projects/portfoliov6/Screen1.png";
import ImgPortfolioV6Screen2 from "@/assets/projects/portfoliov6/Screen2.png";
import ImgPortfolioV6Screen3 from "@/assets/projects/portfoliov6/Screen3.png";

import ImgVSCodeGitCommitThumbnail from "@/assets/projects/vscodeGitCommitMessage/Thumbnail.png";
import ImgVSCodeGitCommitScreen1 from "@/assets/projects/vscodeGitCommitMessage/Screen1.png";
import ImgVSCodeGitCommitScreen2 from "@/assets/projects/vscodeGitCommitMessage/Screen2.png";
import ImgVSCodeGitCommitDemo from "@/assets/projects/vscodeGitCommitMessage/Demo.gif";

import ImgBritchThumbnail from "@/assets/projects/britch/Thumbnail.png";
import ImgBritchScreen1 from "@/assets/projects/britch/Screen1.png";
import ImgBritchScreen2 from "@/assets/projects/britch/Screen2.png";

import { StaticImageData } from "next/image";

export enum ProjectType {
  DISPLAY_WEBSITE = "display-website",
  ADMIN_WEBSITE = "admin-website",
  VSCODE = "vscode",
  MOBILE_APP = "mobile-app",
  GRAPHISM = "graphism",
  CHROME_EXTENSION = "chrome-extension",
  OTHER = "other",
}

export interface ProjectThumbnail {
  imageSrc: StaticImageData;
  name: string;
  shortDescription: string;
  type: ProjectType;
  technologies: string[];
  date: {
    month: number;
    year: number;
  };
  images: StaticImageData[];
  descriptions: string[];
  links?: { label: string; href: string }[];
  color: string;
}

export const useProjectsData = (): ProjectThumbnail[] => {
  const [projects] = useState<ProjectThumbnail[]>([
    {
      imageSrc: ImgOoofThumbnail,
      name: "OOOF.dev",
      shortDescription:
        "Website for ooof.dev, it represents me as a freelance web developer",
      type: ProjectType.DISPLAY_WEBSITE,
      technologies: [
        "React.js",
        "Next.js",
        "TypeScript",
        "Tailwind CSS",
        "Framer Motion",
        "Vercel",
        "Nodemailer",
      ],
      date: { month: 8, year: 2024 },
      images: [
        ImgOoofThumbnail,
        ImgOoofScreen1,
        ImgOoofScreen2,
        ImgOoofScreen3,
      ],
      descriptions: [
        "OOOF.dev is my personal portfolio website, showcasing my skills and projects as a freelance web developer. It features a unique, interactive user interface and serves as my web entrypoint for potential clients to request freelance missions. The site includes detailed information about my development methodologies and approach to projects.",
        "The name 'OOOF' was chosen with a specific idea in mind. It represents the moment of relief and excitement when a client exclaims, 'OOOF, I found a developer for my need!' This name embodies the goal of the website: to be the solution that makes clients feel they've finally found the right developer, eliciting that satisfying 'OOOF' of discovery and relief. It's a playful yet memorable way to stand out in the competitive field of web development.",
        "In addition to the portfolio and project showcase, OOOF.dev features an integrated blog section. This blog serves as a platform where I share insights into web development trends, coding tips, and my experiences as a freelance developer. It's designed to provide value to both potential clients and fellow developers, demonstrating my expertise and thought leadership in the field. The blog is regularly updated with articles covering a wide range of topics, from technical tutorials to industry analyses, enhancing the site's SEO and positioning OOOF.dev as a valuable resource in the web development community.",
      ],
      links: [
        { label: "Website", href: "https://ooof.dev" },
        { label: "GitHub Profile", href: "https://github.com/dev-ooof" },
      ],
      color: "#FEDE03",
    },
    {
      imageSrc: ImgPortfolioV6Thumbnail,
      name: "Portfolio V6",
      shortDescription:
        "Old version of my portfolio up for 2 years until october 2024",
      type: ProjectType.DISPLAY_WEBSITE,
      technologies: [
        "Next.js",
        "TypeScript",
        "Tailwind",
        "Storyblok",
        "Google Analytics",
        "React.js",
        "Vercel",
        "Netlify",
        "Node.js",
        "Twemoji",
        "Marked",
      ],
      date: { month: 10, year: 2022 },
      images: [
        ImgPortfolioV6Thumbnail,
        ImgPortfolioV6Screen1,
        ImgPortfolioV6Screen2,
        ImgPortfolioV6Screen3,
      ],
      descriptions: [
        "Portfolio V6 was the previous iteration of my personal portfolio website.",
        "It showcased my projects and skills as a web developer for two years.",
        "The site utilized modern web technologies to create an engaging user experience.",
      ],
      links: [
        { label: "Website", href: "https://v6-kevin.riou.pro" },
        { label: "GitHub", href: "https://github.com/rioukkevin/groot" },
      ],
      color: "#477979",
    },
    {
      imageSrc: ImgVSCodeGitCommitThumbnail,
      name: "VSCode Git Commit",
      shortDescription:
        "A VSCode extension to template commit message in the IDE VSCode",
      type: ProjectType.VSCODE,
      technologies: [
        "Typescript",
        "NextJS",
        "VSCE",
        "Netlify",
        "Chakra UI",
        "React",
        "Slate.js",
        "Emotion",
        "React-Markdown",
      ],
      date: { month: 9, year: 2022 },
      images: [
        ImgVSCodeGitCommitScreen1,
        ImgVSCodeGitCommitDemo,
        ImgVSCodeGitCommitScreen2,
        ImgVSCodeGitCommitThumbnail,
      ],
      descriptions: [
        "VSCode Git Commit is a Visual Studio Code extension that provides templating for commit messages directly within the IDE.",
        "It offers a user-friendly interface for creating structured and consistent commit messages.",
        "The extension includes customizable templates and integrates seamlessly with VSCode's Git functionality.",
      ],
      links: [
        {
          label: "Marketplace",
          href: "https://marketplace.visualstudio.com/items?itemName=rioukkevin.vscode-git-commit",
        },
        { label: "Documentation", href: "https://gcm-config.netlify.app/" },
        {
          label: "UI Settings Generator",
          href: "https://gcm-config.netlify.app/configurator",
        },
      ],
      color: "#DB4535",
    },
    {
      imageSrc: ImgBritchThumbnail,
      name: "Britch",
      shortDescription:
        "This extension adds a gauge to adjust the brightness and contrast of streams",
      type: ProjectType.CHROME_EXTENSION,
      technologies: ["Typescript", "Chrome extension", "CSS", "React"],
      date: { month: 8, year: 2022 },
      images: [ImgBritchScreen1, ImgBritchScreen2, ImgBritchThumbnail],
      descriptions: [
        "Britch is a Chrome extension that enhances the viewing experience on Twitch.",
        "It provides a user-friendly interface to adjust brightness and contrast of streams.",
        "The extension integrates seamlessly with the Twitch platform for easy accessibility.",
      ],
      links: [
        {
          label: "Chrome Web Store",
          href: "https://chromewebstore.google.com/detail/britch-twitch-brightness/mbakeppieaiacmnfckfmaijhjlelokph",
        },
      ],
      color: "#9246FF",
    },
  ]);

  return projects;
};
