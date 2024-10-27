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
        animate={{ opacity: 1 }}
        className="text-xl font-medium uppercase text-neutral-500"
        exit={{ opacity: 0 }}
        initial={{ opacity: 0 }}
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
        animate={{ opacity: 1 }}
        className="w-fit rounded-lg px-2 py-1 text-base font-bold"
        exit={{ opacity: 0 }}
        initial={{ opacity: 0 }}
        style={{ backgroundColor: project.color, color: contrastedColor }}
        transition={{ delay: 0.3 }}
      >
        {translatedTypes[project.type]}
      </motion.div>

      <motion.hr
        animate={{ opacity: 1, scaleX: 1 }}
        className="my-4 w-full border-neutral-600/50"
        exit={{ opacity: 0, scaleX: 0 }}
        initial={{ opacity: 0, scaleX: 0 }}
        transition={{ delay: 0.3 }}
      />

      <div className="flex flex-col gap-2">
        <motion.h3
          animate={{ opacity: 1 }}
          className="text-lg font-semibold uppercase"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          transition={{ delay: 0.3 }}
        >
          Technologies
        </motion.h3>
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech, index) => (
            <motion.span
              key={index}
              animate={{ opacity: 1, scaleX: 1 }}
              className="origin-left rounded-lg bg-neutral-700 px-2 py-1 text-xs text-neutral-200"
              exit={{ opacity: 0, scaleX: 0 }}
              initial={{ opacity: 0, scaleX: 0 }}
              transition={{ delay: index * 0.1 + 0.4 }}
            >
              {tech}
            </motion.span>
          ))}
        </div>
      </div>

      <motion.hr
        animate={{ opacity: 1, scaleX: 1 }}
        className="my-4 w-full border-neutral-600/50"
        exit={{ opacity: 0, scaleX: 0 }}
        initial={{ opacity: 0, scaleX: 0 }}
        transition={{ delay: 0.6 }}
      />

      {project.links && project.links.length > 0 && (
        <div className="flex flex-wrap gap-6">
          <motion.h3
            animate={{ opacity: 1 }}
            className="mr-4 text-lg font-semibold uppercase"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            transition={{ delay: 0.6 }}
          >
            Links
          </motion.h3>
          {project.links.map((link, index) => (
            <motion.a
              key={index}
              animate={{
                scale: 1,
                opacity: 1,
                transition: { delay: index * 0.1 + 0.7 },
              }}
              className="flex w-fit items-center rounded-lg py-1 text-sm text-white hover:text-neutral-400"
              exit={{ scale: 0.8, opacity: 0 }}
              href={link.href}
              initial={{ scale: 0.8, opacity: 0, color: "#fff" }}
              rel="noopener noreferrer"
              target="_blank"
              whileHover={{ color: project.color, transition: { delay: 0 } }}
              whileTap={{ scale: 1.2, transition: { delay: 0 } }}
            >
              {link.label}
              <Link className="ml-2 size-3" />
            </motion.a>
          ))}
        </div>
      )}

      <motion.hr
        animate={{ opacity: 1, scaleX: 1 }}
        className="my-4 w-full border-neutral-600/50"
        exit={{ opacity: 0, scaleX: 0 }}
        initial={{ opacity: 0, scaleX: 0 }}
        transition={{ delay: 0.9 }}
      />

      <div className="flex flex-col gap-3">
        <motion.h3
          animate={{ opacity: 1 }}
          className="text-lg font-semibold uppercase"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          transition={{ delay: 0.9 }}
        >
          Description
        </motion.h3>
        <AnimatePresence>
          {project.descriptions.map((description, index) => (
            <motion.p
              key={index}
              animate={{ opacity: 1 }}
              className="text-sm"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
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
