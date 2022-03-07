import { IProject } from "../typings/Data";

import portfolioWall from "../assets/projects/portfolio/wall.png?lqip&blur";
import theStudentLabWall from "../assets/projects/theStudentLab/wall.png?lqip&blur";
import vscodeGitCommitWall from "../assets/projects/vscodeGitCommit/wall.png?lqip&blur";

const INC = 1000;

export const datas: IProject[] = [
  {
    slug: "portfolio",
    name: "Portfolio (Version précédente)",
    shortDescription:
      "Version précédente de mon portfolio, c'était une version développée en VueJS entièrement frontend...",
    fullDescription: "Version précédente de mon portfolio",
    roles: [],
    images: {
      wall: portfolioWall,
    },
  },
  {
    slug: "theStudentLab",
    name: "The Student Lab",
    shortDescription:
      "Site web de mise en avant des concours réalisés au sein des écoles MyDigitalSchool...",
    fullDescription:
      "Site web de mise en avant des concours réalisés au sein des écoles MyDigitalSchool, comprenant un site vitrine et le back office des gestion des informations...",
    roles: [],
    images: {
      wall: theStudentLabWall,
    },
  },
  {
    slug: "vscodeGitButtons",
    name: "VSCode Git buttons",
    shortDescription:
      "Extension VScode d'ajout de boutons pour éviter un click lors de pull et push avec git...",
    fullDescription:
      "Extension VScode d'ajout de boutons pour éviter un click lors de pull et push avec git",
    roles: [],
    images: {
      wall: vscodeGitCommitWall,
    },
  },
  {
    slug: "vscodeGitCommit",
    name: "VSCode Git commit message",
    shortDescription: "Extension VScode de templating ",
    fullDescription: "Version précédente de mon portfolio",
    roles: [],
    images: {
      wall: vscodeGitCommitWall,
    },
  },
].map((a, i) => ({ ...a, type: "project", id: i + INC }));
