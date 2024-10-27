import { AnimatePresence, motion } from "framer-motion";
import React, { FC, useMemo, useState } from "react";

import { cn } from "@/lib/cn";
import { useScopedI18n } from "@/lib/locales/client";
import { TextEffect } from "@/modules/TextEffect/TextEffect";
import { WindowComponentProps } from "@/modules/WindowManager";

import { ExperienceData, useExperiencesData } from "./data";

export const ExperiencesWindow: FC<WindowComponentProps> = ({
  isFullscreen,
}) => {
  const t = useScopedI18n("experiences");

  enum SortOrder {
    MostRecent = "mostRecent",
    Oldest = "oldest",
  }

  const [selectedExperience, setSelectedExperience] =
    useState<ExperienceData | null>(null);
  const [sortBy, setSortBy] = useState<SortOrder>(SortOrder.MostRecent);

  const data = useExperiencesData();

  const sortedData = useMemo(() => {
    return data.sort((a, b) => {
      return sortBy === SortOrder.MostRecent
        ? b.startDate.localeCompare(a.startDate)
        : a.startDate.localeCompare(b.startDate);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy]);

  const handleSelectExperience = (experience: ExperienceData) => {
    setSelectedExperience(null);
    setTimeout(() => {
      setSelectedExperience(experience);
    }, 5);
  };

  return (
    <div className={cn("grid-cols-fr grid h-full w-full grid-cols-3")}>
      <div
        className={cn(
          "col-span-1 flex h-full flex-col gap-4 overflow-y-auto pl-2 pr-6 transition-all duration-1000",
          isFullscreen && "w-full",
        )}
      >
        <motion.div
          animate={{ opacity: 1 }}
          className="flex items-center justify-end gap-4"
          initial={{ opacity: 0 }}
          transition={{ delay: 0.3 }}
        >
          <select
            className="block w-full rounded-lg border border-neutral-600/50 bg-neutral-700 p-2 text-sm text-neutral-200 focus:border-neutral-600"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOrder)}
          >
            <option value={SortOrder.MostRecent}>{t("mostRecent")}</option>
            <option value={SortOrder.Oldest}>{t("oldest")}</option>
          </select>
        </motion.div>
        <motion.ol
          animate={{ borderColor: "gray" }}
          className="relative border-s border-gray-200"
          initial={{ borderColor: "transparent" }}
          transition={{ delay: 0.3 }}
        >
          {sortedData.map((experience, index) => (
            <li
              key={experience.company}
              className="mb-4 ms-4 origin-left cursor-pointer"
              onClick={() => handleSelectExperience(experience)}
            >
              <motion.div
                animate={{ opacity: 1 }}
                className="absolute -start-1.5 mt-1.5 size-3 rounded-full border border-white bg-gray-200"
                initial={{ opacity: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              />
              <motion.div
                animate={{ opacity: 1 }}
                className="flex w-full flex-col gap-2 rounded-lg border border-neutral-600/50 p-4"
                initial={{ opacity: 0 }}
                whileTap={{ scale: 1.05 }}
              >
                <motion.time
                  animate={{ opacity: 1 }}
                  className="text-sm font-normal leading-none text-gray-400"
                  initial={{ opacity: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  {new Date(experience.startDate).toLocaleDateString()} -{" "}
                  {experience.endDate === "Present"
                    ? t("present")
                    : new Date(experience.endDate).toLocaleDateString()}
                </motion.time>
                <h3 className="mt-2 text-sm font-semibold uppercase text-neutral-400">
                  <TextEffect
                    delay={index * 0.1 + 0.3}
                    per="char"
                    preset="fade"
                  >
                    {experience.company}
                  </TextEffect>
                </h3>
                <span className="text-xl font-normal text-neutral-100">
                  <TextEffect delay={index * 0.1 + 0.3} preset="fade">
                    {experience.job}
                  </TextEffect>
                </span>
              </motion.div>
            </li>
          ))}
        </motion.ol>
      </div>
      <div
        className={cn(
          "col-span-2 flex h-full flex-col gap-4 overflow-y-auto border-l border-neutral-600/50 pl-4 transition-all duration-1000",
        )}
      >
        {selectedExperience ? (
          <AnimatePresence>
            <h2 className="text-lg font-semibold uppercase text-neutral-400">
              <TextEffect per="char" preset="fade">
                {selectedExperience.company}
              </TextEffect>
            </h2>
            <p className="text-xl font-semibold">
              <TextEffect per="char" preset="fade">
                {selectedExperience.job}
              </TextEffect>
            </p>
            <motion.p
              animate={{ opacity: 1 }}
              className="text-sm text-neutral-400"
              initial={{ opacity: 0 }}
              transition={{ delay: 0.3 }}
            >
              {new Date(selectedExperience.startDate).toLocaleDateString()} -{" "}
              {selectedExperience.endDate === "Present"
                ? t("present")
                : new Date(selectedExperience.endDate).toLocaleDateString()}
            </motion.p>
            <hr className="w-full border-neutral-600/50" />
            <div className="flex flex-col gap-2">
              <motion.h3
                className="text-lg font-semibold uppercase text-neutral-300"
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                transition={{ delay: 0.3 }}
                whileInView={{ opacity: 1 }}
              >
                {t("technologies")}
              </motion.h3>
              <div className="flex flex-wrap gap-2">
                {selectedExperience.technologies.map((tech, index) => (
                  <motion.span
                    key={index}
                    className="origin-left rounded-lg bg-neutral-700 px-2 py-1 text-xs text-neutral-200"
                    exit={{ opacity: 0, scaleX: 0 }}
                    initial={{ opacity: 0, scaleX: 0 }}
                    transition={{ delay: index * 0.1 + 0.4 }}
                    whileInView={{ opacity: 1, scaleX: 1 }}
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </div>
            {selectedExperience.missions.length > 0 && (
              <div className="mt-4">
                <motion.h3
                  className="text-lg font-semibold uppercase text-neutral-300"
                  exit={{ opacity: 0 }}
                  initial={{ opacity: 0 }}
                  transition={{ delay: 0.6 }}
                  whileInView={{ opacity: 1 }}
                >
                  {t("missions")}
                </motion.h3>
                <ul className="list-inside list-disc text-sm">
                  {selectedExperience.missions.map((mission, index) => (
                    <motion.li
                      key={index}
                      exit={{ opacity: 0 }}
                      initial={{ opacity: 0 }}
                      transition={{ delay: index * 0.1 + 0.7 }}
                      whileInView={{ opacity: 1 }}
                    >
                      {mission}
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}
            {selectedExperience.achievements.length > 0 && (
              <div className="mt-4">
                <motion.h3
                  className="text-lg font-semibold uppercase text-neutral-300"
                  exit={{ opacity: 0 }}
                  initial={{ opacity: 0 }}
                  transition={{ delay: 0.9 }}
                  whileInView={{ opacity: 1 }}
                >
                  {t("achievements")}
                </motion.h3>
                <ul className="list-inside list-disc text-sm">
                  {selectedExperience.achievements.map((achievement, index) => (
                    <motion.li
                      key={index}
                      exit={{ opacity: 0 }}
                      initial={{ opacity: 0 }}
                      transition={{ delay: index * 0.1 + 1 }}
                      whileInView={{ opacity: 1 }}
                    >
                      {achievement}
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}
          </AnimatePresence>
        ) : (
          <div className="flex h-full items-center justify-center">
            <motion.p
              animate={{ opacity: 1 }}
              className="text-center text-3xl text-neutral-400"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
            >
              {t("selectExperience")}
            </motion.p>
          </div>
        )}
      </div>
    </div>
  );
};
