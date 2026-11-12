import { DragScroll } from "@/components/dragScroll";
import { GalleryMinimap } from "@/components/galleryMinimap";
import { Image } from "@/components/image";
import { Link } from "@/components/link";
import { ProjectNavLink } from "@/components/projectNavLink";
import { Reveal } from "@/components/reveal";
import { type CollectionKind, collections } from "@/lib/collections";
import type { ProjectType } from "@/types";

export interface ProjectNeighbour {
  slug: string;
  name: string;
  imageUrl: string;
}

interface Props {
  kind: CollectionKind;
  project: ProjectType;
  prev: ProjectNeighbour;
  next: ProjectNeighbour;
  email: string;
}

const paragraphs = (text: string) => text.split(/\n\s*\n/).filter(Boolean);

export const ProjectDetail: React.FC<Props> = ({
  kind,
  project,
  prev,
  next,
  email,
}) => {
  const { publicPath, backLabel } = collections[kind];
  const sections = [
    { label: "Strategy", text: project.strategy },
    { label: "Result", text: project.result },
    { label: "Impact", text: project.impact },
  ].filter((section) => section.text.trim());
  const galleryImages = [project.image, ...(project.gallery ?? [])];

  return (
    <div className="w-full">
      <Reveal className="flex w-full flex-col justify-end gap-16 p-4 pt-28 md:fixed md:inset-y-0 md:left-0 md:w-[42%] md:overflow-y-auto md:p-4 md:pt-24">
        <div className="flex flex-col gap-10">
          <dl className="grid grid-cols-[auto_1fr] gap-x-10 gap-y-1 text-xs font-medium uppercase text-neutral-950">
            <dt data-reveal-item className="text-muted">
              Client
            </dt>
            <dd data-reveal-item>{project.name}</dd>

            <dt data-reveal-item className="text-muted">
              Year
            </dt>
            <dd data-reveal-item>{project.year}</dd>

            {project.projectType && (
              <>
                <dt data-reveal-item className="text-muted">
                  Type
                </dt>
                <dd data-reveal-item>{project.projectType}</dd>
              </>
            )}

            {project.role && (
              <>
                <dt data-reveal-item className="text-muted">
                  Role
                </dt>
                <dd data-reveal-item>{project.role}</dd>
              </>
            )}

            {project.designer && (
              <>
                <dt data-reveal-item className="text-muted">
                  Design
                </dt>
                <dd data-reveal-item>{project.designer}</dd>
              </>
            )}

            {project.developer && (
              <>
                <dt data-reveal-item className="text-muted">
                  Development
                </dt>
                <dd data-reveal-item>{project.developer}</dd>
              </>
            )}

            {project.url && (
              <>
                <dt data-reveal-item className="text-muted">
                  Link
                </dt>
                <dd data-reveal-item>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="normal-case underline underline-offset-2"
                  >
                    {project.url
                      .replace(/^https?:\/\/(www\.)?/, "")
                      .replace(/\/$/, "")}
                  </a>
                </dd>
              </>
            )}
          </dl>

          {/* The three case-study sections replace the description; it
              only shows for projects that don't have them (e.g. experiments). */}
          {sections.length === 0 && (
            <div className="flex max-w-md flex-col gap-2">
              {paragraphs(project.description).map((paragraph) => (
                <p
                  key={paragraph}
                  data-reveal-lines
                  className="text-sm leading-snug"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          )}

          {sections.length > 0 && (
            <div className="flex max-w-md flex-col gap-6">
              {sections.map(({ label, text }) => (
                <section key={label} className="flex flex-col gap-2">
                  <h2
                    data-reveal-item
                    className="text-muted flex items-center gap-2 text-[11px] font-medium uppercase"
                  >
                    <span aria-hidden className="size-2 bg-current" />
                    {label}
                  </h2>
                  {paragraphs(text).map((paragraph) => (
                    <p
                      key={paragraph}
                      data-reveal-lines
                      className="text-sm leading-snug"
                    >
                      {paragraph}
                    </p>
                  ))}
                </section>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6 text-xs">
          <Link
            data-reveal-item
            href={`mailto:${email}`}
            className="self-start text-base font-medium"
          >
            Let’s work together
          </Link>
          <div className="flex items-center justify-between font-medium uppercase text-neutral-950">
            <div data-reveal-item className="flex">
              <ProjectNavLink
                href={`${publicPath}/${prev.slug}`}
                label="Prev"
                name={prev.name}
                imageUrl={prev.imageUrl}
              />
            </div>
            <div data-reveal-item className="flex">
              <Link href={publicPath}>{backLabel}</Link>
            </div>
            <div data-reveal-item className="flex">
              <ProjectNavLink
                href={`${publicPath}/${next.slug}`}
                label="Next"
                name={next.name}
                imageUrl={next.imageUrl}
              />
            </div>
          </div>
        </div>
      </Reveal>

      <GalleryMinimap images={galleryImages} />

      <DragScroll className="flex w-full flex-col gap-2 p-4 md:pt-24 md:pl-[calc(42%+0.5rem)]">
        <div
          data-gallery-image={0}
          className="relative aspect-3/4 md:aspect-square w-full"
        >
          {project.image.url && (
            <Image
              fill
              parallax
              revealOnScroll
              src={project.image.url}
              alt={project.image.alt}
              sizes="(max-width: 768px) 100vw, 58vw"
            />
          )}
        </div>

        {project.gallery && (
          <div className="flex flex-col gap-2">
            {project.gallery.map((image, imageIndex) => (
              <div
                className="p-[6%] bg-neutral-200"
                key={image.url || String(imageIndex)}
              >
                <div
                  data-gallery-image={imageIndex + 1}
                  className="relative aspect-video w-full"
                >
                  {image.url && (
                    <Image
                      fill
                      parallax={false}
                      horizontal={false}
                      revealOnScroll
                      src={image.url}
                      alt={image.alt}
                      sizes="(max-width: 768px) 50vw, 29vw"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </DragScroll>
    </div>
  );
};
