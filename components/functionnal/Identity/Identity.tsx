import React, { FC } from "react";
import Image from "next/image";

import styles from "./Identity.module.scss";
import { datas } from "../../../data/actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import profilePic from "../../../assets/me.png?lqip&blur";

interface IProps {}

export const Identity: FC<IProps> = (props) => {
  const handleSocial = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <div className={styles.container}>
      <Image
        alt=""
        blurDataURL={profilePic.dataURI}
        className={styles.profile}
        height={250}
        placeholder="blur"
        src={profilePic.src}
        width={250}
      />
      <p className={styles.name}>Riou Kevin</p>
      <p className={styles.description}>
        {
          "Hello, je suis un développeur web de 23 ans, à Alpha8, en Freelance, en tant que formateur à MDS, le code me suis constamment"
        }
      </p>
      <div className={styles.socials}>
        {datas.map((a) =>
          a.icon ? (
            <FontAwesomeIcon
              key={a.key}
              icon={a.icon}
              size="lg"
              onClick={() => handleSocial(a.value)}
            />
          ) : (
            <></>
          )
        )}
      </div>
    </div>
  );
};
