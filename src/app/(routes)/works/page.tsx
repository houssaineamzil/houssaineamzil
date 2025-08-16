import type { NextPage } from "next"
import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"
import { WorkCard } from "@/components/shared/cards/workCard"
import { getProjectsCardsData } from "@/lib/data"
import styles from "@/styles/page/works.module.css"

const Page: NextPage = async () => {
  const works = await getProjectsCardsData()

  return (
    <>
      <Header />
      <main className={styles.main}>
        {works.cards.map((work) => {
          return (
            <WorkCard
              {...work}
              key={work.key}
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
