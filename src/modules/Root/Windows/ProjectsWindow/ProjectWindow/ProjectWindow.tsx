import React, { FC, useRef } from "react";
import { WindowChildrenProps } from "@/modules/Window";
import { useProjectData } from "./data";
import ProjectWindowDescription from "./ProjectWindowDescription";
import ProjectWindowGallery from "./ProjectWindowGallery";
import { motion } from "framer-motion";
import { ScrollSync, ScrollSyncPane } from "react-scroll-sync";

const parseProjectId = (id: string) => {
  return id.split("-")[2];
};

export const ProjectWindow: FC<WindowChildrenProps> = ({ id }) => {
  const projectId = parseProjectId(id);
  const project = useProjectData(projectId);

  const descriptionRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  if (!project) return <div>Project not found</div>;

  return (
    <ScrollSync>
      <div className="grid size-full max-h-full grid-cols-3 gap-4 overflow-y-auto">
        <ScrollSyncPane>
          <motion.div
            ref={galleryRef}
            className="col-span-1 h-full overflow-y-auto"
          >
            <ProjectWindowGallery
              images={project.images}
              color={project.color}
            />
          </motion.div>
        </ScrollSyncPane>
        <ScrollSyncPane>
          <motion.div
            ref={descriptionRef}
            className="col-span-2 h-full overflow-y-auto"
          >
            <ProjectWindowDescription project={project} />
          </motion.div>
        </ScrollSyncPane>
      </div>
    </ScrollSync>
  );
};
