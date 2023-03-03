import { Ad } from "../components/molecules/Ad";
import { String } from "../components/atoms/String";
import { Home } from "../components/datas/Home";
import Me from "../components/molecules/Me";
import { Module } from "../components/layout/Module";
import { Project } from "../components/molecules/Project";

const Atoms = {
  string: String,
};

const Datas = {
  home: Home,
};

const Widgets = {
  project: Project,
  ad: Ad,
  me: Me,
};

export const StoryblokComponents = {
  ...Atoms,
  ...Widgets,
  ...Datas,
  module: Module,
};
