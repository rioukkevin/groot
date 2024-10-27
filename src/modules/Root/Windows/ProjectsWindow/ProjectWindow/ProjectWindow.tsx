import { motion } from "framer-motion";
import Image from "next/image";
import React, { FC, useEffect, useRef } from "react";
import { ScrollSync, ScrollSyncPane } from "react-scroll-sync";

import { useScopedI18n } from "@/lib/locales/client";
import useScreenSize from "@/lib/screen";
import {
  useWindowActions,
  WindowComponentProps,
} from "@/modules/WindowManager";

import { useProjectData } from "./data";
import ProjectWindowDescription from "./ProjectWindowDescription";
import ProjectWindowGallery from "./ProjectWindowGallery";

const parseProjectId = (id: string) => {
  return id.split(":")[1];
};

export const ProjectWindow: FC<WindowComponentProps> = ({
  id,
  registerWindows,
  unregisterWindows,
}) => {
  const { open } = useWindowActions(id);

  const t = useScopedI18n("projects.gallery");
  const { width: screenWidth, height: screenHeight } = useScreenSize();

  const projectId = parseProjectId(id);
  const project = useProjectData(projectId);

  const descriptionRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const windows = (project?.images ?? []).map((image) => {
      const maxImageWidth = screenWidth
        ? Math.min(screenWidth * 0.8, image.width)
        : image.width;
      const maxImageHeight = screenHeight
        ? Math.min(screenHeight * 0.8, image.height)
        : image.height;

      let newWidth = image.width;
      let newHeight = image.height;

      if (image.width > maxImageWidth || image.height > maxImageHeight) {
        const widthRatio = maxImageWidth / image.width;
        const heightRatio = maxImageHeight / image.height;
        const scaleFactor = Math.min(widthRatio, heightRatio);

        newWidth = Math.round(image.width * scaleFactor);
        newHeight = Math.round(image.height * scaleFactor);
      }

      return {
        title: t("previewTitle"),
        id: image.src,
        component: () => (
          <div className="flex size-full max-h-[80vh] max-w-[80vw] items-center justify-center overflow-hidden rounded-lg">
            <Image
              alt="Project image"
              height={newHeight}
              src={image}
              width={newWidth}
            />
          </div>
        ),
        size: {
          width: newWidth + 32,
          height: newHeight + 40 + 32,
        },
        isFullscreenAllowed: false,
      };
    });

    const ids = registerWindows(windows);
    return () => unregisterWindows(ids);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    registerWindows,
    unregisterWindows,
    id,
    screenWidth,
    screenHeight,
    project?.images,
  ]);

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
              color={project.color}
              images={project.images}
              onImageZoom={open}
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
