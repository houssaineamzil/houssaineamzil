import styles from "@/styles/shared/video.module.css"
import { cn } from "@/utils"

interface Props extends React.VideoHTMLAttributes<HTMLVideoElement> {
  className?: string
}

export const Video: React.FC<Props> = ({ className, ...props }) => {
  return (
    <div className={cn(styles.root)}>
      <video
        {...props}
        playsInline
        loop
        muted
        preload="auto"
        autoPlay
        className={className}
      />
    </div>
  )
}
