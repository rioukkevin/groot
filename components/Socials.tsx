import { useContext, useState } from "react";
import { RiGithubLine, RiLinkedinLine, RiTranslate } from "react-icons/ri";
import { TranslationsContext, useLang } from "../translations/Translations";
import { Link } from "./Link";

const ICON_SIZE = 24;

export const Socials = () => {
  const [lang, setLangInternal] = useState<"fr" | "en">("fr");
  const { setLang, t } = useContext(TranslationsContext);

  const handleChangeLang = () => {
    const toSet = lang === "fr" ? "en" : "fr";

    setLangInternal(toSet);
    setLang(toSet);
  };

  return (
    <div className="relative -mb-6 flex w-full flex-col flex-wrap items-end justify-center p-6 desk:mb-12 desk:flex-row desk:items-center desk:justify-end">
      <div className="flex flex-nowrap items-center justify-end">
        <Link label={t.socials.resume} href={`/resume/${lang}.pdf`}></Link>
        <button
          onClick={handleChangeLang}
          className="mx-6 flex items-center justify-center font-bold duration-100 hover:scale-110 desk:hover:fill-primary desk:hover:text-primary"
        >
          <RiTranslate className="mr-2" size={22} />
          {lang === "fr" ? "En" : "Fr"}
        </button>
        <Link label="kevin@riou.pro" href="mailto:kevin@riou.pro"></Link>
      </div>
      <div className="flex flex-col flex-nowrap items-center justify-end desk:flex-row">
        <a
          href="https://www.linkedin.com/in/k%C3%A9vinriou/"
          target="_blank"
          rel="noreferrer"
          className="relative mt-6 rounded-full duration-100 hover:rotate-45 hover:scale-110 hover:fill-primary desk:mx-3 desk:mt-0 desk:ml-6"
        >
          <RiLinkedinLine size={ICON_SIZE} className="fill-inherit" />
        </a>
        <a
          href="https://github.com/rioukkevin"
          target="_blank"
          rel="noreferrer"
          className="mt-6 rounded-full duration-100 hover:rotate-45 hover:scale-110 hover:fill-primary desk:mx-3 desk:mt-0"
        >
          <RiGithubLine size={ICON_SIZE} className="fill-inherit" />
        </a>
      </div>
    </div>
  );
};
