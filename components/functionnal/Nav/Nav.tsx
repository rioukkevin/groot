import React, { FC, useEffect, useRef, useState } from "react";

import { animation } from ".";
import { Aluminium } from "../../graphics/Aluminium/Aluminium";

import styles from "./Nav.module.scss";

interface IProps {
  isSearchVisible: boolean;
}

const LINKS = [
  {
    name: "home",
    href: "#home",
  },
  {
    name: "lab",
    href: "#lab",
  },
  {
    name: "history",
    href: "#history",
  },
];
const LINK_SIZE = 40;

export const Nav: FC<IProps> = (props) => {
  const { isSearchVisible } = props;

  const searchLink = useRef(null);

  const [activeLink, setActiveLink] = useState(1);
  const [previousActiveLink, setPreviousActiveLink] = useState<
    number | undefined
  >(undefined);

  useEffect(() => {
    if (isSearchVisible) {
      animation.showSearch(searchLink);
      setPreviousActiveLink(activeLink);
      setActiveLink(0);
    } else {
      if (previousActiveLink) {
        animation.hideSearch(searchLink);
        setActiveLink(previousActiveLink);
        setPreviousActiveLink(activeLink);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSearchVisible]);

  const handleClick = (e: React.MouseEvent<HTMLElement>, index: number) => {
    e.preventDefault();
    setActiveLink(index);
  };

  return (
    <nav className={styles.container}>
      <div className={styles.inset}>
        <Aluminium
          height="40px"
          position="absolute"
          top={activeLink * LINK_SIZE}
          transitionDuration="200ms"
          width="100px"
        />
        <div className={styles.links}>
          <a
            ref={searchLink}
            className={styles.active}
            style={{ transform: "translateY(-170px)" }}
            onClick={(e) => handleClick(e, 0)}
          >
            Search
          </a>
          {LINKS.map((l, i) => (
            <a
              key={i}
              className={i + 1 === activeLink ? styles.active : ""}
              onClick={(e) => handleClick(e, i + 1)}
            >
              {l.name}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};
