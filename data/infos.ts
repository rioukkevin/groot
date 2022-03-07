import { IInfo } from "../typings/Data";
// import { Document } from "flexsearch";

const INC = 2000;

export const datas: IInfo[] = [
  {
    keywords: ["nom", "name", "identité", "identity", "firstname"],
    key: "Nom",
    value: "RIOU",
  },
  {
    keywords: ["prénom", "surname", "identité", "identity", "lastname"],
    key: "Prénom",
    value: "Kévin",
  },
].map((a, i) => ({ ...a, type: "info", id: i + INC }));
