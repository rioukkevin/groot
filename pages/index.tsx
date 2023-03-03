import type { NextPage } from "next";
import { Socials } from "../components/Socials";
import { Metas } from "../modules/SEO/Metas";

import {
  getStoryblokApi,
  StoryblokComponent,
  useStoryblokState,
} from "@storyblok/react";

// @ts-ignore
const Home: NextPage = ({ story, locale }) => {
  story = useStoryblokState(story, {
    language: locale,
  });
  return (
    <>
      <Metas />
      <main className="relative mx-auto my-20 flex max-w-[1280px] flex-col items-center justify-start rounded-lg border-darky bg-white shadow-md desk:container">
        <Socials />
        <div className="flex w-full flex-col items-center justify-start px-5 pb-24 desk:mt-24 desk:px-36">
          {/* <ModuleSettings /> */}
          {story.content.body.map((nestedBlok: any) => (
            <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
          ))}
        </div>
      </main>
    </>
  );
};

export default Home;

// @ts-ignore
export async function getServerSideProps(context) {
  let slug = "home";

  const insideStoryblok = context.query._storyblok;

  let version: "published" | "draft" = "draft";
  if (insideStoryblok) {
    version = "draft";
  }

  const storyblokApi = getStoryblokApi();
  let { data } = await storyblokApi.get(`cdn/stories/${slug}`, {
    version,
    language: context.locale,
  });

  return {
    props: {
      story: data ? data.story : false,
      key: data ? data.story.id : false,
      locale: context.locale,
    },
  };
}
