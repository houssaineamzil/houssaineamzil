import Image from "next/image";
import Link from "next/link";
import styles from "./HomeAbout.module.scss";

export const HomeAbout = () => {
  return (
    <div className={styles.homeAbout}>
      <div className={styles.images}>
        <div className={styles.image1}>
          <Image
            fill
            alt=""
            loading="lazy"
            className={styles.image}
            src="/assets/images/photo.jpeg"
          />
        </div>
        <div className={styles.image2}>
          <Image
            fill
            alt=""
            loading="lazy"
            className={styles.image}
            src="/assets/images/photo1.jpeg"
          />
        </div>
      </div>
      <div className={styles.bio}>
        <div className={styles.bioImage}>
          <Image
            fill
            alt=""
            loading="lazy"
            className={styles.image}
            src="/assets/images/bioImage.jpeg"
          />
        </div>
        <h3 className={styles.title}>
          Hello! I&#39;m a creative developer & graphic designer on a mission to
          kickstart my professional journey.
        </h3>
        <div className={styles.wrapper}>
          <div className={styles.header}>
            <h6 className={styles.title}>Bio</h6>
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
          <div className={styles.date}>2023</div>
          <div className={styles.details}>
            <p className={styles.paragraph}>
              I aspire to collaborate with dynamic creative teams, breathing
              life into fresh ideas that aim to enhance the web for all.
              Together, we can reshape digital experiences and make the online
              world a better place.
            </p>
            <p className={styles.paragraph}>
              With a diverse background and a commitment to excellence, I strive
              to bring innovation and purpose to every project. Join me on this
              journey as we delve into my design philosophy, and explore the
              various stages of the creative process.
            </p>
            <Link
              target="_blank"
              href="/resume.pdf"
              className={styles.link}
              download="Høussaine Amzil - resume"
            >
              GET MY RESUME
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
      </div>
    </div>
  );
};
