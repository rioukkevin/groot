import { useEffect } from "react";
import * as Projects from "../data/projects";
import * as Infos from "../data/infos";
import * as Actions from "../data/actions";
import { ISearchElement, TDataTypes } from "../typings/Data";
import { useMiniSearch } from "react-minisearch";

interface IProps {
  query: string;
  filter: string | null;
}

const organizedDatas = {
  info: Infos.datas,
  action: Actions.datas,
  project: Projects.datas,
};

const datas = [
  ...organizedDatas["info"],
  ...organizedDatas["action"],
  ...organizedDatas["project"],
];

export const useSearch = (props: IProps): ISearchElement[] => {
  const { query, filter } = props;

  const { search, searchResults, removeAll } = useMiniSearch(datas, {
    fields: [
      "name",
      "shortDescription",
      "fullDescription",
      "type",
      "roles",
      "keywords",
    ],
    searchOptions: {
      fuzzy: 0.3,
      prefix: true,
    },
  });

  useEffect(() => {
    search(query);
  }, [query]);

  useEffect(() => {
    return () => {
      removeAll(datas);
    };
  }, []);

  if (!!filter) return organizedDatas[filter as TDataTypes] ?? [];

  return query.length === 0 ? [] : searchResults ?? [];
};
