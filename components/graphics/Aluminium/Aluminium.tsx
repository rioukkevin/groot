import { CSSProperties, FC } from "react";

import styles from "./Aluminium.module.scss";

// interface IProps {
//   width: number;
//   height: number;
// }

export const Aluminium: FC<CSSProperties> = (props) => {
  return (
    <div style={props}>
      <div className={styles.container}>
        <div className={styles.child} />
      </div>
    </div>
  );
};
