import type { NextPage } from "next";
import Image from "next/image";

import ImgXP from "../public/resume/xp.png";
import ImgTechnis from "../public/resume/technis.png";
import { ModuleHome } from "../modules/Home";

const Xp: NextPage = () => {
  return (
    <>
      <main className="relative mx-auto flex w-[100%] max-w-[1920px] flex-col items-center justify-start rounded-lg bg-[#F9F9F9]">
        <div className="m-20 rounded-3xl bg-white p-20">
          <ModuleHome />
        </div>
        <Image src={ImgXP} alt="experience" />
        <Image src={ImgTechnis} alt="technis" style={{ marginTop: 30 }} />
      </main>
    </>
  );
};

export default Xp;
