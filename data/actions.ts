import { IAction } from "../typings/Data";
// import { Document } from "flexsearch";

const INC = 2000;

export const datas: IAction[] = [
  {
    keywords: ["Pro", "Social", "Linkedin"],
    key: "Linkedin",
    value: "https://www.linkedin.com/in/k%C3%A9vinriou/",
  },
  {
    keywords: ["Pro", "Contact", "Téléphone", "Tel", "Phone"],
    key: "Téléphone",
    value: "tel:+33618260849",
  },
  {
    keywords: ["Pro", "Contact", "Mail", "Email"],
    key: "Mail",
    value: "mailto:kevin@riou.pro",
  },
  {
    keywords: ["Pro", "Code", "Social", "Git", "Github", "Gitlab"],
    key: "Github",
    value: "https://github.com/rioukkevin",
  },
].map((a, i) => ({ ...a, type: "action", id: i + INC }));
