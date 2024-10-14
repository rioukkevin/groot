import {
  useChangeLocale,
  useCurrentLocale,
  useScopedI18n,
} from "@/lib/locales/client";
import { BackgroundFileSelector } from "@/modules/Theme/Background";
import { WindowChildrenProps } from "@/modules/Window";
import { FC, useEffect, useState } from "react";

enum Language {
  English = "en",
  French = "fr",
}

export const SettingsWindow: FC<WindowChildrenProps> = () => {
  const changeLocale = useChangeLocale();
  const locale = useCurrentLocale();
  const t = useScopedI18n("settings");

  const [language, setLanguage] = useState<Language>(Language.English);

  useEffect(() => {
    if (locale && locale !== language) {
      setLanguage(locale as Language);
    }
  }, [locale, language]);

  const handleChangeLanguage = (language: Language) => {
    setLanguage(language);
    changeLocale(language);
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <h1 className="text-3xl font-bold">{t("title")}</h1>
      <div className="flex flex-col gap-4">
        <div className="flex w-full flex-col justify-between gap-2">
          <label className="text-lg font-bold text-neutral-200">
            {t("language")}
          </label>
          <select
            value={language}
            onChange={(e) => handleChangeLanguage(e.target.value as Language)}
            className="block w-full cursor-pointer rounded-lg border border-neutral-600/50 bg-neutral-700 p-2 text-sm text-neutral-200 focus:border-neutral-600"
          >
            <option value={Language.English}>{t("english")}</option>
            <option value={Language.French}>{t("french")}</option>
          </select>
        </div>
        <label className="text-lg font-bold text-neutral-200">
          {t("theme")}
        </label>
        <BackgroundFileSelector />
      </div>
    </div>
  );
};
