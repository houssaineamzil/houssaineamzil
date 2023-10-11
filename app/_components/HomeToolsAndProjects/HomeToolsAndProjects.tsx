import { getAllProjects } from "_utils/getAllProjects";
import Link from "next/link";
import styles from "./HomeToolsAndProjects.module.scss";

const tools = [
  "Figma",
  "Adobe Illustrator",
  "Adobe Photoshop",
  "Framer",
  "WebFlow",
  "Adobe InDesign",
];

export const HomeToolsAndProjects = async () => {
  const projects = await getAllProjects(3);

  return (
    <div className={styles.homeToolsAndProjects}>
      <div className={styles.homeTools}>
        <div className={styles.header}>
          <h6 className={styles.title}>Tools</h6>
          <div className={styles.dot}>
            <svg
              fill="none"
              viewBox="0 0 16 16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="8.5" cy="8.5" r="2.5" fill="currentColor" />
            </svg>
          </div>
        </div>
        <div className={styles.tools}>
          {tools.map((tool) => {
            return (
              <div key={tool} className={styles.tool}>
                {tool}
              </div>
            );
          })}
        </div>
      </div>
      <div className={styles.homeProjects}>
        <div className={styles.header}>
          <h6 className={styles.title}>Projects</h6>
          <div className={styles.dot}>
            <svg
              fill="none"
              viewBox="0 0 16 16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="8.5" cy="8.5" r="2.5" fill="currentColor" />
            </svg>
          </div>
        </div>
        <div className={styles.projects}>
          {projects.map((project) => {
            return (
              <Link
                href={project.url}
                key={project.title}
                className={styles.project}
              >
                <div className={styles.year}>{project.info.year}</div>
                <h4 className={styles.title}>{project.title}</h4>
                <div className={styles.arrow}>
                  <svg
                    fill="none"
                    viewBox="0 0 38 38"
                    className={styles.arrowIcon}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M11.875 7.125V9.5H26.8256L7.125 29.2006L8.79938 30.875L28.5 11.1744V26.125H30.875V7.125H11.875Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>
        <Link href="/archive" className={styles.link}>
          Explore the archive
          <svg
            fill="none"
            viewBox="0 0 12 12"
            className={styles.arrow}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0.564163 0L12 0V11.4358H10.4043V2.72402L1.12833 12L0 10.8716L9.27594 1.5957L0.564163 1.5957L0.564163 0Z"
              fill="currentColor"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
};
