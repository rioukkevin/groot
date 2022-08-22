import { useContext } from "react";
import { SettingsContext } from "../components/Settings";
import { Title } from "../components/Title";
import { useTranslations } from "../translations/Translations";

export const ModuleMe = () => {
  const { isATech } = useContext(SettingsContext);

  const { t } = useTranslations();

  return (
    <section className="w-full flex flex-col justify-between items-stretch">
      <Title value={t.me.title} />
      <p
        className="w-2/3 text-justify my-6"
        dangerouslySetInnerHTML={{ __html: t.me.p1 }}
      />
      <p
        className="w-2/3 self-end text-justify my-6"
        dangerouslySetInnerHTML={{ __html: t.me.p2 }}
      />
      <p
        className="w-2/3 text-justify my-6"
        dangerouslySetInnerHTML={{ __html: t.me.p3 }}
      />
      {isATech && (
        <>
          <p
            className="w-2/3 self-end text-justify my-6 text-secondary"
            dangerouslySetInnerHTML={{ __html: t.me.p4 }}
          />
        </>
      )}
    </section>
  );
};
