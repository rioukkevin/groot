import Image from "next/image";

import IMGMe from "../assets/Profil.png";
import { useTranslations } from "../translations/Translations";

export const ModuleHome = () => {
  const { t } = useTranslations();

  return (
    <section className="flex w-full flex-col-reverse items-center justify-between desk:flex-row">
      <div className="mt-5 flex w-full flex-col items-center desk:mt-0 desk:w-2/5 desk:items-start">
        <h1 className="mb-10 flex font-bold">
          <div className="text-3xl desk:-mt-4 desk:text-5xl">RIOU</div>
          <div className="ml-3 text-3xl desk:mt-4 desk:text-6xl">Kevin</div>
        </h1>
        <h2 className="mb-10 flex text-2xl text-white desk:-ml-4">
          <div className="bg-secondary px-4 py-2">{t.home.job1}</div>
          <div className="ml-4 bg-secondary px-4 py-2">{t.home.job2}</div>
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
