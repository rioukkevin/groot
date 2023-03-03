import { storyblokEditable } from "@storyblok/react";
import { FC } from "react";
import { IAd } from "../../typings/Ad";
import { Link } from "../Link";

interface IProps {
  blok: IAd;
}

export const Ad: FC<IProps> = ({ blok }) => {
  return (
    <article
      className="relative mb-5 flex max-w-[350px] flex-col justify-between rounded-lg border-2 border-solid bg-white p-8 shadow-lg desk:m-3"
      style={{ borderColor: blok.color }}
      {...storyblokEditable(blok)}
    >
      <h3 className="mb-4 whitespace-nowrap text-xl font-bold uppercase">
        {blok.name}
      </h3>
      <p className="mb-4 text-justify">{blok.description}</p>
      <Link href={blok.url} label={"Accès"} />
    </article>
  );
};
