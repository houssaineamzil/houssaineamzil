import Link from "next/link";
import styles from "./ArchiveHero.module.scss";

export const ArchiveHero = () => {
  return (
    <div className={styles.archiveHero}>
      <div className={styles.contact}>
        <div className={styles.title}>Reach Out</div>
        <Link
          className={styles.link}
          href="mailto:houssaineamzil18@gmail.com"
          target="_blank"
        >
          houssaineamzil18@gmail.com
        </Link>
      </div>
      <h3 className={styles.title}>
        I DESIGN & DEVELOPE WEBSITES AND BUILD BRAND IDENTITIES
      </h3>
    </div>
  );
};
