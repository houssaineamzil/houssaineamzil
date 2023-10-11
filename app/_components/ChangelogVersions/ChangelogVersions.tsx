import Link from "next/link";
import styles from "./ChangelogVersions.module.scss";

const versions = [
  {
    number: "1.0",
    description: "Initial Release",
  },
];

export const ChangelogVersions = () => {
  return (
    <div className={styles.changelogVersions}>
      {versions.map((version) => {
        return (
          <div key={version.number} className={styles.version}>
            <h4 className={styles.versionNumber}>Version {version.number}</h4>
            <div className={styles.versionDescription}>
              {version.description}
            </div>
          </div>
        );
      })}
    </div>
  );
};
