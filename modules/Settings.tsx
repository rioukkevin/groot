import { useContext } from "react";
import { SettingsContext } from "../components/Settings";
import { Toggle } from "../components/Toggle";

export const ModuleSettings = () => {
  const settings = useContext(SettingsContext);

  return (
    <section className="w-full flex flex-col justify-between items-stretch mt-24">
      <Toggle
        label="Voir les informations techniques"
        onChecked={settings.setIsATech}
      />
    </section>
  );
};
