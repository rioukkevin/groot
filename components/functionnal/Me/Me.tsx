import React, { FC } from "react";
import Aluminium from "../../graphics/Aluminium";

import styles from "./Me.module.scss";

interface IProps {}

export const Me: FC<IProps> = (props) => {
  const underline_count = Math.round(Math.random() * 8) + 2;

  const underline_inc = Math.round(100 / underline_count);

  const underlines = Array(underline_count)
    .fill(undefined)
    .map((_, i) => (
      <div
        key={i}
        className={styles.underline}
        style={{
          width: `${
            100 - i * underline_inc - Math.round(Math.random() * underline_inc)
          }%`,
          height: Math.round(Math.random() * 10),
          marginBottom: Math.round(Math.random() * 8) + 4,
        }}
      />
    ));

  return (
    <div className={styles.container}>
      <div className={styles.inset}>
        <Aluminium
          height="250px"
          left="-15vw"
          position="absolute"
          top="70px"
          width="25vw"
        />
        <div className={styles.content}>
          <div className={styles.name}>RIOU Kévin</div>
          {underlines}
        </div>
      </div>
    </div>
  );
};
