import { DragScroll } from "@/components/dragScroll";
import { GalleryMinimap } from "@/components/galleryMinimap";
import { Image } from "@/components/image";
import { Link } from "@/components/link";
import { ProjectNavLink } from "@/components/projectNavLink";
import { Reveal } from "@/components/reveal";
import type { ProjectType } from "@/types";

export interface ProjectNeighbour {
  slug: string;
  name: string;
  imageUrl: string;
}

interface Props {
  project: ProjectType;
  prev: ProjectNeighbour;
  next: ProjectNeighbour;
  email: string;
}

export const ProjectDetail: React.FC<Props> = ({
  project,
  prev,
  next,
  email,
}) => {
  const galleryImages = [project.image, ...(project.gallery ?? [])];

  return (
    <div className="w-full">
      <Reveal className="flex w-full flex-col justify-end gap-16 p-4 pt-28 md:fixed md:inset-y-0 md:left-0 md:w-[42%] md:overflow-hidden md:p-4 md:pt-24">
        <div className="flex flex-col gap-10">
          <dl className="grid grid-cols-[auto_1fr] gap-x-10 gap-y-1 text-xs font-medium uppercase text-neutral-950">
            <dt data-reveal-item className="text-muted">
              Client
            </dt>
            <dd data-reveal-item>{project.name}</dd>

            {project.labels.length > 0 && (
              <>
                <dt data-reveal-item className="text-muted">
                  Mission
                </dt>
                <dd data-reveal-item>
                  {project.labels.slice(0, 2).join(", ")}
                </dd>
              </>
            )}

            <dt data-reveal-item className="text-muted">
              Year
            </dt>
            <dd data-reveal-item>{project.year}</dd>

            <dt data-reveal-item className="text-muted">
              Role
            </dt>
            <dd data-reveal-item>{project.role}</dd>
          </dl>

          <div className="flex max-w-md flex-col gap-2">
            {project.description.split(/\n\s*\n/).map((paragraph, index) => (
              <p
                // biome-ignore lint/suspicious/noArrayIndexKey: paragraphs are static per project and never reordered
                key={index}
                data-reveal-lines
                className="text-sm leading-snug"
              >
                {paragraph}
              </p>
            ))}
          </div>
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
                href={`/works/${prev.slug}`}
                label="Prev"
                name={prev.name}
                imageUrl={prev.imageUrl}
              />
            </div>
            <div data-reveal-item className="flex">
              <Link href="/works">All projects</Link>
            </div>
            <div data-reveal-item className="flex">
              <ProjectNavLink
                href={`/works/${next.slug}`}
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
          className="relative aspect-3/4 md:aspect-square w-full bg-neutral-200"
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
