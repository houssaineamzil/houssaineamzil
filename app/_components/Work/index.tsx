"use client";

import { Card } from "_components/Card";
import styles from "./styles.module.scss";
import { useState } from "react";
import cn from "classnames";

interface Props {
  key?: string | number;
  bg?: string;
  image?: {
    src: string;
    alt?: string;
  };
  title: string;
  description: string;
  type: string;
  href: string;
  size?: "tall" | "wide" | "big";
  [key: string]: any;
}

export const CaseStudy = ({
  bg,
  image,
  title,
  // description,
  type,
  href,
  size,
  ...restProps
}: Props) => {
  const [active, setActive] = useState(false);

  return (
    <Card
      size={size}
      image={image}
      className={styles.container}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      {...restProps}
    >
      {/* <img src="images/recroot-bg.svg" />
				<img src="images/recroot.png" className="CaseStudy__Image-sc-1crojhk-2 GUaRk" /> */}
      <div className={styles.typeWrap}>
        <div className={styles.dot} />
        <div className={styles.type}>{type}</div>
      </div>
      <div className={styles.titleWrap}>
        <div className={styles.title}>{title}</div>
      </div>
      <div
        className={cn(styles.link, active && styles.active)}
        onMouseDown={() => href && window.open(href, "_blank")}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.8198 5.28849L5.28784 12.8205M7.53214 5.25049L12.8198 5.28749L12.8578 10.5752"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </Card>
  );
};
