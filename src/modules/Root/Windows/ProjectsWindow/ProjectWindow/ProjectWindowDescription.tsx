import React from "react";
import { ProjectThumbnail } from "../data";
import { Link } from "lucide-react";
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
    <div className="flex w-full flex-col gap-2">
      <h2 className="text-3xl font-bold">{project.name}</h2>
      <p className="text-xl">{project.shortDescription}</p>

      <div className="flex items-center gap-2">
        <span className="text-lg text-neutral-400">
          {new Date(
            project.date.year,
            project.date.month - 1,
          ).toLocaleDateString(undefined, { year: "numeric", month: "long" })}
        </span>
        <span
          className="rounded-lg px-2 py-1 text-base font-bold"
          style={{ backgroundColor: project.color, color: contrastedColor }}
        >
          {translatedTypes[project.type]}
        </span>
      </div>

      <hr className="my-4 w-full border-neutral-600/50" />

      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold">Technologies</h3>
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech, index) => (
            <span
              key={index}
              className="rounded-lg bg-neutral-600 px-2 py-1 text-xs text-neutral-200"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      <hr className="my-4 w-full border-neutral-600/50" />

      {project.links && project.links.length > 0 && (
        <div className="flex flex-col flex-wrap gap-2">
          {project.links.map((link, index) => (
            <a
              key={index}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-fit items-center rounded-lg py-1 text-sm text-white hover:text-neutral-400"
            >
              {link.label}
              <Link className="ml-2 size-3" />
            </a>
          ))}
        </div>
      )}

      <hr className="my-4 w-full border-neutral-600/50" />

      <div className="flex flex-col gap-2">
        {project.descriptions.map((description, index) => (
          <p key={index} className="text-sm">
            {description}
          </p>
        ))}
      </div>

      {/* <div className="h-[200vh] w-full bg-red-500/20"></div> */}
    </div>
  );
};

export default ProjectWindowDescription;
