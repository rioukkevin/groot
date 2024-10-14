import React, { FC, useMemo, useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useProjectsData } from "./data";
import { ProjectThumbnail } from "./ProjectThumbnail";

const MARGIN_BOTTOM = -200;

const IS_EVENLY_DIVIDED_CONFIG = [-200, 0, -100];
const IS_ODD_CONFIG = [400, -200, 300];
const IS_EVEN_CONFIG = [-100, 400, -100];

export const ProjectsList: FC<{ data: ReturnType<typeof useProjectsData> }> = ({
  data,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    container: containerRef,
  });

  const spring = useSpring(scrollYProgress ?? 0, { bounce: 0 });

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

  const column1Y = useTransform(spring, [0, 1], [0, offsetConfig[0]]);
  const column2Y = useTransform(spring, [0, 1], [0, offsetConfig[1]]);
  const column3Y = useTransform(spring, [0, 1], [0, offsetConfig[2]]);

  return (
    <div ref={containerRef} className="h-full overflow-y-scroll">
      <div className="flex max-w-screen-xl items-start justify-start gap-6 p-6">
        <motion.div
          style={{ y: column1Y, marginBottom: MARGIN_BOTTOM }}
          className="w-1/3"
        >
          {column1Data.map((item) => (
            <ProjectThumbnail
              key={item.name}
              imageSrc={item.imageSrc}
              name={item.name}
              shortDescription={item.shortDescription}
            />
          ))}
        </motion.div>
        <motion.div
          style={{ y: column2Y, marginBottom: MARGIN_BOTTOM }}
          className="w-1/3"
        >
          {column2Data.map((item) => (
            <ProjectThumbnail
              key={item.name}
              imageSrc={item.imageSrc}
              name={item.name}
              shortDescription={item.shortDescription}
            />
          ))}
        </motion.div>
        <motion.div
          style={{ y: column3Y, marginBottom: MARGIN_BOTTOM }}
          className="w-1/3"
        >
          {column3Data.map((item) => (
            <ProjectThumbnail
              key={item.name}
              imageSrc={item.imageSrc}
              name={item.name}
              shortDescription={item.shortDescription}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};
