import React, { FC, useState } from "react";
import { WindowChildrenProps } from "@/modules/Window";
import { ProjectThumbnail } from "./data";
import { ProjectsList } from "./ProjectsList";
import { ProjectsFilter } from "./ProjectsFilter";

export const ProjectsWindow: FC<WindowChildrenProps> = () => {
  const [filteredProjects, setFilteredProjects] = useState<ProjectThumbnail[]>(
    [],
  );

  return (
    <div className="flex h-full flex-col gap-4">
      <ProjectsFilter onFilterChange={setFilteredProjects} />
      <ProjectsList data={filteredProjects} />
    </div>
  );
};
