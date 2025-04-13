import styles from "@/styles/shared/tag.module.css";
import { cn } from "@/utils";
import { forwardRef } from "react";
import { RichText } from "./richText";

interface Props {
  className?: string;
  tag: string[];
}

export const Tag = forwardRef<HTMLDivElement, Props>(function Tag(
  { tag, className },
  ref,
) {
  return (
    <div className={cn(styles.root, className)}>
      <div className={styles.container}>
        <div ref={ref} className={styles.wrapper}>
          {tag.map((tag, index) => (
            <RichText
              key={`${tag}_${index}`}
              as="span"
              className={styles.label}
            >
              {tag}
            </RichText>
          ))}
        </div>
      </div>
    </div>
  );
});
