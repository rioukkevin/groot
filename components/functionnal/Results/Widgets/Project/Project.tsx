import { FC, useContext, useRef } from "react";
import { IProject } from "../../../../../typings/Data";
import Container from "../../Container";
import Image from "next/image";

import styles from "./Project.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faEye } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import { TransitionContext } from "../../../../graphics/Transition/TransitionContext";

interface IProps {
  data: IProject;
}

export const Project: FC<IProps> = (props) => {
  const { data } = props;

  const image = data.images.wall;

  const router = useRouter();
  const transitions = useContext(TransitionContext);
  const button = useRef(null);

  const handleMore = () => {
    transitions.trigger({
      type: "Growing",
      ref: button.current,
      callback: () => {
        router.push(`/projects/${data.slug}`);
      },
    });
  };

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
          <div ref={button} className={styles.link} onClick={handleMore}>
            <FontAwesomeIcon icon={faArrowRight} size="lg" />
          </div>
        </div>
      </div>
    </Container>
  );
};
