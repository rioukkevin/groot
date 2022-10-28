import { Ad } from "../components/Ad";
import { Link } from "../components/Link";
import { Title } from "../components/Title";
import { ADS_CONTENT } from "../contents/Ads";
import { useTranslations } from "../translations/Translations";

export const ModuleFooter = () => {
  const { t } = useTranslations();

  return (
    <section className="flex w-full flex-col flex-wrap items-center justify-center rounded py-8">
      <Title value={t.footer.title} />
      <div className="flex flex-row flex-wrap items-stretch justify-center">
        {ADS_CONTENT.map((a, i) => (
          <Ad ad={a} key={i} />
        ))}
      </div>
    </section>
  );
};
