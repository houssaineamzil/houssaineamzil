import React from "react";
import styles from "./Footer.module.scss";
import Link from "next/link";

export const Footer = () => {
  return (
    <div className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.title}>Reach Out</div>
        <div className={styles.username}>houssaineamzil</div>
        <div className={styles.job}>Creative Developer & Designer</div>
      </div>
      <div className={styles.center}>
        <div className={styles.title}>Contact Info</div>
        <div className={styles.direct}>
          <div className={styles.title}>Direct</div>
          <div className={styles.links}>
            <Link
              className={styles.link}
              href="mailto:houssaineamzil18@gmail.com"
              target="_blank"
            >
              houssaineamzil18@gmail.com
            </Link>
            <Link
              className={styles.link}
              href="tel:+212 625 932 688"
              target="_blank"
            >
              +212 625 932 688
            </Link>
          </div>
        </div>
        <div className={styles.social}>
          <div className={styles.title}>Social</div>
          <div className={styles.links}>
            <Link
              className={styles.link}
              href="https://linkedin.com/in/houssaineamzil"
              target="_blank"
            >
              LinkedIn
            </Link>
            <Link
              className={styles.link}
              href="https://behance.net/houssaineamzil"
              target="_blank"
            >
              Bēhance
            </Link>
            <Link
              className={styles.link}
              href="https://dribbble.com/houssaineamzil"
              target="_blank"
            >
              Dribbble
            </Link>
            <Link
              className={styles.link}
              href="https://twitter.com/houssaineamzil"
              target="_blank"
            >
              Twitter (X)
            </Link>
            <Link
              className={styles.link}
              href="https://instagram.com/houssaineamzil18"
              target="_blank"
            >
              Instagram
            </Link>
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        <div className={styles.copyright}>© COPYRIGHT 2023</div>
        <div className={styles.links}>
          <Link className={styles.link} href="/changelog">
            Changelog
          </Link>
          <Link className={styles.link} href="/archive">
            Archive
          </Link>
        </div>
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
    </div>
  );
};
