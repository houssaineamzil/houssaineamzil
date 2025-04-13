import styles from "@/styles/shared/image.module.css";
import { cn } from "@/utils";
import NextImage from "next/image";

interface Props extends React.ComponentProps<typeof NextImage> {
  className?: string;
}

export const Image: React.FC<Props> = ({ className, ...props }) => {
  return (
    <div className={cn(styles.root)}>
      <NextImage fill {...props} className={className} />
    </div>
  );
};
