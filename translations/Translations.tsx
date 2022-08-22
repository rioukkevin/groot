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
}

const TRANS: { [key in "fr" | "en"]: ITranslation } = {
  fr,
  en,
};

export const TranslationsContext = createContext<ISettings>({
  t: fr,
  setLang: () => null,
});

interface IProps extends PropsWithChildren {}

export const TranslationsProvider: FC<IProps> = (props) => {
  const [currentLang, setCurrentLang] = useState<"fr" | "en">("fr");

  return (
    <TranslationsContext.Provider
      value={{ t: TRANS[currentLang], setLang: setCurrentLang }}
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
