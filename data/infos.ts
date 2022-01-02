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

// const document = new Document<ISearchElement>({
//   // @ts-ignore
//   encoder: "extra",
//   preset: "match",
//   tokenize: "full",
//   matcher: "simple",
//   language: "fr",
//   cache: true,
//   document: {
//     id: "key",
//     field: ["keywords", "type"],
//   },
// });

// datas.forEach((p) => {
//   document.add(p);
// });

// export const search: TSearch<IInfo> = (query) => {
//   const res = document.search(query, { enrich: true });
//   const fieldsResult = res.map((r) => r.result);
//   const idsResult =
//     fieldsResult.length > 1
//       ? fieldsResult.reduce((a = [], b = []) => a.concat(b))
//       : fieldsResult[0];
//   const flattenResult = (idsResult ?? []).filter(
//     (a, i) => idsResult.indexOf(a) === i
//   );
//   const populatedResult = flattenResult.map((s) =>
//     datas.find((d) => d.key === s)
//   );
//   return populatedResult as IInfo[];
// };
