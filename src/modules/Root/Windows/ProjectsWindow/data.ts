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
  images: StaticImageData[];
  descriptions: string[];
  links?: { label: string; href: string }[];
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
      images: [ImgProject1, ImgProject2, ImgProject3],
      descriptions: [
        "Project Alpha is a cutting-edge AI assistant.",
        "It uses advanced natural language processing.",
        "The system can handle complex queries and tasks.",
      ],
      links: [
        { label: "GitHub", href: "https://github.com/project-alpha" },
        { label: "Live Demo", href: "https://project-alpha-demo.com" },
      ],
    },
    {
      imageSrc: ImgProject2,
      name: "EcoTrack",
      shortDescription: "Sustainable living app for eco-conscious users",
      type: ProjectType.MOBILE_APP,
      technologies: ["React Native", "Firebase", "Redux"],
      date: { month: 7, year: 2022 },
      images: [ImgProject2, ImgProject4],
      descriptions: [
        "EcoTrack helps users reduce their carbon footprint.",
        "It provides personalized sustainability tips.",
      ],
    },
    {
      imageSrc: ImgProject3,
      name: "CryptoVault",
      shortDescription: "Secure cryptocurrency wallet and exchange platform",
      type: ProjectType.ADMIN_WEBSITE,
      technologies: ["Vue.js", "Express", "MongoDB"],
      date: { month: 11, year: 2022 },
      images: [ImgProject3, ImgProject5, ImgProject6],
      descriptions: [
        "CryptoVault offers secure storage for digital assets.",
        "It includes an integrated exchange platform.",
        "Advanced security features protect user funds.",
      ],
      links: [{ label: "Website", href: "https://cryptovault.com" }],
    },
    {
      imageSrc: ImgProject4,
      name: "FitQuest",
      shortDescription: "Gamified fitness app for health enthusiasts",
      type: ProjectType.MOBILE_APP,
      technologies: ["Flutter", "Firebase", "GraphQL"],
      date: { month: 2, year: 2023 },
      images: [ImgProject4, ImgProject7],
      descriptions: [
        "FitQuest turns fitness into an engaging game.",
        "Users can compete with friends and earn rewards.",
      ],
    },
    {
      imageSrc: ImgProject5,
      name: "SmartHome Hub",
      shortDescription: "Centralized IoT control for modern homes",
      type: ProjectType.OTHER,
      technologies: ["Python", "Raspberry Pi", "MQTT"],
      date: { month: 9, year: 2022 },
      images: [ImgProject5, ImgProject8],
      descriptions: [
        "SmartHome Hub connects and controls various IoT devices.",
        "It offers a user-friendly interface for home automation.",
      ],
    },
    {
      imageSrc: ImgProject6,
      name: "ArtGen",
      shortDescription: "AI-powered art generation and curation platform",
      type: ProjectType.DISPLAY_WEBSITE,
      technologies: ["Next.js", "TensorFlow.js", "AWS"],
      date: { month: 5, year: 2023 },
      images: [ImgProject6, ImgProject9],
      descriptions: [
        "ArtGen uses AI to create unique artworks.",
        "It also provides a platform for artists to showcase their AI-generated art.",
      ],
      links: [{ label: "Gallery", href: "https://artgen.ai/gallery" }],
    },
    {
      imageSrc: ImgProject7,
      name: "EduConnect",
      shortDescription: "Online learning platform for global education",
      type: ProjectType.DISPLAY_WEBSITE,
      technologies: ["Angular", "Django", "PostgreSQL"],
      date: { month: 1, year: 2023 },
      images: [ImgProject7, ImgProject1],
      descriptions: [
        "EduConnect bridges educational gaps worldwide.",
        "It offers courses from top institutions to global learners.",
      ],
    },
    {
      imageSrc: ImgProject8,
      name: "TravelBuddy",
      shortDescription: "AI travel planner and recommendation engine",
      type: ProjectType.MOBILE_APP,
      technologies: ["React Native", "Node.js", "MongoDB"],
      date: { month: 6, year: 2023 },
      images: [ImgProject8, ImgProject2],
      descriptions: [
        "TravelBuddy creates personalized travel itineraries.",
        "It uses AI to suggest activities based on user preferences.",
      ],
    },
    {
      imageSrc: ImgProject9,
      name: "CodeCollab",
      shortDescription: "Real-time collaborative coding environment",
      type: ProjectType.ADMIN_WEBSITE,
      technologies: ["Vue.js", "Socket.io", "Express"],
      date: { month: 4, year: 2023 },
      images: [ImgProject9, ImgProject3],
      descriptions: [
        "CodeCollab enables real-time code collaboration.",
        "It supports multiple programming languages and integrates with version control systems.",
      ],
      links: [{ label: "Try CodeCollab", href: "https://codecollab.dev" }],
    },
  ]);

  return projects;
};
