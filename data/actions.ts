import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import { IAction } from "../typings/Data";

const INC = 3000;

export const datas: IAction[] = [
  {
    keywords: ["Pro", "Social", "Linkedin"],
    key: "Linkedin",
    value: "https://www.linkedin.com/in/k%C3%A9vinriou/",
    icon: faLinkedin,
  },
  {
    keywords: ["Pro", "Contact", "Téléphone", "Tel", "Phone"],
    key: "Téléphone",
    value: "tel:+33618260849",
    icon: faPhone,
  },
  {
    keywords: ["Pro", "Contact", "Mail", "Email"],
    key: "Mail",
    value: "mailto:kevin@riou.pro",
    icon: faEnvelope,
  },
  {
    keywords: ["Pro", "Code", "Social", "Git", "Github", "Gitlab"],
    key: "Github",
    value: "https://github.com/rioukkevin",
    icon: faGithub,
  },
].map((a, i) => ({ ...a, type: "action", id: i + INC }));
