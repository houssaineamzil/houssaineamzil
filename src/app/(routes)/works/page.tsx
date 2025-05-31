import { WorkCard } from "@/components/shared/cards/workCard";
import styles from "@/styles/page/works.module.css";
import type { CardType } from "@/types";
import type { NextPage } from "next";

const getCards = async (): Promise<CardType[]> => {
  const res = (await import("../../../data/works.json")).default
    .cards as CardType[];

  return res;
};

const Page: NextPage = async () => {
  const works = await getCards();

  return (
    <main className={styles.main}>
      {works.map((work, index) => {
        return <WorkCard key={index} {...work} className={styles.card} />;
      })}
    </main>
  );
};

export default Page;
