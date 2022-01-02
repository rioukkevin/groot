import { useEffect, useState } from "react";
import * as Projects from "../data/projects";
import { ISearchElement } from "../typings/Data";

interface IProps {
  query: string;
}

export const useSearch = (props: IProps): ISearchElement[] => {
  const { query } = props;

  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    setResults(Projects.search(query));
  }, [query]);

  return results;
};
