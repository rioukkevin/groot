import { motion, useScroll, useTransform } from "framer-motion";
import React, { FC, useMemo, useRef } from "react";

import { ProjectThumbnail as ProjectThumbnailType } from "./data";
import { ProjectThumbnail } from "./ProjectThumbnail";
const IS_EVENLY_DIVIDED_CONFIG = [-200, 0, -100];
const IS_ODD_CONFIG = [400, -200, 300];
const IS_EVEN_CONFIG = [-200, 400, -200];

interface ProjectsListProps {
  data: ProjectThumbnailType[];
  onOpenProject: (id: string) => void;
}

export const ProjectsList: FC<ProjectsListProps> = ({
  data,
  onOpenProject,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    container: containerRef,
  });

  const isEvenlyDivided = data.length % 3 === 0;
  const isOdd = data.length % 3 === 1;
  const isEven = data.length % 3 === 2;

  const offsetConfig = useMemo(() => {
    if (isEvenlyDivided) {
      return IS_EVENLY_DIVIDED_CONFIG;
    }
    if (isOdd) {
      return IS_ODD_CONFIG;
    }
    return IS_EVEN_CONFIG;
  }, [isEvenlyDivided, isOdd]);

  const dividedData = useMemo(() => {
    const divided = data.reduce(
      (acc, item, index) => {
        const columnIndex = index % 3;
        acc[columnIndex].push(item);
        return acc;
      },
      [[], [], []] as (typeof data)[],
    );

    // Handle uneven distribution
    if (isOdd) {
      divided[1].push(divided[0].pop()!);
    } else if (isEven) {
      divided[2].push(divided[1].pop()!);
    }

    return divided;
  }, [data, isEven, isOdd]);

  const [column1Data, column2Data, column3Data] = dividedData;

  const column1Y = useTransform(scrollYProgress, [0, 1], [0, offsetConfig[0]]);
  const column2Y = useTransform(scrollYProgress, [0, 1], [0, offsetConfig[1]]);
  const column3Y = useTransform(scrollYProgress, [0, 1], [0, offsetConfig[2]]);

  return (
    <div
      ref={containerRef}
      className="mx-auto size-full max-w-screen-xl overflow-y-scroll"
    >
      <div className="flex min-h-[200%] w-full items-start justify-start gap-6 p-6">
        <motion.div
          className="w-1/3"
          style={{
            y: column1Y,
          }}
        >
          {column1Data.map((item) => (
            <ProjectThumbnail
              key={item.name}
              color={item.color}
              imageSrc={item.imageSrc}
              name={item.name}
              shortDescription={item.shortDescription}
              onClick={() => onOpenProject(item.name)}
            />
          ))}
        </motion.div>
        <motion.div
          className="w-1/3"
          style={{
            y: column2Y,
          }}
        >
          {column2Data.map((item) => (
            <ProjectThumbnail
              key={item.name}
              color={item.color}
              imageSrc={item.imageSrc}
              name={item.name}
              shortDescription={item.shortDescription}
              onClick={() => onOpenProject(item.name)}
            />
          ))}
        </motion.div>
        <motion.div
          className="w-1/3"
          style={{
            y: column3Y,
          }}
        >
          {column3Data.map((item) => (
            <ProjectThumbnail
              key={item.name}
              color={item.color}
              imageSrc={item.imageSrc}
              name={item.name}
              shortDescription={item.shortDescription}
              onClick={() => onOpenProject(item.name)}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};
