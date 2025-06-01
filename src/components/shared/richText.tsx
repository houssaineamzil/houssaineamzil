import styles from "@/styles/shared/richText.module.css";
import { cn } from "@/utils";
import type { HTMLElementType } from "react";

interface Props {
  className?: string;
  as?: HTMLElementType;
  inner?: boolean;
  children: React.ReactNode;
}

export const RichText: React.FC<Props> = ({
  className,
  as: Comp = "p",
  inner = false,
  children,
}) => {
  return inner ? (
    <div className={styles.wrapper}>
      <Comp className={cn(className)}>{children}</Comp>
    </div>
  ) : (
    <Comp className={cn(className)}>{children}</Comp>
  );
};
