import { FC, useContext } from "react";
import { ADS_CONTENT } from "../contents/Ads";
import { TranslationsContext } from "../translations/Translations";
import { IAd } from "../typings/Ad";
import { Link } from "./Link";

interface IProps {
  ad: IAd;
}

export const Ad: FC<IProps> = (props) => {
  const { ad } = props;

  const { t } = useContext(TranslationsContext);

  return (
    <article
      className="relative mb-5 flex max-w-[350px] flex-col justify-between rounded-lg border-2 border-solid bg-white p-8 shadow-lg desk:m-3"
      style={{ borderColor: ad.color }}
    >
      <h3 className="mb-4 whitespace-nowrap text-xl font-bold uppercase">
        {t.footer.elements[ad.slug].name}
      </h3>
      <p className="mb-4 text-justify">
        {t.footer.elements[ad.slug].description}
      </p>
      <Link href={ad.url} label={t.footer.link} />
    </article>
  );
};
