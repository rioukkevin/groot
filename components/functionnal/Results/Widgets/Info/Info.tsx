import { FC } from "react";
import { IInfo } from "../../../../../typings/Data";
import Container from "../../Container";

import styles from "./Info.module.scss";

interface IProps {
  data: IInfo;
}

export const Info: FC<IProps> = (props) => {
  const { data } = props;

  return (
    <Container height={0.5} width={2}>
      <div className={styles.container}>
        <div className={styles.key}>{data.key}</div>
        <div className={styles.value}>{data.value}</div>
      </div>
    </Container>
  );
};
