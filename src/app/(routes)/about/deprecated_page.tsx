import type { NextPage } from "next"
import { Image } from "@/components/shared/image"
import { Marquee } from "@/components/shared/marquee"
import styles from "@/styles/page/about.module.css"

interface Data {
  name: string
  bio: string
  location: string
  email: string
  phone: string
  website: string
  tagline: string
  image: {
    _type: string
    alt: string
    url: string
  }
  studio: {
    name: string
    logo?: {
      _type: string
      alt: string
      url: string
    }
    website: string
  }
  clients: {
    name: string
    logo?: string
  }[]
  industries: string[]
  services: string[]
  socials: {
    name: string
    link: string
  }[]
}

const Page: NextPage = async () => {
  const data: Data = {
    name: "Houssaine Amzil",
    bio: "",
    location: "",
    email: "",
    phone: "",
    website: "",
    tagline: "",
    image: {
      _type: "image",
      alt: "",
      url: ""
    },
    studio: {
      name: "",
      logo: {
        _type: "image",
        alt: "",
        url: ""
      },
      website: ""
    },
    clients: [],
    industries: [],
    services: [],
    socials: []
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.image}>
            <Image
              alt={data.image.alt || "Studio Image"}
              src={data.image.url}
            />
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.info}>
            <div className={styles.bio}>
              <div className={styles.bioTitle}>Bio</div>
              <div className={styles.bioContent}>{data.bio}</div>
            </div>

            <div className={styles.section}>
              <div className={styles.sectionTitle}>Services</div>
              <div className={styles.sectionContent}>
                <div className={styles.services}>
                  {data.services.map((service) => (
                    <div key={service}>{service}</div>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.section}>
              <div className={styles.sectionTitle}>Industries</div>
              <div className={styles.sectionContent}>
                <div className={styles.industries}>
                  {data.industries.map((industry) => (
                    <div key={industry}>{industry}</div>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.section}>
              <div className={styles.sectionTitle}>Clients</div>
              <div className={styles.sectionContent}>
                <div className={styles.marquee}>
                  <Marquee>
                    <div className={styles.marqueeContent}>
                      {data.clients.map((client) => (
                        <span
                          key={client.name}
                          className={styles.clientLogo}
                        >
                          {client.name}
                        </span>
                      ))}
                    </div>
                  </Marquee>
                  <div className={styles.marqueeMask} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Page
