import { SbBlokData } from "@storyblok/react";

export interface IAd extends SbBlokData {
  name: string;
  url: string;
  description: string;
  color: string;
}
