import Image from "next/image";
import styles from "./CaseImages.module.scss";

export const CaseImages = ({ images }: { images: string[] }) => {
  return (
    <div className={styles.caseImages}>
      {images.map((image, index) => {
        return (
          <div key={index} className={styles.caseImageWrapper}>
            <div className={styles.caseImage}>
              <Image
                fill
                alt=""
                loading="lazy"
                className={styles.image}
                src={image}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
