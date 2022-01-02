import { FC } from "react";
import { useSearch } from "../../../hooks/useSearch";

import styles from "./Results.module.scss";
import Info from "./Widgets/Info";
import Project from "./Widgets/Project";

interface IProps {
  query: string;
}

export const Results: FC<IProps> = (props) => {
  const { query } = props;

  const results = useSearch({ query });

  return (
    <div className={styles.container}>
      {results.map((r, i) => {
        if (r.type === "project") return <Project key={i} data={r} />;
        if (r.type === "info") return <Info key={i} data={r} />;
        return <></>;
      })}
    </div>
  );
};
