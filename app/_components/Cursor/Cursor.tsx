import styles from "./Cursor.module.scss";

export const Cursor = ({ text = "Open" }: { text?: string }) => {
  return (
    <div className={styles.cursor}>
      <div className={styles.dot1}>
        <div className={styles.text}>{text}</div>
      </div>
      <div className={styles.dot2} />
    </div>
  );
};
