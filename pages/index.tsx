import type { NextPage } from "next";
import { Socials } from "../components/Socials";
import { ModuleHome } from "../modules/Home";
import { ModuleMe } from "../modules/Me";
import { Metas } from "../modules/SEO/Metas";
import { ModuleSettings } from "../modules/Settings";
import { ModuleWorks } from "../modules/Works";

const Home: NextPage = () => {
  return (
    <>
      <Metas />
      <main className="relative mx-auto flex max-w-[1280px] flex-col items-center justify-start rounded-lg border-darky bg-white shadow-md desk:container">
        <Socials />
        <div className="flex w-full flex-col items-center justify-start px-5 pb-24 desk:my-24 desk:px-36">
          <ModuleHome />
          <ModuleSettings />
          <ModuleMe />
          <ModuleWorks />
        </div>
      </main>
    </>
  );
};

export default Home;
