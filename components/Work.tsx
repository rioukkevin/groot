import { FC, useState } from "react";
import { IWork } from "../typings/Work";

import Image from "next/image";

import { WORKS_ICONS } from "../contents/Works";
import { RiEyeLine } from "react-icons/ri";
import { Link } from "./Link";

interface IProps {
  work: IWork;
}

export const Work: FC<IProps> = (props) => {
  const { work } = props;

  const Icon = WORKS_ICONS[work.type];

  const [displayedImageIndex, setDisplayedImageIndex] = useState<number>(0);

  return (
    <article className="mx-3 my-3 relative flex flex-nowrap justify-between items-center w-full h-[300px] bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-12 flex-grow relative h-full flex flex-col justify-between">
        <h2 className="text-xl font-bold mb-3 w-10/12 flex">
          <Icon size={32} className="fill-neutral-700 mr-6" />
          {work.name}
        </h2>
        <p className="text-md w-10/12">{work.description}</p>
        <Link label=">&nbsp;accès_" href={work.url} />
      </div>
      {work.images.length > 1 && (
        <div className="w-[50px] min-w-[50px] h-[300px] py-6 flex flex-col justify-start">
          {work.images.map((img, i) => (
            <div
              className="relative w-[50px] aspect-square mb-3 isolate cursor-pointer"
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
                <div className="absolute bg-black bg-opacity-50 w-[50px] h-[50px] top-0 z-10 isolate rounded-lg flex justify-center items-center">
                  <RiEyeLine fill="white" size={22} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <div className="rounded-lg aspect-square w-fit h-[300px] p-6">
        <Image
          src={work.images[displayedImageIndex]}
          width={300}
          height={300}
          alt="background"
          placeholder="blur"
          className="rounded-lg"
        />
      </div>
    </article>
  );
};
