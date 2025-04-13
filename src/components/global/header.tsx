"use client";

import styles from "@/styles/global/header.module.css";
import NextLink from "next/link";
import { Button } from "../shared/button";
import { Link } from "../shared/link";
import { RichText } from "../shared/richText";

export const Header: React.FC = () => {
  return (
    <div className={styles.root}>
      <nav className={styles.nav}>
        <div className={styles.container}>
          <NextLink className={styles.logoWrapper} href="/">
            <RichText className={styles.logo}>houssaineamzil</RichText>
          </NextLink>
          <div className={styles.linkContainer}>
            <div className={styles.linkWrapper}>
              <Link href="/works" className={styles.link}>
                Projects
              </Link>
              <Link href="/about" className={styles.link}>
                About
              </Link>
            </div>
            <div className={styles.ctaWrapper}>
              <Button
                link
                href="https://www.linkedin.com/in/houssaineamzil"
                target="_blank"
              >
                Get in touch
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};
