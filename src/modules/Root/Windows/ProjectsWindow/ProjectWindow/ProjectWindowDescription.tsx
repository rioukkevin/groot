import React from "react";
import { ProjectThumbnail } from "../data";

interface ProjectWindowDescriptionProps {
  project: ProjectThumbnail;
}

const ProjectWindowDescription: React.FC<ProjectWindowDescriptionProps> = ({
  project,
}) => {
  return (
    <div className="flex w-full flex-col gap-4">
      <h2 className="text-2xl font-bold">{project.name}</h2>
      <p className="text-lg">{project.shortDescription}</p>

      <hr className="w-full border-neutral-600/50" />

      <div className="flex items-center gap-2">
        <span className="rounded-lg bg-neutral-600 px-2 py-1 text-xs text-neutral-200">
          {project.type}
        </span>
        <span className="text-sm text-neutral-400">
          {new Date(
            project.date.year,
            project.date.month - 1,
          ).toLocaleDateString(undefined, { year: "numeric", month: "long" })}
        </span>
      </div>

      <hr className="w-full border-neutral-600/50" />

      {project.links && project.links.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {project.links.map((link, index) => (
            <a
              key={index}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}

      <hr className="w-full border-neutral-600/50" />

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

      <hr className="w-full border-neutral-600/50" />

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
