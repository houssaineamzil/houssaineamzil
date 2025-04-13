import { AboutCard } from "@/components/shared/cards/aboutCard";
import { ClientsCard } from "@/components/shared/cards/clientsCard";
import { GeoCard } from "@/components/shared/cards/geoCard";
import { PlayerCard } from "@/components/shared/cards/playerCard";
import { ServicesCard } from "@/components/shared/cards/servicesCard";
import { WorkCard } from "@/components/shared/cards/workCard";
import styles from "@/styles/page/home.module.css";
import type { CardType } from "@/types";
import type { NextPage } from "next";

const getCards = async (): Promise<CardType[]> => {
  const res = (await import("../../data/home.json")).default
    .cards as CardType[];

  return res;
};

const cardTypes = {
  about: AboutCard,
  clients: ClientsCard,
  services: ServicesCard,
  work: WorkCard,
  geo: GeoCard,
  player: PlayerCard,
};

const Page: NextPage = async () => {
  const cards = await getCards();

  return (
    <main className={styles.main}>
      {cards.map((card, index) => {
        const Card = cardTypes[card._type];
        return <Card key={index} {...card} className={styles.card} />;
      })}
    </main>
  );
};

export default Page;
