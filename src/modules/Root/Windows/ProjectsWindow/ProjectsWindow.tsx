import React, { FC, useEffect, useState } from "react";

import useScreenSize from "@/lib/screen";
import {
  useWindowActions,
  WindowComponentProps,
} from "@/modules/WindowManager";

import { ProjectThumbnail, useProjectsData } from "./data";
import { ProjectsFilter } from "./ProjectsFilter";
import { ProjectsList } from "./ProjectsList";
import { ProjectWindow } from "./ProjectWindow";


export const ProjectsWindow: FC<WindowComponentProps> = ({
  id,
  registerWindows,
  unregisterWindows,
}) => {
  const { height: screenHeight } = useScreenSize();

  const { open } = useWindowActions(id);

  const projects = useProjectsData();

  const [filteredProjects, setFilteredProjects] = useState<ProjectThumbnail[]>(
    [],
  );

  useEffect(() => {
    const windows = projects.map((project) => ({
      id: `${project.name}`,
      title: project.name,
      component: ProjectWindow,
      isFullscreenAllowed: true,
      defaultSize: {
        width: 1024,
        height: screenHeight * 0.6,
      },
    }));

    const windowsIds = registerWindows(windows);

    return () => {
      unregisterWindows(windowsIds);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects, screenHeight]);

  return (
    <div className="flex h-full flex-col gap-4">
      <ProjectsFilter
        projects={projects}
        onFilterChange={setFilteredProjects}
      />
      <ProjectsList data={filteredProjects} onOpenProject={open} />
    </div>
  );
};
