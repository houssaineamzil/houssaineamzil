import { MoreProjects } from "@/components/moreProjects";
import { Button } from "@/components/shared/button";
import { Image } from "@/components/shared/image";
import { Link } from "@/components/shared/link";
import styles from "@/styles/page/case.module.css";
import type { NextPage } from "next";

import data from "@/data/home.json";
import { Fragment } from "react";

const services = [
  {
    title: "Services",
    itmes: [
      { label: "Art Direction", url: null },
      { label: "Web Development", url: null },
    ],
  },
  {
    title: "Client",
    itmes: [
      { label: "Høussaine Amzil", url: "https://houssaineamzil.vercel.app/" },
      { label: "Khalid Baddou", url: null },
    ],
  },
  {
    title: "Year",
    itmes: [{ label: "2025", url: null }],
  },
  {
    title: "Design",
    itmes: [
      { label: "Høussaine Amzil", url: "https://houssaineamzil.vercel.app/" },
      { label: "Malik Hammadi", url: null },
    ],
  },
  {
    title: "Motion",
    itmes: [{ label: "Yasmin Jaafar", url: null }],
  },
  {
    title: "Development",
    itmes: [
      { label: "Høussaine Amzil", url: "https://houssaineamzil.vercel.app/" },
      { label: "Ahmed Taib", url: null },
      { label: "Mostapha Touhami", url: null },
    ],
  },
  {
    title: "Awards",
    itmes: [
      { label: "Awwwards SOTD", url: null },
      { label: "CSS Site of the Day", url: null },
    ],
  },
];

const live = true;

const Page: NextPage = () => {
  const projects = data.cards.filter((card) => card._type === "work");

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.images}>
          {Array(8)
            .fill(null)
            .map((image, index) => (
              <div key={index} className={styles.image}>
                <Image
                  alt=""
                  src="https://framerusercontent.com/images/TDVqw1tqR6Xs2CRjqnICnaPpH1o.jpg"
                />
              </div>
            ))}
        </div>

        <div className={styles.infoWrapper}>
          <div className={styles.head}>
            <div className={styles.title}>houssaineamzil</div>
            {live && (
              <Button link href="/" target="_blank">
                View live site
              </Button>
            )}
          </div>
          <div className={styles.info}>
            <div className={styles.description}>
              <div className={styles.descriptionTitle}>Info</div>
              <div className={styles.descriptionContent}>
                The Essence of Modern Minimalism. Designed specifically for
                portfolios and design studios, this Framer template is a
                testament to the power of simplicity. Studio B stands out with
                its clean lines, elegant whitespace, and thoughtful layout.
              </div>
            </div>

            {services.map((service) => {
              return (
                <div key={service.title} className={styles.section}>
                  <div className={styles.sectionTitle}>{service.title}</div>
                  <div className={styles.sectionContent}>
                    {service.itmes.map((item) => (
                      <Fragment key={item.label}>
                        {item.url ? (
                          <Link href={item.url}>{item.label}</Link>
                        ) : (
                          <div>{item.label}</div>
                        )}
                      </Fragment>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <MoreProjects projects={projects} />
    </main>
  );
};

export default Page;
