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

export type ISearchElement = IProject;
