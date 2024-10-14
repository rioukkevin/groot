import { useState } from "react";
import ImgProject1 from "@/assets/projects/demo/thumbnail.png";
import ImgProject2 from "@/assets/projects/demo/thumbnail.png";
import ImgProject3 from "@/assets/projects/demo/thumbnail.png";
import ImgProject4 from "@/assets/projects/demo/thumbnail.png";
import ImgProject5 from "@/assets/projects/demo/thumbnail.png";
import ImgProject6 from "@/assets/projects/demo/thumbnail.png";
import ImgProject7 from "@/assets/projects/demo/thumbnail.png";
import ImgProject8 from "@/assets/projects/demo/thumbnail.png";
import ImgProject9 from "@/assets/projects/demo/thumbnail.png";
import { StaticImageData } from "next/image";

export enum ProjectType {
  DISPLAY_WEBSITE = "display-website",
  ADMIN_WEBSITE = "admin-website",
  MOBILE_APP = "mobile-app",
  GRAPHISM = "graphism",
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
}

export const useProjectsData = (): ProjectThumbnail[] => {
  const [projects] = useState<ProjectThumbnail[]>([
    {
      imageSrc: ImgProject1,
      name: "Project Alpha",
      shortDescription: "A revolutionary AI-powered assistant",
      type: ProjectType.DISPLAY_WEBSITE,
      technologies: ["React", "Node.js", "TensorFlow"],
      date: { month: 3, year: 2023 },
    },
    {
      imageSrc: ImgProject2,
      name: "EcoTrack",
      shortDescription: "Sustainable living app for eco-conscious users",
      type: ProjectType.MOBILE_APP,
      technologies: ["React Native", "Firebase", "Redux"],
      date: { month: 7, year: 2022 },
    },
    {
      imageSrc: ImgProject3,
      name: "CryptoVault",
      shortDescription: "Secure cryptocurrency wallet and exchange platform",
      type: ProjectType.ADMIN_WEBSITE,
      technologies: ["Vue.js", "Express", "MongoDB"],
      date: { month: 11, year: 2022 },
    },
    {
      imageSrc: ImgProject4,
      name: "FitQuest",
      shortDescription: "Gamified fitness app for health enthusiasts",
      type: ProjectType.MOBILE_APP,
      technologies: ["Flutter", "Firebase", "GraphQL"],
      date: { month: 2, year: 2023 },
    },
    {
      imageSrc: ImgProject5,
      name: "SmartHome Hub",
      shortDescription: "Centralized IoT control for modern homes",
      type: ProjectType.OTHER,
      technologies: ["Python", "Raspberry Pi", "MQTT"],
      date: { month: 9, year: 2022 },
    },
    {
      imageSrc: ImgProject6,
      name: "ArtGen",
      shortDescription: "AI-powered art generation and curation platform",
      type: ProjectType.DISPLAY_WEBSITE,
      technologies: ["Next.js", "TensorFlow.js", "AWS"],
      date: { month: 5, year: 2023 },
    },
    {
      imageSrc: ImgProject7,
      name: "EduConnect",
      shortDescription: "Online learning platform for global education",
      type: ProjectType.DISPLAY_WEBSITE,
      technologies: ["Angular", "Django", "PostgreSQL"],
      date: { month: 1, year: 2023 },
    },
    {
      imageSrc: ImgProject8,
      name: "TravelBuddy",
      shortDescription: "AI travel planner and recommendation engine",
      type: ProjectType.MOBILE_APP,
      technologies: ["React Native", "Node.js", "MongoDB"],
      date: { month: 6, year: 2023 },
    },
    {
      imageSrc: ImgProject9,
      name: "CodeCollab",
      shortDescription: "Real-time collaborative coding environment",
      type: ProjectType.ADMIN_WEBSITE,
      technologies: ["Vue.js", "Socket.io", "Express"],
      date: { month: 4, year: 2023 },
    },
  ]);

  return projects;
};
