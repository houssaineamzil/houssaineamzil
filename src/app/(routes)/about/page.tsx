import { Image } from "@/components/shared/image";
import styles from "@/styles/page/about.module.css";
import type { NextPage } from "next";

interface Data {
  name: string;
  bio: string;
  location: string;
  email: string;
  phone: string;
  website: string;
  tagline: string;
  image: {
    _type: string;
    alt: string;
    url: string;
  };
  studio: {
    name: string;
    logo?: {
      _type: string;
      alt: string;
      url: string;
    };
    website: string;
  };
  clients: {
    name: string;
    logo?: string;
  }[];
  industries: string[];
  services: string[];
  socials: {
    name: string;
    link: string;
  }[];
}

const getData = async (): Promise<Data> => {
  const res = (await import("../../../data/about.json")).default as Data;

  return res;
};

const Page: NextPage = async () => {
  const data = await getData();

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
                <div className={styles.clients}>
                  {data.clients.map((client) => (
                    <div key={client.name} className={styles.clientCard}>
                      <span className={styles.clientLogo}>{client.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Page;
