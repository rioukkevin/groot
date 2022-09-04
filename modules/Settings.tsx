import { useContext } from "react";
import { SettingsContext } from "../components/Settings";
import { Toggle } from "../components/Toggle";
import { useTranslations } from "../translations/Translations";

export const ModuleSettings = () => {
  const settings = useContext(SettingsContext);

  const { t } = useTranslations();

  return (
    <section className="mt-24 flex w-full flex-col items-stretch justify-between">
      <Toggle label={t.settings.isATechlabel} onChecked={settings.setIsATech} />
    </section>
  );
};
