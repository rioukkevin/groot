import React, { FC } from "react";
import Image from "next/image";

import Mee from "../../../assets/mee.png?lqip&blur";

import styles from "./Me.module.scss";
import { useLoaderTrigger } from "../../../hooks/useTrigger";

interface IProps {}

const MEE_SIZE = 800;

export const Me: FC<IProps> = (props) => {
  const { isLoading, trigger } = useLoaderTrigger();

  return (
    <div className={`${styles.container} ${isLoading ? styles.isLoading : ""}`}>
      <div className={styles.name}>
        <div>RIOU</div>
      </div>
      <div className={styles.mee}>
        <Image
          alt="profilePic"
          blurDataURL={Mee.dataURI}
          height={MEE_SIZE}
          placeholder="blur"
          src={Mee.src}
          width={(MEE_SIZE / 3) * 2}
          onLoadingComplete={trigger}
        />
      </div>
      <div className={styles.surname}>
        <div>Kevin</div>
      </div>
    </div>
  );
};
