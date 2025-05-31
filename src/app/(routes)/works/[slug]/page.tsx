// import { MoreProjects } from "@/components/moreProjects";
import { Button } from "@/components/shared/button";
import { Image } from "@/components/shared/image";
import { Link } from "@/components/shared/link";
import styles from "@/styles/page/case.module.css";
import type { NextPage } from "next";
import { Fragment } from "react";

interface WorkData {
  title: string;
  description: string;
  tag: string[];
  uid: string;
  variant: string;
  live?: {
    url: string;
    label?: string;
  };
  info: {
    title: string;
    items: {
      label: string;
      url?: string;
    }[];
  }[];
  sections: {
    type: string;
    images: {
      mobile?: {
        _type: string;
        alt: string;
        url: string;
      };
      desktop: {
        _type: string;
        alt: string;
        url: string;
      };
    };
  }[];
  related?: unknown;
}

const getData = async (): Promise<WorkData> => {
  const res = (await import("../../../../data/works/houssaineamzil.json"))
    .default as WorkData;

  return res;
};
const Page: NextPage = async () => {
  const data = await getData();

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.images}>
          {data.sections.map((section, index) => (
            <div key={index} className={styles.image}>
              <Image
                alt={section.images.desktop.alt || "Image"}
                src={section.images.desktop.url}
              />
            </div>
          ))}
        </div>

        <div className={styles.infoWrapper}>
          <div className={styles.head}>
            <div className={styles.title}>{data.title}</div>
            {data.live && (
              <Button link href={data.live.url} target="_blank">
                {data.live.label || "View live site"}
              </Button>
            )}
          </div>
          <div className={styles.info}>
            <div className={styles.description}>
              <div className={styles.descriptionTitle}>Info</div>
              <div className={styles.descriptionContent}>
                {data.description}
              </div>
            </div>

            {data.info.map((section) => {
              return (
                <div key={section.title} className={styles.section}>
                  <div className={styles.sectionTitle}>{section.title}</div>
                  <div className={styles.sectionContent}>
                    {section.items.map((item) => (
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
      {/* <MoreProjects projects={projects} /> */}
    </main>
  );
};

export default Page;
