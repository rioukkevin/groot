import type { FC } from "react";

interface ModelsProps {
  name: string;
}

export const Models: FC<ModelsProps> = ({ name }) => {
  return (
    <div>
      <h1>{name}</h1>
    </div>
  );
};
