import Image from "next/image";
import Link from "next/link";
import styles from "./ProjectCard.module.scss";

export const ProjectCard = ({
  title,
  service,
  cover,
  url,
}: {
  title: string;
  service: string | number;
  cover: string;
  url: string;
}) => {
  return (
    <Link href={url} className={styles.projectCard}>
      <div className={styles.imageContainer}>
        <Image
          fill
          alt=""
          loading="lazy"
          className={styles.image}
          src={cover}
        />
        <div className={styles.imageOverlay} />
      </div>
      <div className={styles.projectDetails}>
        <div className={styles.projectTitle}>{title}</div>
        <div className={styles.projectService}>{service}</div>
      </div>
      <div className={styles.seeProject}>
        <div className={styles.label}>See Project</div>
      </div>
    </Link>
  );
};
