import { getAllProjects } from "_utils/getAllProjects";
import type { ProjectTypes } from "_utils/types";
import { ProjectCard } from "../ProjectCard";
import styles from "./ArchiveProjects.module.scss";

export const ArchiveProjects = async () => {
  const projects: ProjectTypes[] = await getAllProjects();

  return (
    <div className={styles.archiveProjects}>
      {projects.map((project) => {
        return (
          <ProjectCard
            title={project.title}
            service={project.info.service}
            cover={project.cover}
            url={project.url}
            key={1}
          />
        );
      })}
    </div>
  );
};
