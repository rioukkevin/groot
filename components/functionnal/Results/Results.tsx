import { FC } from "react";
import { useSearch } from "../../../hooks/useSearch";

import styles from "./Results.module.scss";
import Project from "./Widgets/Project";

interface IProps {
  query: string;
}

export const Results: FC<IProps> = (props) => {
  const { query } = props;

  const results = useSearch({ query });

  return (
    <div className={styles.container}>
      {results.map((r, i) => (
        <Project key={i} data={r} />
      ))}
    </div>
  );
};
