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
      onClick={() =>
        // @ts-ignore
        window.gtag("send", {
          hitType: "event",
          eventCategory: "Videos",
          eventAction: "play",
          eventLabel: "Fall Campaign",
        })
      }
      className={`flex w-fit p-1 font-bold text-primary shadow-none hover:bg-primary hover:text-white hover:shadow-md hover:children:font-bold`}
    >
      {label.split("").map((letter, i) => {
        return (
          <span
            className="rotate-0 rounded bg-transparent font-roboto text-inherit duration-100"
            key={i}
          >
            {letter}
          </span>
        );
      })}
    </a>
  );
};
