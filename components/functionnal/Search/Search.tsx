import { ChangeEventHandler, FC, useContext, useRef, useState } from "react";
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
import { useLoader } from "../../../hooks/useTrigger";
import { analytics } from "../../../services/analytics";
import Router, { useRouter } from "next/router";
import { TransitionContext } from "../../graphics/Transition/TransitionContext";

interface IProps {}

const FILTERS: { name: string; value: string }[] = [
  { name: "Mes projets", value: "project" },
  { name: "Qui suis je ?", value: "identity" },
  { name: "Comment me contacter ?", value: "action" },
  { name: "Tester c'est douter", value: "test" },
];

export const Search: FC<IProps> = (props) => {
  const searchContainer = useRef<HTMLDivElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState<string>("");
  const [filter, setFilter] = useState<string | null>(null);

  const [isIdentityVisible, setIsIdentityVisible] = useState<boolean>(false);

  const { isLoading } = useLoader();

  useHotkeys("cmd+f", (e) => {
    e.preventDefault();
    searchInput.current?.focus();
  });

  const handleSearch: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    setQuery(target.value);
    setFilter(null);
  };

  const handleFilter = (value: string) => {
    if (value === "test") {
      return;
    }
    if (value === "identity") setIsIdentityVisible(true);
    setFilter(value);
    setQuery("");
  };

  const handleCloseIdentity = () => {
    setIsIdentityVisible(false);
    setFilter(null);
  };

  const handleBlur = () => {
    analytics.track("Search", {
      query,
    });
  };

  return (
    <>
      <div
        ref={searchContainer}
        className={`${styles.searchContainer} ${
          isLoading ? styles.loading : ""
        }`}
      >
        <input
          ref={searchInput}
          placeholder="Search"
          value={query}
          onBlur={handleBlur}
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
