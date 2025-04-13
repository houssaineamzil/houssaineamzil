import { Button } from "@/components/shared/button";
import { Image } from "@/components/shared/image";
import styles from "@/styles/page/about.module.css";
import type { NextPage } from "next";

const services = [
  "Brand Identity",
  "Motion design",
  "Web design",
  "Copywriting",
  "Strategy",
  "Development",
];

const clients = [
  {
    name: "Google",
    logo: "https://framerusercontent.com/images/HbDPrY63HxnPooLcXp2DPJOKXd0.svg",
  },
  {
    name: "Google",
    logo: "https://framerusercontent.com/images/HbDPrY63HxnPooLcXp2DPJOKXd0.svg",
  },
  {
    name: "Google",
    logo: "https://framerusercontent.com/images/HbDPrY63HxnPooLcXp2DPJOKXd0.svg",
  },
  {
    name: "Google",
    logo: "https://framerusercontent.com/images/HbDPrY63HxnPooLcXp2DPJOKXd0.svg",
  },
  {
    name: "Google",
    logo: "https://framerusercontent.com/images/HbDPrY63HxnPooLcXp2DPJOKXd0.svg",
  },
  {
    name: "Google",
    logo: "https://framerusercontent.com/images/HbDPrY63HxnPooLcXp2DPJOKXd0.svg",
  },
];

const industries = [
  "Arts",
  "Culture",
  "Music",
  "Tech",
  "Fashion",
  "E-Commerce",
  "Hospitality",
  "Health",
  "Auto",
];

const Page: NextPage = () => {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.image}>
            <Image
              alt=""
              src="https://framerusercontent.com/images/TDVqw1tqR6Xs2CRjqnICnaPpH1o.jpg"
            />
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.info}>
            <div className={styles.bio}>
              <div className={styles.bioTitle}>Info</div>
              <div className={styles.bioContent}>
                The Essence of Modern Minimalism. Designed specifically for
                portfolios and design studios, this Framer template is a
                testament to the power of simplicity. Studio B stands out with
                its clean lines, elegant whitespace, and thoughtful layout.
              </div>
            </div>

            <div className={styles.section}>
              <div className={styles.sectionTitle}>Services</div>
              <div className={styles.sectionContent}>
                {services.map((service) => (
                  <div key={service}>{service}</div>
                ))}
              </div>
            </div>

            <div className={styles.section}>
              <div className={styles.sectionTitle}>Clients</div>
              <div className={styles.sectionContent}>
                <div className={styles.clients}>
                  {clients.map((client) => (
                    <div key={client.name} className={styles.clientCard}>
                      <img
                        decoding="async"
                        sizes="calc((max(min(292px, 100vw), 0px) - 40px) / 2)"
                        src={client.logo}
                        alt=""
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.section}>
              <div className={styles.sectionTitle}>Industries</div>
              <div className={styles.sectionContent}>
                <div className={styles.industries}>
                  {industries.map((industry) => (
                    <div key={industry}>{industry}</div>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.section}>
              <div className={styles.sectionTitle}>Get in touch</div>
              <div className={styles.sectionContent}>
                <h3 className={styles.contactTitle}>
                  Lets start a conversation.
                </h3>
                <p className={styles.contactContent}>
                  We believe that the best outcomes emerge as we become an
                  essential part of your team; let&apos;s discuss your project
                  today.
                </p>
                <Button
                  dot={false}
                  link
                  href="mailto:houssaineamzil18@gmail.com"
                >
                  Reach Out
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Page;
