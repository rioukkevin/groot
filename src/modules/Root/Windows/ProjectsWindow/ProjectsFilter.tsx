import React, { useState, useEffect } from "react";
import {
  ProjectType,
  ProjectThumbnail,
  FilterableTechnologies,
  Technology,
} from "./data";
import { Search } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useScopedI18n } from "@/lib/locales/client";
import { useProjectTypeTranslations } from "./useProjectTypeTranslation";

interface ProjectsFilterProps {
  projects: ProjectThumbnail[];
  onFilterChange: (filteredProjects: ProjectThumbnail[]) => void;
}

export const ProjectsFilter: React.FC<ProjectsFilterProps> = ({
  projects,
  onFilterChange,
}) => {
  const t = useScopedI18n("projects.filter");
  const translatedTypes = useProjectTypeTranslations();
  const [selectedTechnology, setSelectedTechnology] = useState<string>("");
  const [selectedType, setSelectedType] = useState<ProjectType | "">("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCount, setFilteredCount] = useState(projects.length);

  const allTechnologies = Array.from(
    new Set(projects.flatMap((project) => project.technologies)),
  )
    .sort()
    .filter((tech) => FilterableTechnologies[tech as Technology]);

  const allProjectTypes = Object.values(ProjectType).filter((type) =>
    projects.some((project) => project.type === type),
  );

  useEffect(() => {
    const filteredProjects = projects.filter((project) => {
      const matchesTechnology =
        selectedTechnology === "" ||
        project.technologies.includes(selectedTechnology);

      const matchesType = selectedType === "" || project.type === selectedType;

      const matchesSearch =
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.shortDescription
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      return matchesTechnology && matchesType && matchesSearch;
    });

    setFilteredCount(filteredProjects.length);
    onFilterChange(filteredProjects);
  }, [selectedTechnology, selectedType, searchTerm, projects, onFilterChange]);

  const filterVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.2, duration: 0.5 },
    }),
  };

  return (
    <div className="flex h-10 space-x-4">
      <motion.div
        variants={filterVariants}
        initial="hidden"
        animate="visible"
        custom={0}
      >
        <select
          value={selectedTechnology}
          onChange={(e) => setSelectedTechnology(e.target.value)}
          className="w-48 cursor-pointer rounded-lg border border-neutral-600/50 bg-neutral-700 p-2 text-sm text-neutral-200 focus:border-neutral-600"
        >
          <option value="">{t("allTechnologies")}</option>
          {allTechnologies.map((tech) => (
            <option key={tech} value={tech}>
              {tech}
            </option>
          ))}
        </select>
      </motion.div>

      <motion.div
        variants={filterVariants}
        initial="hidden"
        animate="visible"
        custom={1}
      >
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as ProjectType | "")}
          className="w-48 cursor-pointer rounded-lg border border-neutral-600/50 bg-neutral-700 p-2 text-sm text-neutral-200 focus:border-neutral-600"
        >
          <option value="">{t("allProjectTypes")}</option>
          {allProjectTypes.map((type) => (
            <option key={type} value={type}>
              {translatedTypes[type]}
            </option>
          ))}
        </select>
      </motion.div>

      <motion.div
        className="relative grow"
        variants={filterVariants}
        initial="hidden"
        animate="visible"
        custom={2}
      >
        <input
          type="text"
          id="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="w-full rounded-lg border border-neutral-600/50 bg-neutral-700 p-2 pr-24 text-sm text-neutral-200 focus:border-neutral-600"
        />
        <AnimatePresence>
          {(searchTerm.length > 0 || filteredCount !== projects.length) && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute right-10 top-2 -translate-y-1/2 rounded-lg bg-neutral-600 px-2 py-1 text-xs text-neutral-200"
            >
              {filteredCount} {t("projectsFound")}
            </motion.div>
          )}
        </AnimatePresence>
        <Search
          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400"
          size={18}
        />
      </motion.div>
    </div>
  );
};
