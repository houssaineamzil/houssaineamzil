import Link from "next/link";
import styles from "./ChangelogHero.module.scss";

export const ChangelogHero = () => {
  return (
    <div className={styles.changelogHero}>
      <div className={styles.github}>
        <Link
          target="_blank"
          className={styles.link}
          href="https://github.com/houssaineamzil/houssaineamzil/tree/v2"
        >
          Changelog
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
      <h3 className={styles.title}>
        Explore the updates and enhancements made since the initial release of
        this website.
      </h3>
    </div>
  );
};
