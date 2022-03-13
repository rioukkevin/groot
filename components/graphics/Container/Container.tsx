import { FC, LegacyRef } from "react";
import styles from "./Container.module.scss";

interface IProps {
  reff: LegacyRef<HTMLDivElement> | undefined;
}

export const Container: FC<IProps> = (props) => {
  return (
    <div ref={props.reff} className={`${styles.container}`}>
      {props.children}
    </div>
  );
};
