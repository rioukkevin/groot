import { useMemo } from "react";
import { useProjectsData, ProjectThumbnail } from "../data";

export const useProjectData = (id: string): ProjectThumbnail | undefined => {
  const allProjects = useProjectsData();

  const project = useMemo(() => {
    return allProjects.find((p) => p.name === id);
  }, [allProjects, id]);

  return project;
};
