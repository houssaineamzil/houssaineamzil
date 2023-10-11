import styles from "./CaseHero.module.scss";

export const CaseHero = ({ description }: { description: string }) => {
  return (
    <div className={styles.caseHero}>
      <div className={styles.title}>Case Study</div>
      <h1 className={styles.description}>{description}</h1>
    </div>
  );
};
