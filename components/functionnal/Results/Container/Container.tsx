import { FC } from "react";

interface IProps {
  width: number;
  height: number;
}

const SQUARE_SIZE = 25;

export const Container: FC<IProps> = (props) => {
  const { width, height, children } = props;

  return (
    <div
      style={{
        width: `${width * SQUARE_SIZE}%`,
        aspectRatio: `${width} / ${height}`,
        padding: "10px",
      }}
    >
      {children}
    </div>
  );
};
