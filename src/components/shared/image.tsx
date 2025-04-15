import styles from "@/styles/shared/image.module.css";
import { cn } from "@/utils";
import NextImage from "next/image";

interface Props extends React.ComponentProps<typeof NextImage> {
  className?: string;
}

export const Image: React.FC<Props> = ({ className, ...props }) => {
  return (
    <div className={cn(styles.root)}>
      <NextImage
        fill
        {...props}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className={className}
      />
    </div>
  );
};
