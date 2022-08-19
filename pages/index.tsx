import type { NextPage } from "next";
import Head from "next/head";
import { Socials } from "../components/Socials";
import { ModuleHome } from "../modules/Home";
import { ModuleMe } from "../modules/Me";
import { ModuleSettings } from "../modules/Settings";
import { ModuleWorks } from "../modules/Works";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>RIOU Kevin</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

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
