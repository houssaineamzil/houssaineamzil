import styles from "@/styles/components/moreProjects.module.css";
import type { CardType } from "@/types";
import { Button } from "./shared/button";
import { WorkCard } from "./shared/cards/workCard";

interface Props {
  projects: CardType[];
}

export const MoreProjects: React.FC<Props> = ({ projects }) => {
  return (
    <div className={styles.root}>
      <div className={styles.head}>
        <div className={styles.title}>More Projects</div>
        <Button link href="/works" className={styles.button}>
          View All
        </Button>
      </div>
      <div className={styles.projects}>
        {projects.map((project) => (
          <WorkCard
            key={project.id}
            {...project}
            _variant="medium"
            className={styles.card}
          />
        ))}
      </div>
    </div>
  );
};
