import { BackgroundFileSelector } from "@/modules/Theme/Background";
import { WindowChildrenProps } from "@/modules/Window";
import { FC, useState } from "react";

enum Language {
  English = "en",
  French = "fr",
}

export const SettingsWindow: FC<WindowChildrenProps> = () => {
  const [language, setLanguage] = useState<Language>(Language.English);

  return (
    <div className="flex w-full flex-col gap-4">
      <h1 className="text-3xl font-bold">Settings</h1>
      <div className="flex flex-col gap-4">
        <div className="flex w-full flex-col justify-between gap-2">
          <label className="text-lg font-bold text-neutral-200">Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="block w-full cursor-pointer rounded-lg border border-neutral-600/50 bg-neutral-700 p-2 text-sm text-neutral-200 focus:border-neutral-600"
          >
            <option value={Language.English}>English</option>
            <option value={Language.French}>French</option>
          </select>
        </div>
        <label className="text-lg font-bold text-neutral-200">Theme</label>
        <BackgroundFileSelector />
      </div>
    </div>
  );
};
