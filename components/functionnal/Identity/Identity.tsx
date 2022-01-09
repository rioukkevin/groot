import React, { FC } from "react";
import Image from "next/image";

import styles from "./Identity.module.scss";

interface IProps {}

export const Identity: FC<IProps> = (props) => {
  return (
    <div className={styles.container}>
      <Image
        alt=""
        className={styles.profile}
        height={250}
        src={"/assets/me.png"}
        width={250}
      />
    </div>
  );
};
