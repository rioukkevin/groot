import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC } from "react";
import { IAction } from "../../../../../typings/Data";
import Container from "../../Container";

import styles from "./Action.module.scss";

interface IProps {
  data: IAction;
}

export const Action: FC<IProps> = (props) => {
  const { data } = props;

  return (
    <Container height={1} width={2}>
      <a
        className={styles.container}
        href={data.value}
        rel="noreferrer"
        target="_blank"
      >
        <div className={styles.key}>{data.key}</div>
        {!data.icon && <FontAwesomeIcon icon={faExternalLinkAlt} />}
      </a>
    </Container>
  );
};
