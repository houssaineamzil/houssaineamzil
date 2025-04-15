"use client";

import { Link } from "@/components/shared/link";
import { RichText } from "@/components/shared/richText";
import styles from "@/styles/layout/footer.module.css";
import { useEffect, useState } from "react";

import data from "@/data/home.json";

export const Footer: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 10);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <footer className={styles.root}>
      <div className={styles.container}>
        <div className={styles.top}>
          <RichText>Kenitra, Morocco</RichText>
          <RichText>
            {time.toLocaleString("en-US", {
              timeZone: "Africa/Casablanca",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </RichText>
        </div>
        <div className={styles.center}>
          <canvas width={1300} height={420} />
        </div>
        <div className={styles.bottom}>
          <div className={styles.linkWrapper}>
            {data.socials.map(({ name, url }) => {
              return (
                <Link
                  key={name}
                  href={url}
                  target="_blank"
                  className={styles.link}
                >
                  {name}
                </Link>
              );
            })}
          </div>
          <div className={styles.copyright}>
            <RichText>© houssaineamzil {time.getFullYear()}</RichText>
          </div>
        </div>
      </div>
    </footer>
  );
};
