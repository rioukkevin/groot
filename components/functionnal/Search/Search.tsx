import { FC, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import Results from "../Results";

import styles from "./Search.module.scss";

interface IProps {}

export const Search: FC<IProps> = (props) => {
  const searchContainer = useRef<HTMLDivElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState<string>("");

  useHotkeys("cmd+f", (e) => {
    e.preventDefault();
    searchInput.current?.focus();
  });

  return (
    <>
      <div ref={searchContainer} className={styles.searchContainer}>
        <input
          ref={searchInput}
          placeholder="Search"
          value={query}
          onChange={({ target }) => setQuery(target.value)}
        />
      </div>
      <Results query={query} />
    </>
  );
};
