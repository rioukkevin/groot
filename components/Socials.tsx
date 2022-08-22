import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { RiGithubLine, RiLinkedinLine, RiTranslate } from "react-icons/ri";
import { TranslationsContext } from "../translations/Translations";
import { Link } from "./Link";

const ICON_SIZE = 24;

export const Socials = () => {
  const router = useRouter();

  const [lang, setLangInternal] = useState<"fr" | "en">("fr");
  const { setLang } = useContext(TranslationsContext);

  const handleChangeLang = () => {
    const toSet = lang === "fr" ? "en" : "fr";

    setLangInternal(toSet);
    setLang(toSet);
  };

  return (
    <div className="flex justify-center items-center absolute top-0 right-0 p-6">
      <button
        onClick={handleChangeLang}
        className="mr-6 flex justify-center items-center hover:scale-110 duration-100 hover:fill-primary hover:text-primary font-bold"
      >
        <RiTranslate className="mr-2" size={22} />
        {lang === "fr" ? "En" : "Fr"}
      </button>
      <Link label="kevin@riou.pro" href="mailto:kevin@riou.pro"></Link>
      <a
        href="https://www.linkedin.com/in/k%C3%A9vinriou/"
        target="_blank"
        rel="noreferrer"
        className="relative ml-6 mx-3 hover:fill-primary hover:scale-110 hover:rotate-45 duration-100 rounded-full"
      >
        <RiLinkedinLine size={ICON_SIZE} className="fill-inherit" />
      </a>
      <a
        href="https://github.com/rioukkevin"
        target="_blank"
        rel="noreferrer"
        className="mx-3 hover:fill-primary hover:scale-110 hover:rotate-45 duration-100 rounded-full"
      >
        <RiGithubLine size={ICON_SIZE} className="fill-inherit" />
      </a>
    </div>
  );
};
