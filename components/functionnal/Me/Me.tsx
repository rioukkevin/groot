import React, { FC } from "react";
import Image from "next/image";

import Mee from "../../../assets/mee.png?lqip&blur";

import styles from "./Me.module.scss";

interface IProps {}

const MEE_SIZE = 500;

export const Me: FC<IProps> = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.name}>RIOU</div>
      <Image
        alt=""
        blurDataURL={Mee.dataURI}
        className={styles.mee}
        height={MEE_SIZE}
        placeholder="blur"
        src={Mee.src}
        width={(MEE_SIZE / 3) * 2}
      />
      <div className={styles.surname}>Kevin</div>
    </div>
  );
};
