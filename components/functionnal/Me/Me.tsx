import React, { FC } from "react";
import Aluminium from "../../graphics/Aluminium";

import styles from "./Me.module.scss";

interface IProps {}

export const Me: FC<IProps> = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.name}>RIOU Kévin</div>
    </div>
  );
};
