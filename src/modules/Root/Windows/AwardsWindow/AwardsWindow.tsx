import Image from "next/image";
import React, { FC, ReactNode } from "react";

import IMGGrootAward2 from "@/assets/awards/groot/innovation.jpg";
import IMGGrootAward1 from "@/assets/awards/groot/kudos.jpg";
import IMGGrootAward4 from "@/assets/awards/groot/ui.jpg";
import IMGGrootAward3 from "@/assets/awards/groot/ux.jpg";
import { WindowComponentProps } from "@/modules/WindowManager";

interface Award {
  id: string;
  websiteName: string;
  components: ReactNode[];
}

const AWARD_IMG_HEIGHT = 400;

const awards: Award[] = [
  {
    id: "portfolio",
    websiteName: "kevin.riou.pro (This website)",
    components: [
      <Image
        key={1}
        alt="Groot Award 1"
        height={AWARD_IMG_HEIGHT}
        quality={100}
        src={IMGGrootAward1}
      />,
      <Image
        key={2}
        alt="Groot Award 2"
        height={AWARD_IMG_HEIGHT}
        quality={100}
        src={IMGGrootAward2}
      />,
      <Image
        key={3}
        alt="Groot Award 3"
        height={AWARD_IMG_HEIGHT}
        quality={100}
        src={IMGGrootAward3}
      />,
      <Image
        key={4}
        alt="Groot Award 4"
        height={AWARD_IMG_HEIGHT}
        quality={100}
        src={IMGGrootAward4}
      />,
    ],
  },
];

const Award: FC<Award> = ({ websiteName, components }) => (
  <div className="flex w-full flex-col items-center">
    <h3 className="w-full border-b border-neutral-500 pb-2 text-lg font-bold uppercase text-neutral-300">
      {websiteName}
    </h3>
    <div className="flex w-full flex-nowrap gap-4 overflow-x-auto pt-4">
      {components.map((component, index) => (
        <div key={index} className="size-fit min-h-[300px] min-w-[200px]">
          {component}
        </div>
      ))}
    </div>
  </div>
);

export const AwardsWindow: FC<WindowComponentProps> = () => {
  return (
    <div className="flex w-full flex-col gap-4">
      {awards.map((award) => (
        <Award key={award.id} {...award} />
      ))}
    </div>
  );
};
