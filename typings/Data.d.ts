export type TSearch<T> = (query: string) => T[];

export interface IProject {
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  roles: string[];
  images: string[];
  type: "project";
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
  icon?: string;
  value: string;
  type: "action";
}

export type ISearchElement = IAction | IProject | IInfo;
