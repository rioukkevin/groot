import { FC } from "react";

interface IProps {
  width: number;
  height: number;
}

// const SQUARE_SIZE = 12.5;

export const Container: FC<IProps> = (props) => {
  const { width, height, children } = props;

  return (
    <div
      style={{
        gridColumn: `auto / span ${width}`,
        gridRow: `auto / span ${height}`,
        aspectRatio: `${width} / ${height}`,
        padding: 10,
      }}
    >
      {children}
    </div>
  );
};
