import { FontAwesomeIconProps } from "@fortawesome/react-fontawesome";

export type TSearch<T> = (query: string) => T[];

export type TDataTypes = "project" | "info" | "action";

type TImages = {
  [key: string]: LqipImage;
};

export interface IProject {
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  roles: string[];
  type: "project";
  images: TImages;
}

export interface IInfo {
  keywords: string[];
  key: string;
  value: string;
  type: "info";
}

export interface IAction {
  keywords: string[];
  key: string;
  icon?: FontAwesomeIconProps.icon;
  value: string;
  type: "action";
}

export type ISearchElement = IAction | IProject | IInfo;
