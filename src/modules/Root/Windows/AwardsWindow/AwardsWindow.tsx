import { WindowComponentProps } from "@/modules/WindowManager";
import Image from "next/image";
import React, { FC, ReactNode } from "react";

import IMGGrootAward1 from "@/assets/awards/groot/kudos.jpg";
import IMGGrootAward2 from "@/assets/awards/groot/innovation.jpg";
import IMGGrootAward3 from "@/assets/awards/groot/ux.jpg";
import IMGGrootAward4 from "@/assets/awards/groot/ui.jpg";

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
        src={IMGGrootAward1}
        height={AWARD_IMG_HEIGHT}
        alt="Groot Award 1"
        quality={100}
      />,
      <Image
        src={IMGGrootAward2}
        height={AWARD_IMG_HEIGHT}
        alt="Groot Award 2"
        quality={100}
      />,
      <Image
        src={IMGGrootAward3}
        height={AWARD_IMG_HEIGHT}
        alt="Groot Award 3"
        quality={100}
      />,
      <Image
        src={IMGGrootAward4}
        height={AWARD_IMG_HEIGHT}
        alt="Groot Award 4"
        quality={100}
      />,
    ],
  },
];

const Award: FC<Award> = ({ websiteName, components, id }) => (
  <div className="flex w-full flex-col items-center">
    <h3 className="w-full border-b border-neutral-500 pb-2 text-lg font-bold uppercase text-neutral-300">
      {websiteName}
    </h3>
    <div className="flex w-full flex-nowrap gap-4 overflow-x-auto pt-4">
      {components.map((component, index) => (
        <div key={index} className="h-fit min-h-[300px] w-fit min-w-[200px]">
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
