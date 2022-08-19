import { FC } from "react";

interface IProps {
  value: string;
}

export const Title: FC<IProps> = (props) => (
  <div className="w-full flex mt-16 mb-8">
    <h1 className="text-2xl font-bold uppercase whitespace-nowrap font-caveat">
      <span className="text-secondary text-3xl">[</span>
      &nbsp;{props.value}&nbsp;
      <span className="text-secondary text-3xl">]</span>
    </h1>
    <div className="w-full h-0.5 bg-secondary mt-5 mx-6"></div>
  </div>
);
