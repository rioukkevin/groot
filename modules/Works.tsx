import { useState } from "react";
import { Work } from "../components/Work";
import { IWork } from "../typings/Work";

import { Title } from "../components/Title";
import { WORKS_ICONS, WORKS_CONTENT } from "../contents/Works";

const ICON_SIZE = 26;

type TTypes = IWork["type"] | "all";

export const ModuleWorks = () => {
  const [selectedType, setSelectedType] = useState<TTypes>("all");

  const filteredWork =
    selectedType === "all"
      ? WORKS_CONTENT
      : WORKS_CONTENT.filter((w) => w.type === selectedType);

  return (
    <section className="w-full flex flex-col justify-between items-center">
      <Title value="Mes projets récents" />
      <div className="w-full flex justify-start items-center font-bold text-lg">
        <div
          style={{
            color: "all" === selectedType ? "white" : "inherit",
            backgroundColor: "all" === selectedType ? "#CA3C25" : "transparent",
          }}
          className="m-2 cursor-pointer hover:fill-primary hover:scale-110 hover:rotate-12 duration-100 p-2 px-5 rounded-full"
          onClick={() => setSelectedType("all")}
        >
          All
        </div>
        {Object.keys(WORKS_ICONS).map((k, i) => {
          const Icon = WORKS_ICONS[k as IWork["type"]];
          return (
            <div
              key={k}
              style={{
                fill: k === selectedType ? "white" : "inherit",
                backgroundColor: k === selectedType ? "#CA3C25" : "transparent",
              }}
              className="m-2 cursor-pointer hover:fill-primary hover:scale-110 hover:rotate-12 duration-100 p-2 rounded-full"
            >
              <Icon
                size={ICON_SIZE}
                className="fill-inherit"
                onClick={() => setSelectedType(k as IWork["type"])}
              />
            </div>
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
