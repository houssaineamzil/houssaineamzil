import type { NextPage } from "next"
import { notFound } from "next/navigation"
import { Fragment } from "react"
import type { Asset } from "sanity"
import { Auth } from "@/components/layout/auth"
import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/shared/button"
import { Image } from "@/components/shared/image"
import { Link } from "@/components/shared/link"
import { Parallax } from "@/components/shared/parallax"
import { getProjectData, getProjectsData } from "@/lib/data"
import { assetUrl } from "@/sanity/lib/assets"
import { urlFor } from "@/sanity/lib/image"
import styles from "@/styles/page/case.module.css"
import type { WorkData } from "@/types"
import { cn } from "@/utils"

export async function generateStaticParams() {
  const works = (await getProjectsData()) as WorkData[]

  return works.map((work) => ({
    slug: work.slug
  }))
}

const Page: NextPage<{
  params: Promise<{ slug: string }>
}> = async ({ params }) => {
  const { slug } = await params
  const data = (await getProjectData(slug)) as WorkData

  if (!data) {
    notFound()
  }

  return (
    <Auth
      slug={slug}
      isProtected={data.isProtected}
    >
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.medias}>
            {data.sections.map((section) => {
              return section.type === "image" ? (
                <div
                  key={section.key}
                  className={styles.media}
                >
                  <Parallax>
                    <Image
                      alt=""
                      src={urlFor(section?.asset as Asset).url()}
                    />
                  </Parallax>
                </div>
              ) : section.type === "video" ? (
                <div
                  key={section.key}
                  className={styles.media}
                >
                  <Parallax>
                    <video
                      autoPlay
                      loop
                      muted
                      src={assetUrl(section.asset as Asset)}
                    />
                  </Parallax>
                </div>
              ) : section.type === "images" ? (
                <div
                  key={section.key}
                  className="flex gap-3"
                >
                  {section.leftImage && (
                    <div className={cn(styles.media, styles.left)}>
                      <Parallax>
                        <Image
                          alt=""
                          src={urlFor(section.leftImage as Asset).url()}
                        />
                      </Parallax>
                    </div>
                  )}
                  {section.rightImage && (
                    <div className={cn(styles.media, styles.right)}>
                      <Parallax>
                        <Image
                          alt=""
                          src={urlFor(section.rightImage as Asset).url()}
                        />
                      </Parallax>
                    </div>
                  )}
                </div>
              ) : section.type === "textBlock" ? (
                <div
                  key={section.key}
                  className={styles.textBlock}
                >
                  <div className={styles.textBlockContent}>
                    {section.content}
                  </div>
                </div>
              ) : null
            })}
          </div>

          <div className={styles.infoWrapper}>
            <div className={styles.head}>
              <div className={styles.title}>{data.title}</div>
              {data.live && (
                <Button
                  link
                  href={data.live}
                  target="_blank"
                >
                  View live site
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

              {data.services && (
                <div
                  key="services"
                  className={styles.section}
                >
                  <div className={styles.sectionTitle}>Services</div>
                  <div className={styles.sectionContent}>
                    {data.services.map((service) => (
                      <div key={service}>{service}</div>
                    ))}
                  </div>
                </div>
              )}

              {data.client && (
                <div
                  key="client"
                  className={styles.section}
                >
                  <div className={styles.sectionTitle}>Client</div>
                  <div className={styles.sectionContent}>
                    {data.client?.url ? (
                      <Link
                        href={data.client.url}
                        external
                      >
                        {data.client.name}
                      </Link>
                    ) : (
                      <div>{data.client.name}</div>
                    )}
                  </div>
                </div>
              )}

              <div
                key="year"
                className={styles.section}
              >
                <div className={styles.sectionTitle}>Year</div>
                <div className={styles.sectionContent}>
                  <div>{data.year}</div>
                </div>
              </div>

              {data.design && (
                <div
                  key="design"
                  className={styles.section}
                >
                  <div className={styles.sectionTitle}>Design</div>
                  <div className={styles.sectionContent}>
                    {data.design.map(
                      (designer) =>
                        designer && (
                          <Fragment key={designer.name}>
                            {designer?.url ? (
                              <Link
                                href={designer.url}
                                external
                              >
                                {designer.name}
                              </Link>
                            ) : (
                              <div>{designer.name}</div>
                            )}
                          </Fragment>
                        )
                    )}
                  </div>
                </div>
              )}

              {data.motion && (
                <div
                  key="motion"
                  className={styles.section}
                >
                  <div className={styles.sectionTitle}>Motion</div>
                  <div className={styles.sectionContent}>
                    {data.motion.map(
                      (designer) =>
                        designer && (
                          <Fragment key={designer.name}>
                            {designer?.url ? (
                              <Link
                                href={designer.url}
                                external
                              >
                                {designer.name}
                              </Link>
                            ) : (
                              <div>{designer.name}</div>
                            )}
                          </Fragment>
                        )
                    )}
                  </div>
                </div>
              )}

              {data.development && (
                <div
                  key="development"
                  className={styles.section}
                >
                  <div className={styles.sectionTitle}>Development</div>
                  <div className={styles.sectionContent}>
                    {data.development.map(
                      (developer) =>
                        developer && (
                          <Fragment key={developer.name}>
                            {developer?.url ? (
                              <Link
                                href={developer.url}
                                external
                              >
                                {developer.name}
                              </Link>
                            ) : (
                              <div>{developer.name}</div>
                            )}
                          </Fragment>
                        )
                    )}
                  </div>
                </div>
              )}

              {data.awards && (
                <div
                  key="awards"
                  className={styles.section}
                >
                  <div className={styles.sectionTitle}>Awards</div>
                  <div className={styles.sectionContent}>
                    {data.awards.map(
                      (award) =>
                        award && (
                          <Fragment key={award.name}>
                            {award?.url ? (
                              <Link
                                href={award.url}
                                external
                              >
                                {award.name}
                              </Link>
                            ) : (
                              <div>{award.name}</div>
                            )}
                          </Fragment>
                        )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </Auth>
  )
}

export default Page
