import { FC } from "react";

import styles from "./BarCode.module.scss";

const DEFAULT_BAR_COUNT = 22;
const DEFAULT_BAR_MAX_HEIGHT = 26;

interface IProps {
  barCount?: number;
  barMaxHeight?: number;
}

export const BarCode: FC<IProps> = (props) => {
  const {
    barCount = DEFAULT_BAR_COUNT,
    barMaxHeight = DEFAULT_BAR_MAX_HEIGHT,
  } = props;
  return (
    <div className={styles.barContainer}>
      {Array(barCount)
        .fill(undefined)
        .map((_, i) => (
          <div
            key={i}
            className={styles.bar}
            style={{
              height: Math.round(Math.random() * 0.5 * barMaxHeight),
              marginBottom: Math.round(Math.random() * 8),
              animationDelay: `${Math.round(Math.random() * 10)}s`,
            }}
          ></div>
        ))}
    </div>
  );
};
