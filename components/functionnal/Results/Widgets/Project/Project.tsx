import { FC, useEffect, useState } from "react";
import { IProject } from "../../../../../typings/Data";
import Container from "../../Container";
import Image from "next/image";

import styles from "./Project.module.scss";

interface IProps {
  data: IProject;
}

export const Project: FC<IProps> = (props) => {
  const { data } = props;

  return (
    <Container height={4} width={8}>
      <div className={styles.container}>
        <Image
          alt=""
          className={styles.img}
          layout="fill"
          src={data.images[0]}
        />
        <div className={styles.overlay}>
          <div className={styles.name}>{data.name}</div>
          <div className={styles.description}>{data.shortDescription}</div>
        </div>
      </div>
    </Container>
  );
};
