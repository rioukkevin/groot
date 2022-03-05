import React, { FC } from "react";
import Image from "next/image";

import styles from "./Identity.module.scss";
import { datas } from "../../../data/actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";

interface IProps {}

export const Identity: FC<IProps> = (props) => {
  const handleSocial = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <div className={styles.container}>
      <Image
        alt=""
        className={styles.profile}
        height={250}
        src={"/assets/me.png"}
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
              size="2x"
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
