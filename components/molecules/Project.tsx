import { FC, useContext, useMemo, useState } from "react";
import { IWork } from "../../typings/Work";

import Image from "next/image";

import { WORKS_ICONS } from "../../contents/Works";
import { RiEyeLine } from "react-icons/ri";
import { Link } from "../Link";
import { SettingsContext } from "../Settings";
import { useTranslations } from "../../translations/Translations";
import { marked } from "marked";
import { String } from "../atoms/String";
import { storyblokEditable } from "@storyblok/react";

const THUMBNAIL_SUFFIX = "/m/60x60";
const THUMBNAIL_BLUR_SUFFIX = "/m/60x60/filters:blur(15)";
const VIEW_SUFFIX = "/m/300x300";
const BLUR_SUFFIX = "/m/100x100/filters:blur(20)";

// @ts-ignore
export const Project: FC = ({ blok }) => {
  const { isATech } = useContext(SettingsContext);

  const [displayedImageIndex, setDisplayedImageIndex] = useState<number>(0);

  const description = useMemo(
    () => marked.parse(blok.description),
    [blok.description]
  );

  // @ts-ignore
  const Icon = WORKS_ICONS[blok.type];
  const { t } = useTranslations();

  return (
    <article
      className={`relative mb-5 rounded-lg bg-white shadow-lg desk:m-3`}
      {...storyblokEditable(blok)}
    >
      <div className="m-0 flex w-full flex-col flex-nowrap items-center justify-between desk:flex-row">
        <div className="relative flex h-full grow flex-col justify-between p-6 desk:p-12">
          <h2 className="mb-3 flex text-xl font-bold">
            <Icon size={32} className="mr-6 fill-neutral-700" />
            {blok.name}
          </h2>
          <p
            className="text-justify"
            dangerouslySetInnerHTML={{
              __html: description,
            }}
          />
          <Link label={`> ${t.works.access}_`} href={blok.url} />
        </div>
        {blok.images.length > 1 && (
          <div
            className={`${
              blok.images.length < 4 ? "justify-start" : "justify-between"
            } flex w-[300px] min-w-[300px] px-6 desk:h-full desk:min-h-[300px] desk:w-[50px] desk:min-w-[50px] desk:flex-col desk:px-0 desk:py-6`}
          >
            {blok.images.map((img: any, i: number) => (
              <div
                className={`relative isolate aspect-square h-[50px] w-[50px] cursor-pointer ${
                  blok.images.length < 4
                    ? "mr-6 desk:mb-5 desk:mr-0"
                    : "mr-0 mb-0"
                }`}
                key={i}
                onClick={() => setDisplayedImageIndex(i)}
              >
                <Image
                  src={`${img.filename}${THUMBNAIL_SUFFIX}`}
                  blurDataURL={`${img.filename}${THUMBNAIL_BLUR_SUFFIX}`}
                  width={50}
                  height={50}
                  alt="background"
                  placeholder="blur"
                  loading="lazy"
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
            src={`${blok.images[displayedImageIndex].filename}${VIEW_SUFFIX}`}
            blurDataURL={`${blok.images[displayedImageIndex].filename}${BLUR_SUFFIX}`}
            width={300}
            height={300}
            alt="background"
            placeholder="blur"
            loading="lazy"
            className="rounded-lg"
          />
        </div>
      </div>
      {isATech && (
        <div className="relative m-6 mt-0 flex max-w-[100%] flex-wrap rounded-lg bg-secondary px-6 py-1 text-xs">
          {blok.techs.map((ta: string, i: number) => {
            return (
              <div key={i} className="rounded p-2 text-white">
                <String blok={ta} />
              </div>
            );
          })}
        </div>
      )}
    </article>
  );
};
