import { useState } from "react";
import { Work } from "../components/Work";
import { IWork } from "../typings/Work";

import { Title } from "../components/Title";
import { WORKS_ICONS, WORKS_CONTENT } from "../contents/Works";
import { Icon } from "../components/Icon";
import { useTranslations } from "../translations/Translations";

type TTypes = IWork["type"] | "all";

export const ModuleWorks = () => {
  const [selectedType, setSelectedType] = useState<TTypes>("all");

  const filteredWork =
    selectedType === "all"
      ? WORKS_CONTENT
      : WORKS_CONTENT.filter((w) => w.type === selectedType);

  const { t } = useTranslations();

  return (
    <section className="flex w-full flex-col items-center justify-between">
      <Title value={t.works.title} />
      <div className="mb-6 flex w-full flex-wrap items-center justify-start text-lg font-bold desk:flex-nowrap">
        <div
          style={{
            color: "all" === selectedType ? "white" : "inherit",
            backgroundColor: "all" === selectedType ? "#CA3C25" : "transparent",
          }}
          className="m-2 cursor-pointer rounded-full p-2 px-5 duration-100 hover:rotate-12 hover:scale-110 hover:fill-primary"
          onClick={() => setSelectedType("all")}
        >
          {t.works.all}
        </div>
        {Object.keys(WORKS_ICONS).map((k, i) => {
          const Ico = WORKS_ICONS[k as IWork["type"]];
          return (
            <Icon
              Ico={Ico}
              k={k}
              label={t.works.types[k as IWork["type"]]}
              isSelected={k === selectedType}
              onClick={() => setSelectedType(k as IWork["type"])}
              key={k}
            />
          );
        })}
      </div>
      <div className="flex w-full flex-wrap items-center justify-start">
        {filteredWork.map((w, i) => (
          <Work key={i} work={w} />
        ))}
      </div>
    </section>
  );
};
