import { FC, useContext, useState } from "react";
import { IWork } from "../typings/Work";

import { marked } from "marked";

import Image from "next/image";

import { WORKS_ICONS } from "../contents/Works";
import { RiEyeLine } from "react-icons/ri";
import { Link } from "./Link";
import { SettingsContext } from "./Settings";
import { useTranslations } from "../translations/Translations";

interface IProps {
  work: IWork;
}

export const Work: FC<IProps> = (props) => {
  const { work } = props;

  const { isATech } = useContext(SettingsContext);

  const Icon = WORKS_ICONS[work.type];

  const [displayedImageIndex, setDisplayedImageIndex] = useState<number>(0);

  const { t } = useTranslations();

  return (
    <article className={`relative mb-5 rounded-lg bg-white shadow-lg desk:m-3`}>
      <div className="m-0 flex w-full flex-col flex-nowrap items-center justify-between desk:flex-row">
        <div className="relative flex h-full grow flex-col justify-between p-6 desk:p-12">
          <h2 className="mb-3 flex text-xl font-bold">
            <Icon size={32} className="mr-6 fill-neutral-700" />
            {work.name}
          </h2>
          <p
            className="text-justify"
            dangerouslySetInnerHTML={{
              __html: t.works.descriptions[work.description],
            }}
          />
          <Link label={`> ${t.works.access}_`} href={work.url} />
        </div>
        {work.images.length > 1 && (
          <div
            className={`${
              work.images.length < 4 ? "justify-start" : "justify-between"
            } flex w-[300px] min-w-[300px] px-6 desk:h-full desk:min-h-[300px] desk:w-[50px] desk:min-w-[50px] desk:flex-col desk:px-0 desk:py-6`}
          >
            {work.images.map((img, i) => (
              <div
                className={`relative isolate aspect-square h-[50px] w-[50px] cursor-pointer ${
                  work.images.length < 4
                    ? "mr-6 desk:mb-5 desk:mr-0"
                    : "mr-0 mb-0"
                }`}
                key={i}
                onClick={() => setDisplayedImageIndex(i)}
              >
                <Image
                  src={img}
                  width={50}
                  height={50}
                  alt="background"
                  placeholder="blur"
                  className="rounded-lg"
                />
                {i === displayedImageIndex && (
                  <div className="absolute top-0 isolate z-10 flex h-[50px] w-[50px] items-center justify-center rounded-lg bg-black/50">
                    <RiEyeLine fill="white" size={22} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        <div className="aspect-square h-[300px] w-[300px] rounded-lg p-6">
          <Image
            src={work.images[displayedImageIndex]}
            width={300}
            height={300}
            alt="background"
            placeholder="blur"
            className="rounded-lg"
          />
        </div>
      </div>
      {isATech && (
        <div className="relative m-6 mt-0 flex max-w-[100%] flex-wrap rounded-lg bg-secondary px-6 py-1 text-xs">
          {work.techs.map((ta, i) => {
            return (
              <div key={i} className="rounded p-2 text-white">
                {ta}
              </div>
            );
          })}
        </div>
      )}
    </article>
  );
};
