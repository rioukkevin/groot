import { FC } from "react";

interface IProps {
  value: string;
}

export const Title: FC<IProps> = (props) => (
  <div className="mt-16 mb-8 flex w-full">
    <h1 className="whitespace-nowrap text-2xl font-bold uppercase">
      <span className="text-3xl text-secondary">[</span>
      &nbsp;{props.value}&nbsp;
      <span className="text-3xl text-secondary">]</span>
    </h1>
    <div className="mx-6 mt-5 h-0.5 w-full bg-secondary"></div>
  </div>
);
