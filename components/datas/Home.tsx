import Image from "next/image";

import useWindowPosition from "../../hooks/useWindowScroll";
import { useMemo } from "react";
import { marked } from "marked";
import twemoji from "twemoji";

import IMGMe from "../../assets/Profil.png";
import IMGName from "../../assets/Name.svg";
import IMGShapeTriangle from "../../assets/shapes/Triangle.png";
import IMGShapeSquare from "../../assets/shapes/Square.png";
import IMGShapeCircle from "../../assets/shapes/Circle.png";

// @ts-ignore
export const Home = ({ blok }) => {
  const { y } = useWindowPosition();

  const transformations = {
    circle: {
      transform: `translate(${(y / 2) * -1}px, ${(y / 4) * -1}px)`,
    },
    square: {
      transform: `translate(${(y / 4) * -1}px, ${y / 6}px) rotate(${y / 8}deg)`,
    },
    triangle: {
      transform: `translate(${y / 3}px, ${(y / 3) * -1}px) rotate(-${
        y / 12
      }deg)`,
    },
  };

  const description = useMemo(
    () => marked.parse(twemoji.parse(blok.description)),
    [blok.description]
  );

  return (
    <section className="flex w-full flex-col-reverse items-center justify-between desk:flex-row">
      <div className="mt-5 flex w-full flex-col items-center desk:mt-0 desk:w-2/5 desk:items-start">
        <h1 className="mb-10 flex font-bold">
          <div className="text-3xl desk:hidden">{blok.name}</div>
          <div className="-mt-10 hidden desk:block">
            <Image
              src={IMGName}
              alt={blok.name}
              width={300}
              height={200}
              loading="lazy"
            />
          </div>
        </h1>
        <h2 className="mb-10 flex text-2xl text-white desk:-ml-4">
          <div className="bg-secondary px-4 py-2">{blok.job1}</div>
          <div className="ml-4 bg-secondary px-4 py-2">{blok.job2}</div>
        </h2>
        <p dangerouslySetInnerHTML={{ __html: description }} />
      </div>
      <div className="relative h-[400px] w-[400px]">
        <div
          className="absolute left-[190px] top-[130px] m-[-75px] h-[150px] w-[150px] will-change-auto"
          style={transformations.circle}
        >
          <Image
            src={IMGShapeCircle}
            alt="circle"
            width={150}
            height={150}
            loading="lazy"
            placeholder="blur"
          />
        </div>
        <div
          className="absolute left-[130px] top-[270px] m-[-75px] h-[150px] w-[150px] will-change-auto"
          style={transformations.square}
        >
          <Image
            src={IMGShapeSquare}
            alt="circle"
            width={150}
            height={150}
            loading="lazy"
            placeholder="blur"
          />
        </div>
        <Image
          src={IMGMe}
          alt="my head"
          width={400}
          height={400}
          loading="lazy"
          placeholder="blur"
        />
        <div
          className="absolute left-[280px] top-[230px] m-[-75px] h-[150px] w-[150px] will-change-auto"
          style={transformations.triangle}
        >
          <Image
            src={IMGShapeTriangle}
            alt="circle"
            width={150}
            height={150}
            loading="lazy"
            placeholder="blur"
          />
        </div>
      </div>
    </section>
  );
};
