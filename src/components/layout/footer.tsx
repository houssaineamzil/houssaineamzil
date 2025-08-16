"use client"

import { useEffect, useState } from "react"
import { Link } from "@/components/shared/link"
import { RichText } from "@/components/shared/richText"
import { getAboutData } from "@/lib/data"
import styles from "@/styles/layout/footer.module.css"

export const Footer: React.FC = () => {
  const [time, setTime] = useState(new Date())
  const [data, setData] = useState<{
    location: string
    socials: {
      key: string
      name: string
      url: string
    }[]
  }>({
    location: "",
    socials: []
  })

  useEffect(() => {
    getAboutData().then((data) => setData(data))
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 10)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <footer className={styles.root}>
      <div className={styles.container}>
        <div className={styles.top}>
          <RichText>{data.location}</RichText>
          <RichText>
            {time.toLocaleString("en-US", {
              timeZone: "Africa/Casablanca",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit"
            })}
          </RichText>
        </div>
        <div className={styles.center}>
          <canvas
            width={1300}
            height={420}
          />
        </div>
        <div className={styles.bottom}>
          <div className={styles.linkWrapper}>
            {data.socials.map(({ key, name, url }) => {
              return (
                <Link
                  key={key}
                  href={url}
                  target="_blank"
                  className={styles.link}
                >
                  {name}
                </Link>
              )
            })}
          </div>
          <div className={styles.copyright}>
            <RichText>© houssaineamzil {time.getFullYear()}</RichText>
          </div>
        </div>
      </div>
    </footer>
  )
}
