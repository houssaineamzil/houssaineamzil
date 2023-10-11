import styles from "./HomeTechAndExperiences.module.scss";

const experiences = [
  {
    position: "Graphic Designer",
    studio: "Nait Concept",
    period: "Aug 2023 - Sep 2023",
  },
  {
    position: "Intern Graphic Designer",
    studio: "Elite Creativity Print",
    period: "Mar 2023 - Apr 2023",
  },
  {
    position: "Intern Graphic Designer",
    studio: "Play Print",
    period: "Jun 2022 - Jul 2022",
  },
  {
    position: "Front End Developer",
    studio: "Freelance",
    period: "2020 - Currently",
  },
];

const technologies = [
  "React.js",
  "Next.js",
  "Firebase",
  "MongoDB",
  "Python",
  "PyGame",
  "Discord.py",
];

export const HomeTechAndExperiences = () => {
  return (
    <div className={styles.homeTechAndExperiences}>
      <div className={styles.homeTechnologies}>
        <div className={styles.header}>
          <h6 className={styles.title}>Technologies</h6>
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
        <div className={styles.technologies}>
          {technologies.map((technology) => {
            return (
              <div key={technology} className={styles.technology}>
                {technology}
              </div>
            );
          })}
        </div>
      </div>
      <div className={styles.homeExperiences}>
        <div className={styles.header}>
          <h6 className={styles.title}>Experiences</h6>
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
        <div className={styles.experiences}>
          {experiences.map((experience) => {
            return (
              <div key={experience.studio} className={styles.experience}>
                <div className={styles.details}>
                  <div className={styles.position}>{experience.position}</div>
                  <div className={styles.studio}>{experience.studio}</div>
                </div>
                <div className={styles.period}>{experience.period}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
