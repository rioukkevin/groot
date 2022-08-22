import { IWork } from "../typings/Work";

export interface ITranslation {
  home: {
    job1: string;
    job2: string;
    info: string;
  };
  settings: {
    isATechlabel: string;
  };
  me: {
    title: string;
    p1: string;
    p2: string;
    p3: string;
    p4: string;
  };
  works: {
    title: string;
    all: string;
    access: string;
    types: { [key in IWork["type"]]: string };
    descriptions: { [key: string]: string };
  };
}
