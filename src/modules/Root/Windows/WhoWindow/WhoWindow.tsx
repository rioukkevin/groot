import Image from "next/image";
import { FC } from "react";
import { WindowChildrenProps } from "@/modules/Window";
import { useScopedI18n } from "@/lib/locales/client";

import IMGMe from "@/assets/me.png";

export const WhoWindow: FC<WindowChildrenProps> = () => {
  const t = useScopedI18n("who");

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-col items-center gap-4">
        <Image
          src={IMGMe}
          alt="Kevin"
          width={350}
          height={350}
          quality={100}
          className="grayscale"
        />
        <h1 className="text-pretty text-5xl font-light uppercase">
          {t("title")}
        </h1>
        <hr className="w-full border-neutral-200/50" />
        <div className="flex w-full items-stretch justify-evenly gap-2">
          <div className="flex flex-col items-center">
            <p className="text-5xl font-light">7+</p>
            <p className="text-sm font-extrabold">{t("years")}</p>
          </div>
          <div className="w-px bg-neutral-200/50" />
          <div className="flex flex-col items-center">
            <p className="text-5xl font-light">40+</p>
            <p className="text-sm font-extrabold">{t("projects")}</p>
          </div>
        </div>
        <hr className="w-full border-neutral-200/50" />
        <h2 className="w-full text-lg font-bold uppercase">{t("about")}</h2>
        <p
          className="w-full"
          dangerouslySetInnerHTML={{ __html: t("description1") }}
        />
        <p
          className="w-full"
          dangerouslySetInnerHTML={{ __html: t("description2") }}
        />
      </div>
    </div>
  );
};
