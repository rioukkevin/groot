import { FC } from "react";
import { IProject } from "../../../../../typings/Data";
import Container from "../../Container";
import Image from "next/image";

import styles from "./Project.module.scss";

import portfolioWall from "../../../../../assets/projects/portfolio/wall.png?lqip&blur";
import theStudentLabWall from "../../../../../assets/projects/theStudentLab/wall.png?lqip&blur";
import vscodeGitCommitWall from "../../../../../assets/projects/vscodeGitCommit/wall.png?lqip&blur";
import { LqipImageL } from "../../../../../typings/LqipImage";

interface image {
  wall: { [key: string]: LqipImageL };
}

const images: image = {
  wall: {
    portfolio: portfolioWall,
    theStudentLab: theStudentLabWall,
    vscodeGitButtons: vscodeGitCommitWall,
    vscodeGitCommit: vscodeGitCommitWall,
  },
};

interface IProps {
  data: IProject;
}

export const Project: FC<IProps> = (props) => {
  const { data } = props;

  const image = images.wall[data.slug];

  return (
    <Container height={4} width={8}>
      <div className={styles.container}>
        <Image
          alt=""
          className={styles.img}
          width={1200}
          height={600}
          blurDataURL={image.dataURI}
          placeholder="blur"
          src={image.src}
        />
        <div className={styles.overlay}>
          <div className={styles.name}>{data.name}</div>
          <div className={styles.description}>{data.shortDescription}</div>
        </div>
      </div>
    </Container>
  );
};
