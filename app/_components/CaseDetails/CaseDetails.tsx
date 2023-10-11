import Link from "next/link";
import styles from "./CaseDetails.module.scss";
import React from "react";

interface CaseDetailsProps {
  details: {
    description_full: string;
    info: {
      [key: string]: string | number;
    };
    live_preview?: string | null;
    technologies?: [
      {
        name: string;
        url: string;
      },
    ];
  };
}

export const CaseDetails = ({ details }: CaseDetailsProps) => {
  return (
    <div className={styles.caseDetails}>
      <div className={styles.header}>
        <h2 className={styles.title}>Details</h2>
        <div className={styles.projectDescriptionWrapper}>
          <p className={styles.projectDescription}>
            <span className={styles.indentation}>
              {details.description_full}
            </span>
          </p>
        </div>
      </div>
      <div className={styles.info}>
        {Object.entries(details.info).map(([title, value]) => {
          return (
            <div key={title} className={styles.row}>
              <span className={styles.title}>{title}</span>
              <span className={styles.value}>{value}</span>
            </div>
          );
        })}
        {details.technologies && (
          <div className={styles.row}>
            <span className={styles.title}>Technologies</span>
            <span className={styles.value}>
              {details.technologies.map((technology, index) => {
                return (
                  <span key={technology.name}>
                    {index > 0 && ",  "}
                    <Link
                      target="_blank"
                      href={technology.url}
                      className={styles.link}
                    >
                      {technology.name}
                    </Link>
                  </span>
                );
              })}
            </span>
          </div>
        )}
        {details.live_preview && (
          <div className={styles.row}>
            <span className={styles.title}>Live Preview</span>
            <Link
              target="_blank"
              className={styles.link}
              href={details.live_preview}
            >
              Check Here
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
        )}
      </div>
    </div>
  );
};
