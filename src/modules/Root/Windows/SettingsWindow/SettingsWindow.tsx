import {
  useChangeLocale,
  useCurrentLocale,
  useScopedI18n,
} from "@/lib/locales/client";
import { BackgroundFileSelector } from "@/modules/Theme/Background";
import { WindowChildrenProps } from "@/modules/Window";
import { FC, useEffect, useState } from "react";
import { motion } from "framer-motion";

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
    <motion.div
      className="flex w-full flex-col gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <motion.div
        className="flex flex-col gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <motion.div
          className="flex w-full flex-col justify-between gap-2"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <motion.label
            className="text-lg font-bold text-neutral-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {t("language")}
          </motion.label>
          <motion.select
            value={language}
            onChange={(e) => handleChangeLanguage(e.target.value as Language)}
            className="block w-full cursor-pointer rounded-lg border border-neutral-600/50 bg-neutral-700 p-2 text-sm text-neutral-200 focus:border-neutral-600"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <option value={Language.English}>{t("english")}</option>
            <option value={Language.French}>{t("french")}</option>
          </motion.select>
        </motion.div>
        <motion.label
          className="text-lg font-bold text-neutral-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          {t("theme")}
        </motion.label>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
        >
          <BackgroundFileSelector />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
