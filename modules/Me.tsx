import { useContext } from "react";
import { SettingsContext } from "../components/Settings";
import { Title } from "../components/Title";
import { useTranslations } from "../translations/Translations";

export const ModuleMe = () => {
  const { isATech } = useContext(SettingsContext);

  const { t } = useTranslations();

  return (
    <section className="flex w-full flex-col items-stretch justify-between">
      <Title value={t.me.title} />
      <p
        className="my-6 text-justify desk:w-2/3"
        dangerouslySetInnerHTML={{ __html: t.me.p1 }}
      />
      <p
        className="my-6 text-justify desk:w-2/3 desk:self-end"
        dangerouslySetInnerHTML={{ __html: t.me.p2 }}
      />
      <p
        className="my-6 text-justify desk:w-2/3"
        dangerouslySetInnerHTML={{ __html: t.me.p3 }}
      />
      {isATech && (
        <>
          <p
            className="my-6 text-justify text-secondary desk:w-2/3 desk:self-end"
            dangerouslySetInnerHTML={{ __html: t.me.p4 }}
          />
        </>
      )}
    </section>
  );
};
