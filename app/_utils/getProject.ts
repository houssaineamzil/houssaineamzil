import fs from "fs/promises";
import { join } from "path";

const projectsDirectory = join(process.cwd(), "app/_projects");

export const getProject = async (slug: string) => {
  const realSlug = slug.replace(/\.json$/, "");
  const fullPath = join(projectsDirectory, `${realSlug}.json`);
  const data = await fs.readFile(fullPath, "utf-8");
  return JSON.parse(data);
};
