import Image from "next/image";

import IMGMe from "../assets/Profil.png";
import { useTranslations } from "../translations/Translations";

export const ModuleHome = () => {
  const { t } = useTranslations();

  return (
    <section className="w-full flex justify-between items-center">
      <div className="flex flex-col w-2/5">
        <h1 className="font-bold flex mb-10">
          <div className="-mt-4 text-5xl">RIOU</div>
          <div className="mt-4 text-6xl">Kevin</div>
        </h1>
        <h2 className="text-2xl text-white flex -ml-4 mb-10">
          <div className="px-4 py-2 bg-secondary">{t.home.job1}</div>
          <div className="ml-4 px-4 py-2 bg-secondary">{t.home.job2}</div>
        </h2>
        <p>{t.home.info}</p>
      </div>
      <Image
        src={IMGMe}
        alt="my head"
        width={400}
        height={400}
        loading="lazy"
        placeholder="blur"
      />
    </section>
  );
};
