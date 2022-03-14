import React, { FC, useState } from "react";

import styles from "./Dropzone.module.scss";

import { Dropzone as DP, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faFileImport } from "@fortawesome/free-solid-svg-icons";

interface IProps {
  onChange: (files: File[]) => void;
  value: File[];
  disabled?: boolean;
}

export const Dropzone: FC<IProps> = (props) => {
  const { value = [], onChange, disabled } = props;

  const handleAdd = (files: File[]) => {
    onChange([...value, ...files]);
  };

  const handleDelete = (name: string) => {
    onChange([...value.filter((v) => v.name !== name)]);
  };

  const InnerDrop: FC<{}> = () => {
    return (
      <div className={styles.innerContent}>
        <FontAwesomeIcon color="#5C5F66" icon={faFileImport} size="4x" />
        <span className={styles.indicator}>Ajouter des pièces jointes</span>
      </div>
    );
  };

  return (
    <>
      {" "}
      <DP
        accept={IMAGE_MIME_TYPE}
        className={`${styles.outerContent} ${disabled ? styles.disabled : ""}`}
        disabled={disabled}
        maxSize={3 * 1024 ** 2}
        onDrop={handleAdd}
        onReject={(files) => console.log("rejected files", files)}
      >
        {(status) => <InnerDrop />}
      </DP>
      <div className={`${styles.fileList} ${disabled ? styles.disabled : ""}`}>
        {value.map((v, i) => (
          <div key={i}>
            <span>{v.name}</span>
            {!disabled && (
              <FontAwesomeIcon
                icon={faClose}
                onClick={() => handleDelete(v.name)}
              />
            )}
          </div>
        ))}
      </div>
    </>
  );
};
