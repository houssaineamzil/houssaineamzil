import { Card } from "_components/Card";
import cn from "classnames";
import styles from "./styles.module.scss";

export const Bio = () => {
  return (
    <Card size="wide" className={cn(styles.container)}>
      <p className={cn(styles.about)}>
        <span className={cn(styles.indentation)}>
          Hi! I’m Høussaine Amzil, a Creative Developer from Morocco. I’m
          currently pursuing a Bachelor’s degree in audiovisual and
          communication at the University of Ibn Tofail. I’m interested in
          NextJs, NodeJs, Product Design, Startups, Cars, and Music.
        </span>
      </p>
    </Card>
  );
};
