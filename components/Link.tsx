import { FC } from "react";

interface IProps {
  href: string;
  label: string;
}

export const Link: FC<IProps> = (props) => {
  const { href, label } = props;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`w-fit hover:text-white text-primary font-bold p-1 hover:children:font-bold flex hover:bg-primary shadow-none hover:shadow-md`}
    >
      {label.split("").map((letter, i) => {
        return (
          <span
            className="font-roboto text-inherit duration-100 rotate-0 bg-transparent rounded"
            key={i}
          >
            {letter}
          </span>
        );
      })}
    </a>
  );
};
