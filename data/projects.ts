import { IProject } from "../typings/Data";
// import { Document } from "flexsearch";

const INC = 1000;

export const datas: IProject[] = [
  {
    slug: "portfolio",
    name: "Portfolio (Version précédente)",
    shortDescription:
      "Version précédente de mon portfolio, c'était une version développée en VueJS entièrement frontend...",
    fullDescription: "Version précédente de mon portfolio",
    roles: [],
    images: ["/assets/projects/portfolio/wall.png"],
  },
  {
    slug: "vscodeGitCommit",
    name: "VSCode Git commit message",
    shortDescription: "Extension VScode de templating ",
    fullDescription: "Version précédente de mon portfolio",
    roles: [],
    images: ["/assets/projects/vscodeGitCommit/wall.png"],
  },
].map((a, i) => ({ ...a, type: "project", id: i + INC }));

// const document = new Document<ISearchElement>({
//   // @ts-ignore
//   encoder: "extra",
//   preset: "match",
//   tokenize: "full",
//   matcher: "simple",
//   language: "fr",
//   cache: true,
//   document: {
//     id: "slug",
//     tag: "type",
//     field: ["name", "shortDescription", "roles", "type"],
//   },
// });

// datas.forEach((p) => {
//   document.add(p);
// });

// export const search: TSearch<IProject> = (query) => {
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
//     datas.find((d) => d.slug === s)
//   );
//   return populatedResult as IProject[];
// };
