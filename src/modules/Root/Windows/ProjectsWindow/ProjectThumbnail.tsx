import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectThumbnail as ProjectThumbnailType } from "./data";
import { useScopedI18n } from "@/lib/locales/client";

interface ProjectThumbnailProps
  extends Omit<
    ProjectThumbnailType,
    "technologies" | "type" | "date" | "images" | "descriptions" | "links"
  > {
  onClick?: () => void;
}

export const ProjectThumbnail: React.FC<ProjectThumbnailProps> = ({
  imageSrc,
  name,
  shortDescription,
  color,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const t = useScopedI18n("projects.thumbnail");

  return (
    <motion.div
      className="flex flex-col items-center gap-2 p-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick?.()}
      initial={{ scale: 1, opacity: 1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", bounce: 0 }}
      role="button"
    >
      <motion.div
        className="relative aspect-[3/5] w-full cursor-pointer rounded-lg border-2"
        animate={{
          borderColor: isHovered ? color : `${color}00`,
        }}
        transition={{ duration: 0.3 }}
      >
        <Image
          src={imageSrc}
          alt={name}
          layout="fill"
          className="rounded-lg object-cover"
        />
      </motion.div>
      <div className="relative flex w-full flex-col">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: isHovered ? 0 : 1 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <h2 className="mt-2 w-full text-left text-sm font-medium uppercase text-neutral-500">
              {name}
            </h2>
            <p className="w-full text-left text-xl text-neutral-100">
              {shortDescription}
            </p>
          </motion.div>
          {isHovered && (
            <motion.div
              className="absolute inset-0 flex items-start justify-start"
              key="viewMore"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <motion.button className="mt-4 w-full rounded-lg bg-neutral-700 px-4 py-2 text-lg font-bold text-neutral-300 transition-colors hover:bg-neutral-600">
                {t("viewMore")}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
