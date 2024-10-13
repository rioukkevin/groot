import { FC, useMemo, useState } from "react";
import { data, ExperienceData } from "./data";
import { WindowChildrenProps } from "@/modules/Window";
import { cn } from "@/lib/cn";

export const ExperiencesWindow: FC<WindowChildrenProps> = ({
  isFullscreen,
}) => {
  enum SortOrder {
    MostRecent = "mostRecent",
    Oldest = "oldest",
  }

  const [selectedExperience, setSelectedExperience] =
    useState<ExperienceData | null>(null);
  const [sortBy, setSortBy] = useState<SortOrder>(SortOrder.MostRecent);

  const sortedData = useMemo(() => {
    return data.sort((a, b) => {
      return sortBy === SortOrder.MostRecent
        ? b.startDate.localeCompare(a.startDate)
        : a.startDate.localeCompare(b.startDate);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy]);

  return (
    <div className={cn("grid-cols-fr grid h-full w-full grid-cols-3")}>
      <div
        className={cn(
          "col-span-1 flex h-full flex-col gap-4 overflow-y-auto pl-2 pr-6 transition-all duration-1000",
          isFullscreen && "w-full",
        )}
      >
        <h1 className="text-3xl font-bold">News</h1>
        <div className="flex items-center justify-end gap-4">
          <label className="whitespace-nowrap text-sm text-neutral-200">
            Sort by:
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOrder)}
            className="block w-full rounded-lg border border-neutral-600/50 bg-neutral-700 p-2 text-sm text-neutral-200 focus:border-neutral-600"
          >
            <option selected value={SortOrder.MostRecent}>
              Most recent
            </option>
            <option value={SortOrder.Oldest}>Oldest</option>
          </select>
        </div>
        <ol className="relative border-s border-gray-200 dark:border-gray-700">
          {sortedData.map((experience) => (
            <li
              key={experience.company}
              className="mb-4 ms-4 cursor-pointer"
              onClick={() => setSelectedExperience(experience)}
            >
              <div className="absolute -start-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-gray-200 dark:border-gray-900 dark:bg-gray-700"></div>
              <div className="flex w-full flex-col gap-2 rounded-lg border border-neutral-600/50 p-4">
                <time className="text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                  {new Date(experience.startDate).toLocaleDateString()} -{" "}
                  {experience.endDate === "Present"
                    ? "Present"
                    : new Date(experience.endDate).toLocaleDateString()}
                </time>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {experience.company}
                </h3>
                <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                  {experience.job}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <div
        className={cn(
          "col-span-2 flex h-full flex-col gap-4 overflow-y-auto border-l border-neutral-600/50 pl-4 transition-all duration-1000",
        )}
      >
        {selectedExperience ? (
          <>
            <h2 className="text-lg font-bold">{selectedExperience.company}</h2>
            <p>{selectedExperience.job}</p>
            <p className="text-sm text-neutral-500">
              {new Date(selectedExperience.startDate).toLocaleDateString()} -{" "}
              {selectedExperience.endDate === "Present"
                ? "Present"
                : new Date(selectedExperience.endDate).toLocaleDateString()}
            </p>
            <hr className="w-full border-neutral-600/50" />
            <div className="mt-2">
              <h3 className="mb-2 text-sm font-semibold">Technologies:</h3>
              <div className="flex max-w-[60vw] flex-wrap gap-2">
                {selectedExperience.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="rounded-lg bg-neutral-600 px-2 py-1 text-xs text-neutral-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            {selectedExperience.missions.length > 0 && (
              <div className="mt-4">
                <h3 className="mb-2 text-sm font-semibold">Missions:</h3>
                <ul className="list-inside list-disc text-sm">
                  {selectedExperience.missions.map((mission, index) => (
                    <li key={index}>{mission}</li>
                  ))}
                </ul>
              </div>
            )}
            {selectedExperience.achievements.length > 0 && (
              <div className="mt-4">
                <h3 className="mb-2 text-sm font-semibold">Achievements:</h3>
                <ul className="list-inside list-disc text-sm">
                  {selectedExperience.achievements.map((achievement, index) => (
                    <li key={index}>{achievement}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-center text-3xl text-neutral-400">
              Select an experience to view details
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
