import { FC } from "react";
import { IProject } from "../../../../../typings/Data";
import Container from "../../Container";
import Image from "next/image";

import styles from "./Project.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faEye } from "@fortawesome/free-solid-svg-icons";

interface IProps {
  data: IProject;
}

export const Project: FC<IProps> = (props) => {
  const { data } = props;

  const image = data.images.wall;

  return (
    <Container height={4} width={8}>
      <div className={styles.container}>
        <Image
          alt=""
          blurDataURL={image.dataURI}
          className={styles.img}
          height={600}
          placeholder="blur"
          src={image.src}
          width={1200}
        />
        <div className={styles.overlay}>
          <div className={styles.name}>{data.name}</div>
          <div className={styles.description}>{data.shortDescription}</div>
          <div className={styles.link}>
            <FontAwesomeIcon icon={faArrowRight} size="lg" />
          </div>
        </div>
      </div>
    </Container>
  );
};
