import { StoryblokComponent, storyblokEditable } from "@storyblok/react";
import { Title } from "../Title";

// @ts-ignore
export const Module = ({ blok }) => {
  if (blok.inline === true)
    return (
      <section
        className="flex w-full flex-col items-stretch justify-between"
        {...storyblokEditable(blok)}
      >
        <Title value={blok.title} />
        <div className="flex flex-row flex-wrap items-stretch justify-center">
          {blok.widgets.map((nestedBlok: any) => (
            <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
          ))}
        </div>
      </section>
    );

  return (
    <section
      className="flex w-full flex-col items-stretch justify-between"
      {...storyblokEditable(blok)}
    >
      <Title value={blok.title} />
      {blok.widgets.map((nestedBlok: any) => (
        <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </section>
  );
};
