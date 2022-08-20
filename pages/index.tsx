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
      <main className="container relative mx-auto max-w-[1280px] bg-white my-24 py-24 px-36 rounded-lg border-darky border-1 shadow-md flex flex-col justify-start items-center">
        <Socials />
        <ModuleHome />
        <ModuleSettings />
        <ModuleMe />
        <ModuleWorks />
      </main>
    </>
  );
};

export default Home;
