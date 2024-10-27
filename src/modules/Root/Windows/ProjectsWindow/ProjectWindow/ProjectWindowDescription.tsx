import { AnimatePresence, motion } from "framer-motion";
import { Link } from "lucide-react";
import React from "react";

import { TextEffect } from "@/modules/TextEffect/TextEffect";

import { ProjectThumbnail } from "../data";
import { useProjectTypeTranslations } from "../useProjectTypeTranslation";



interface ProjectWindowDescriptionProps {
  project: ProjectThumbnail;
}

const getContrastedColor = (hexColor: string): string => {
  // Remove the hash if it's there
  const color =
    hexColor.charAt(0) === "#" ? hexColor.substring(1, 7) : hexColor;
  // Convert to RGB
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  // Return black or white depending on luminance
  return luminance > 0.5 ? "#1A1A1A" : "#F5F5F5";
};

const ProjectWindowDescription: React.FC<ProjectWindowDescriptionProps> = ({
  project,
}) => {
  const contrastedColor = getContrastedColor(project.color);
  const translatedTypes = useProjectTypeTranslations();

  return (
    <div className="flex w-full flex-col gap-2 pb-8">
      <motion.h2
        className="text-xl font-medium uppercase text-neutral-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {project.name}
      </motion.h2>
      <span className="text-3xl font-bold">
        <TextEffect per="word" preset="fade">
          {project.shortDescription}
        </TextEffect>
      </span>

      <div className="text-lg text-neutral-400">
        <TextEffect per="char" preset="fade">
          {new Date(
            project.date.year,
            project.date.month - 1,
          ).toLocaleDateString(undefined, { year: "numeric", month: "long" })}
        </TextEffect>
      </div>
      <motion.div
        className="w-fit rounded-lg px-2 py-1 text-base font-bold"
        style={{ backgroundColor: project.color, color: contrastedColor }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ delay: 0.3 }}
      >
        {translatedTypes[project.type]}
      </motion.div>

      <motion.hr
        className="my-4 w-full border-neutral-600/50"
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        exit={{ opacity: 0, scaleX: 0 }}
        transition={{ delay: 0.3 }}
      />

      <div className="flex flex-col gap-2">
        <motion.h3
          className="text-lg font-semibold uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.3 }}
        >
          Technologies
        </motion.h3>
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech, index) => (
            <motion.span
              key={index}
              className="origin-left rounded-lg bg-neutral-700 px-2 py-1 text-xs text-neutral-200"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              exit={{ opacity: 0, scaleX: 0 }}
              transition={{ delay: index * 0.1 + 0.4 }}
            >
              {tech}
            </motion.span>
          ))}
        </div>
      </div>

      <motion.hr
        className="my-4 w-full border-neutral-600/50"
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        exit={{ opacity: 0, scaleX: 0 }}
        transition={{ delay: 0.6 }}
      />

      {project.links && project.links.length > 0 && (
        <div className="flex flex-wrap gap-6">
          <motion.h3
            className="mr-4 text-lg font-semibold uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.6 }}
          >
            Links
          </motion.h3>
          {project.links.map((link, index) => (
            <motion.a
              key={index}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-fit items-center rounded-lg py-1 text-sm text-white hover:text-neutral-400"
              initial={{ scale: 0.8, opacity: 0, color: "#fff" }}
              animate={{
                scale: 1,
                opacity: 1,
                transition: { delay: index * 0.1 + 0.7 },
              }}
              whileTap={{ scale: 1.2, transition: { delay: 0 } }}
              whileHover={{ color: project.color, transition: { delay: 0 } }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              {link.label}
              <Link className="ml-2 size-3" />
            </motion.a>
          ))}
        </div>
      )}

      <motion.hr
        className="my-4 w-full border-neutral-600/50"
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        exit={{ opacity: 0, scaleX: 0 }}
        transition={{ delay: 0.9 }}
      />

      <div className="flex flex-col gap-3">
        <motion.h3
          className="text-lg font-semibold uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.9 }}
        >
          Description
        </motion.h3>
        <AnimatePresence>
          {project.descriptions.map((description, index) => (
            <motion.p
              key={index}
              className="text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: index * 0.2 + 1 }}
            >
              {description}
            </motion.p>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProjectWindowDescription;
