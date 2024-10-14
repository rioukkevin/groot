import { useScopedI18n } from "@/lib/locales/client";
import { ProjectType } from "./data";

export const useProjectTypeTranslations = () => {
  const t = useScopedI18n("projects.types");
  return Object.fromEntries(
    Object.values(ProjectType).map((type) => [type, t(type)]),
  ) as Record<ProjectType, string>;
};
