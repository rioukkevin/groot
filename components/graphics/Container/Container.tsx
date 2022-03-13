import { FC } from "react";
import styles from "./Container.module.scss";

interface IProps {}

export const Container: FC<IProps> = (props) => {
  return <div className={`${styles.container}`}>{props.children}</div>;
};
