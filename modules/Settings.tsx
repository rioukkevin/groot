import { useContext } from "react";
import { SettingsContext } from "../components/Settings";
import { Toggle } from "../components/Toggle";
import { useTranslations } from "../translations/Translations";

export const ModuleSettings = () => {
  const settings = useContext(SettingsContext);

  const { t } = useTranslations();

  return (
    <section className="w-full flex flex-col justify-between items-stretch mt-24">
      <Toggle label={t.settings.isATechlabel} onChecked={settings.setIsATech} />
    </section>
  );
};
