import fs from "fs/promises";
import { join } from "path";
import { getProject } from "./getProject";

const projectsDirectory = join(process.cwd(), "app/_projects");

export const getAllProjects = async (limit: null | number = null) => {
  const slugs = await fs.readdir(projectsDirectory);

  const projects = await Promise.all(
    slugs.map(async (slug) => {
      return await getProject(slug);
    }),
  );

  // sort projects by date in descending order
  projects.sort((project1, project2) =>
    project1.info.year > project2.info.year ? -1 : 1,
  );

  if (limit !== null) return projects.slice(0, limit);

  return projects;
};
