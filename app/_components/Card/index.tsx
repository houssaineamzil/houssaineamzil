import { PropsWithChildren, PropsWithoutRef, ReactNode } from "react";
import cn from "classnames";
import styles from "./styles.module.scss";
import Image from "next/image";

interface Props {
  children: ReactNode;
  size?: "big" | "tall" | "wide";
  image?: {
    src: string;
    alt?: string;
  };
  className?: any;
}

export const Card = ({
  children,
  size,
  image,
  className,
  ...restprops
}: any) => {
  return (
    <div className={cn(styles.item, size && styles[size])} {...restprops}>
      {image && (
        <Image
          fill
          loading="lazy"
          src={image.src}
          alt={image.alt ?? ""}
          className={styles.image}
          sizes="(max-width: 479px) 93vw, (max-width: 767px) 96vw, (max-width: 991px) 64vw, 62vw"
        />
      )}
      <div className={cn(styles.contentWrap, className)}>{children}</div>
    </div>
  );
};
