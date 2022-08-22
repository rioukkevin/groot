import { useState } from "react";
import { Work } from "../components/Work";
import { IWork } from "../typings/Work";

import { Title } from "../components/Title";
import {
  WORKS_ICONS,
  WORKS_CONTENT,
  WORKS_ICONS_LABEL,
} from "../contents/Works";
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
    <section className="w-full flex flex-col justify-between items-center">
      <Title value={t.works.title} />
      <div className="w-full flex justify-start items-center font-bold text-lg">
        <div
          style={{
            color: "all" === selectedType ? "white" : "inherit",
            backgroundColor: "all" === selectedType ? "#CA3C25" : "transparent",
          }}
          className="m-2 cursor-pointer hover:fill-primary hover:scale-110 hover:rotate-12 duration-100 p-2 px-5 rounded-full"
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
              // label={WORKS_ICONS_LABEL[k as IWork["type"]]}
              label={t.works.types[k as IWork["type"]]}
              isSelected={k === selectedType}
              onClick={() => setSelectedType(k as IWork["type"])}
              key={k}
            />
          );
        })}
      </div>
      <div className="flex justify-start items-center flex-wrap w-full">
        {filteredWork.map((w, i) => (
          <Work key={i} work={w} />
        ))}
      </div>
    </section>
  );
};
