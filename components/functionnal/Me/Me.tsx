import React, { FC, useState } from "react";
import Image from "next/image";

import Mee from "../../../assets/mee.png?lqip&blur";

import styles from "./Me.module.scss";

interface IProps {}

const MEE_SIZE = 500;

const DELAY = 1500;

export const Me: FC<IProps> = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [timeFromMount] = useState<number>(new Date().getTime());

  const handleLoaded = () => {
    const actualTime = new Date().getTime();
    const timeElapsed = actualTime - timeFromMount;
    setTimeout(
      () => {
        setIsLoading(false);
      },
      timeElapsed < DELAY ? DELAY - timeElapsed : 1
    );
  };

  return (
    <div className={`${styles.container} ${isLoading ? styles.isLoading : ""}`}>
      <div className={styles.name}>RIOU</div>
      <Image
        alt="profilePic"
        blurDataURL={Mee.dataURI}
        className={styles.mee}
        height={MEE_SIZE}
        placeholder="blur"
        src={Mee.src}
        width={(MEE_SIZE / 3) * 2}
        onLoadingComplete={handleLoaded}
      />
      <div className={styles.surname}>Kevin</div>
    </div>
  );
};
