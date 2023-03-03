import { storyblokEditable } from "@storyblok/react";
import { marked } from "marked";
import { useContext, useMemo } from "react";
import { SettingsContext } from "../Settings";

// @ts-ignore
const Me = ({ blok }) => {
  const { isATech } = useContext(SettingsContext);
  const description = useMemo(
    () => marked.parse(blok.description),
    [blok.description]
  );

  if (blok.isATech === true && !isATech) return <></>;
  if (blok.align === "right") {
    return (
      <p
        className={`my-6 text-justify desk:w-2/3 desk:self-end ${
          blok.isATech ? "text-secondary" : ""
        }`}
        {...storyblokEditable(blok)}
        dangerouslySetInnerHTML={{ __html: description }}
      />
    );
  } else {
    return (
      <p
        className={`my-6 text-justify desk:w-2/3 ${
          blok.isATech ? "text-secondary" : ""
        }`}
        {...storyblokEditable(blok)}
        dangerouslySetInnerHTML={{ __html: description }}
      />
    );
  }
};

export default Me;
