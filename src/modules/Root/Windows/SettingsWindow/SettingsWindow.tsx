import { motion } from "framer-motion";
import { FC, useEffect, useState } from "react";

import {
  useChangeLocale,
  useCurrentLocale,
  useScopedI18n,
} from "@/lib/locales/client";
import { useUmami } from "@/lib/umami";
import { BackgroundFileSelector } from "@/modules/Theme";
import { WindowComponentProps } from "@/modules/WindowManager";

import { useChatUserContext } from "../ChatWindow/ChatUserProvider";


enum Language {
  English = "en",
  French = "fr",
}

const DEFAULT_USERNAME = "Anonymous";

export const SettingsWindow: FC<WindowComponentProps> = () => {
  const { track } = useUmami();
  const changeLocale = useChangeLocale();
  const locale = useCurrentLocale();
  const t = useScopedI18n("settings");
  const { username, setUsername } = useChatUserContext();

  const [language, setLanguage] = useState<Language>(Language.English);
  const [usernameInput, setUsernameInput] = useState<string>("");

  useEffect(() => {
    if (locale && locale !== language) {
      setLanguage(locale as Language);
    }
  }, [locale, language]);

  useEffect(() => {
    if (!!username && username !== DEFAULT_USERNAME) {
      setUsernameInput(username);
    }
  }, [username]);

  const handleChangeLanguage = (language: Language) => {
    setLanguage(language);
    changeLocale(language);
    track?.("changeLanguage", { language });
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.trim();

    setUsernameInput(newValue);
    if (newValue.length > 0) {
      setUsername(newValue);
    } else {
      setUsername(DEFAULT_USERNAME);
    }
    track?.("changePseudonyme", { username: newValue });
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
          transition={{ delay: 1.4 }}
        >
          {t("chatUsername")}
        </motion.label>
        <motion.input
          type="text"
          value={usernameInput}
          onChange={handleUsernameChange}
          className="block w-full rounded-lg border border-neutral-600/50 bg-neutral-700 p-2 text-sm text-neutral-200 focus:border-neutral-600"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
          placeholder={t("chatUsernamePlaceholder")}
        />
        <motion.label
          className="text-lg font-bold text-neutral-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          {t("theme")}
        </motion.label>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2 }}
        >
          <BackgroundFileSelector />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
