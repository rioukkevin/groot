import { FC } from "react";
import { IProject } from "../../../../../typings/Data";
import Container from "../../Container";
import Image from "next/image";

import styles from "./Project.module.scss";

import portfolioWall from "../../../../../assets/projects/portfolio/wall.png?lqip&blur";
import theStudentLabWall from "../../../../../assets/projects/theStudentLab/wall.png?lqip&blur";
import vscodeGitCommitWall from "../../../../../assets/projects/vscodeGitCommit/wall.png?lqip&blur";

interface image {
  wall: { [key: string]: LqipImage };
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
        </div>
      </div>
    </Container>
  );
};
