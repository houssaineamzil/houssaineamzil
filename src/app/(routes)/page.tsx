import type { NextPage } from "next"
import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"
import { AboutCard } from "@/components/shared/cards/aboutCard"
import { ClientsCard } from "@/components/shared/cards/clientsCard"
import { GeoCard } from "@/components/shared/cards/geoCard"
import { PlayerCard } from "@/components/shared/cards/playerCard"
import { ServicesCard } from "@/components/shared/cards/servicesCard"
import { WorkCard } from "@/components/shared/cards/workCard"
import { getHomeData } from "@/lib/data"
import styles from "@/styles/page/home.module.css"

const cardTypes = {
  about: AboutCard,
  clients: ClientsCard,
  services: ServicesCard,
  project: WorkCard,
  geo: GeoCard,
  player: PlayerCard
}

const Page: NextPage = async () => {
  const data = await getHomeData()

  return (
    <>
      <Header />
      <main className={styles.main}>
        {data.cards.map((card) => {
          const Card = cardTypes[card.type]
          return (
            <Card
              {...card}
              key={card.key}
              className={styles.card}
            />
          )
        })}
      </main>
      <Footer />
    </>
  )
}

export default Page
