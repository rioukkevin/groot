import React, { FC } from "react";
import { WindowChildrenProps } from "@/modules/Window";
import { useProjectData } from "./data";

const parseProjectId = (id: string) => {
  return id.split("-")[1];
};

export const ProjectWindow: FC<WindowChildrenProps> = ({ id }) => {
  const projectId = parseProjectId(id);

  const project = useProjectData(projectId);

  if (!project) return <div>Project not found</div>;

  return <div className="flex h-full flex-col gap-4">{project.name}</div>;
};
