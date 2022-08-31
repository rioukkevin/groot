import React, {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useState,
} from "react";
import { ITranslation } from ".";
import { en } from "./en";
import { fr } from "./fr";

interface ISettings {
  t: ITranslation;
  setLang: (value: "fr" | "en") => void;
  lang: "fr" | "en";
}

const TRANS: { [key in "fr" | "en"]: ITranslation } = {
  fr,
  en,
};

export const TranslationsContext = createContext<ISettings>({
  t: fr,
  setLang: () => null,
  lang: "fr",
});

interface IProps extends PropsWithChildren {}

export const TranslationsProvider: FC<IProps> = (props) => {
  const [currentLang, setCurrentLang] = useState<"fr" | "en">("fr");

  return (
    <TranslationsContext.Provider
      value={{
        t: TRANS[currentLang],
        setLang: setCurrentLang,
        lang: currentLang,
      }}
    >
      {props.children}
    </TranslationsContext.Provider>
  );
};

export const useTranslations = (): { t: ITranslation } => {
  const { t } = useContext(TranslationsContext);

  return {
    t,
  };
};

export const useLang = (): "fr" | "en" => {
  const { lang } = useContext(TranslationsContext);

  return lang;
};
