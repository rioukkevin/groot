import { StaticImageData } from "next/image";

export interface IWork {
  name: string;
  url: string;
  description: string;
  images: StaticImageData[];
  techs: string[];
  type:
    | "vscode"
    | "chrome"
    | "bot"
    | "frontend"
    | "backend"
    | "graphic"
    | "mobile"
    | "other";
}
