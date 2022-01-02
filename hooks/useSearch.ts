import { useEffect } from "react";
import * as Projects from "../data/projects";
import * as Infos from "../data/infos";
import * as Actions from "../data/actions";
import { ISearchElement } from "../typings/Data";
import { useMiniSearch } from "react-minisearch";

interface IProps {
  query: string;
}

const datas = [...Infos.datas, ...Actions.datas, ...Projects.datas];

export const useSearch = (props: IProps): ISearchElement[] => {
  const { query } = props;

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
      fuzzy: 0.4,
      prefix: true,
    },
  });

  // const [results, setResults] = useState<any[]>([]);

  console.log(searchResults);

  useEffect(() => {
    search(query);
  }, [query]);

  useEffect(() => {
    return () => {
      removeAll(datas);
    };
  }, []);

  return query.length === 0 ? datas : searchResults ?? [];
};
