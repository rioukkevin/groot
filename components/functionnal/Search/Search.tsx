import { FC, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { animation } from ".";

import styles from "./Search.module.scss";

interface IProps {
  onChangeIsVisible: (value: boolean) => void;
}

export const Search: FC<IProps> = (props) => {
  const { onChangeIsVisible } = props;

  const searchContainer = useRef<HTMLDivElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState<string>("");

  const openSearch = () => {
    animation.showSearch(searchContainer);
    searchInput.current?.focus();
    onChangeIsVisible(true);
  };
  const hideSearch = () => {
    animation.hideSearch(searchContainer);
    searchInput.current?.blur();
    onChangeIsVisible(false);
  };

  useHotkeys("cmd+f", (e) => {
    e.preventDefault();
    openSearch();
  });
  useHotkeys("escape", () => animation.hideSearch(searchContainer));

  return (
    <div
      ref={searchContainer}
      className={styles.searchContainer}
      style={{ top: -100 }}
    >
      <input
        ref={searchInput}
        value={query}
        onChange={({ target }) => setQuery(target.value)}
        onKeyUp={({ key }) => {
          if (key === "Escape") hideSearch();
        }}
      />
    </div>
  );
};
