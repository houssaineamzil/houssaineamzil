import cn from "classnames";
import { Card } from "@/components/Card";
import styles from "./styles.module.scss";

export const Bio = () => {
  return (
    <Card size="wide" className={cn(styles.container)}>
      <p className={cn(styles.about)}>
        <span className={cn(styles.indentation)}>
          Høussaine Amzil is a creative developer who designs and builds
          interactive, motion-driven interfaces at the intersection of design
          and engineering. Guided by rhythm, detail, and feel, he shapes minimal
          yet expressive experiences where every interaction is intentional. He
          currently brings this craft to Onclusive.
        </span>
      </p>
    </Card>
  );
};
