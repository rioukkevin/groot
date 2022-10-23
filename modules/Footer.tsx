import { Link } from "../components/Link";
import { Title } from "../components/Title";
import { useTranslations } from "../translations/Translations";

export const ModuleFooter = () => {
  const { t } = useTranslations();

  return (
    <section className="flex w-full flex-col flex-wrap items-center justify-center rounded py-8">
      <Title value={t.footer.title} />
      <div className="flex flex-row items-stretch justify-center">
        <article className="relative mb-5 flex max-w-[350px] flex-col rounded-lg bg-white p-8 shadow-lg desk:m-3">
          <h3 className="mb-4 whitespace-nowrap text-xl font-bold uppercase">
            {t.footer.elements.chezKyou.name}
          </h3>
          <p className="mb-4 text-justify">
            {t.footer.elements.chezKyou.description}
          </p>
          <Link href={t.footer.elements.chezKyou.link} label={t.footer.link} />
        </article>
      </div>
    </section>
  );
};
