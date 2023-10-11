import { getProject } from "_utils/getProject";
import type { ProjectTypes } from "_utils/types";
import { ProjectCard } from "../ProjectCard";
import styles from "./CaseRelated.module.scss";

export const CaseRelated = ({ related }: { related: string[] }) => {
  return (
    <div className={styles.caseRelated}>
      <div className={styles.header}>
        <div className={styles.title}>Case Study</div>
        <h1 className={styles.description}>
          Still a bit curious? Then feel free to take a look at some of the
          other projects I have done over the past few years.
        </h1>
      </div>
      <div className={styles.related}>
        {related.map(async (project: any) => {
          const projectData: ProjectTypes = await getProject(project);

          return (
            <ProjectCard
              title={projectData.title}
              service={projectData.info.service}
              cover={projectData.cover}
              url={projectData.url}
              key={projectData.title}
            />
          );
        })}
      </div>
    </div>
  );
};
