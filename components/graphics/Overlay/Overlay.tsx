import { FC, MouseEventHandler, useState } from "react";
import Portal from "../../functionnal/Portal/Portal";
import styles from "./Overlay.module.scss";

interface IProps {
  open?: boolean;
  onClose: () => void;
}

const _Overlay: FC<IProps> = (props) => {
  const { open = false, onClose, children } = props;

  const handleChildClick: MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className={`${styles.overlay}`}
      style={{ left: `${open ? 0 : "100%"}` }}
      onClick={onClose}
    >
      <div className={styles.reset}>
        {new Array(9).fill(null).map((_, i) => (
          <div
            key={i}
            className={styles.blurred}
            style={{
              width: `${70 - 7 * i}%`,
            }}
          ></div>
        ))}
      </div>
      <div
        className={styles.content}
        style={{ marginRight: open ? 0 : "-500px" }}
        onClick={handleChildClick}
      >
        {children}
      </div>
    </div>
  );
};

export const Overlay = Portal(_Overlay);
