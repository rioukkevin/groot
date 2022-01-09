import { ChangeEventHandler, FC, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import Results from "../Results";
import dynamic from "next/dynamic";

const Overlay = dynamic(
  // @ts-ignore
  () => import("../../graphics/Overlay"),
  { ssr: false }
);

import styles from "./Search.module.scss";
import Identity from "../Identity";

interface IProps {}

const FILTERS: { name: string; value: string }[] = [
  { name: "Projets", value: "project" },
  { name: "Identité", value: "identity" },
  { name: "Contact", value: "info" },
  { name: "Réseaux", value: "action" },
];

export const Search: FC<IProps> = (props) => {
  const searchContainer = useRef<HTMLDivElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState<string>("");
  const [filter, setFilter] = useState<string | null>(null);

  const [isIdentityVisible, setIsIdentityVisible] = useState<boolean>(false);

  useHotkeys("cmd+f", (e) => {
    e.preventDefault();
    searchInput.current?.focus();
  });

  const handleSearch: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    setQuery(target.value);
    setFilter(null);
  };

  const handleFilter = (value: string) => {
    if (value === "identity") setIsIdentityVisible(true);
    setFilter(value);
    setQuery("");
  };

  const handleCloseIdentity = () => {
    setIsIdentityVisible(false);
    setFilter(null);
  };

  return (
    <>
      <div ref={searchContainer} className={styles.searchContainer}>
        <input
          ref={searchInput}
          placeholder="Search"
          value={query}
          onChange={handleSearch}
        />
        <div className={styles.filters}>
          {FILTERS.map((f, i) => (
            <div
              key={i}
              className={`${styles.filter} ${
                f.value === filter ? styles.selected : ""
              }`}
              onClick={() => handleFilter(f.value)}
            >
              {f.name}
            </div>
          ))}
        </div>
        <Results filter={filter} query={query} />
        <Overlay open={isIdentityVisible} onClose={handleCloseIdentity}>
          <Identity />
        </Overlay>
      </div>
    </>
  );
};
