import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DragScroll } from "@/components/dragScroll";
import { GalleryMinimap } from "@/components/galleryMinimap";
import { Image } from "@/components/image";
import { Link } from "@/components/link";
import { projects } from "@/constants";

interface Props {
  params: Promise<{ slug: string }>;
}

export const generateStaticParams = async () => {
  return projects.map((project) => ({ slug: project.slug }));
};

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { slug } = await params;
  const project = projects.find((project) => project.slug === slug);

  return { title: project?.name ?? "Not found" };
};

const Page = async ({ params }: Props) => {
  const { slug } = await params;
  const index = projects.findIndex((project) => project.slug === slug);
  const project = projects[index];

  if (!project) notFound();

  const next = projects[(index + 1) % projects.length] ?? project;
  const galleryImages = [project.image, ...(project.gallery ?? [])];

  return (
    <div className="w-full">
      <div className="flex w-full flex-col justify-end gap-16 p-4 pt-60 md:fixed md:inset-y-0 md:left-0 md:w-[42%] md:overflow-hidden md:p-4 md:pt-20">
        <div className="flex flex-col gap-10">
          <dl className="grid grid-cols-[auto_1fr] gap-x-10 gap-y-1 text-[11px] uppercase">
            <dt className="text-muted">Client</dt>
            <dd>{project.name}</dd>

            <dt className="text-muted">Mission</dt>
            <dd>{project.labels.slice(0, 2).join(", ")}</dd>

            <dt className="text-muted">Year</dt>
            <dd>{project.year}</dd>

            <dt className="text-muted">Role</dt>
            <dd>{project.role}</dd>
          </dl>

          <p className="max-w-md text-xs leading-tight whitespace-pre-line uppercase">
            {project.description}
          </p>
        </div>

        <div className="flex items-end justify-between text-[11px] uppercase">
          <Link href={`/works/${next.slug}`}>Next</Link>
          <Link href="mailto:houssaineamzil18@gmail.com">
            houssaineamzil18@gmail.com
          </Link>
        </div>
      </div>

      <GalleryMinimap images={galleryImages} />

      <DragScroll className="flex w-full flex-col gap-2 p-4 md:pt-60 md:pl-[calc(42%+0.5rem)]">
        <div
          data-gallery-image={0}
          className="relative aspect-3/4 md:aspect-square w-full"
        >
          <Image
            fill
            parallax
            src={project.image.url}
            alt={project.image.alt}
            sizes="(max-width: 768px) 100vw, 58vw"
          />
        </div>

        {project.gallery && (
          <div className="flex flex-col gap-2">
            {project.gallery.map((image, imageIndex) => (
              <div className="p-[6%] bg-neutral-200" key={image.url}>
                <div
                  data-gallery-image={imageIndex + 1}
                  className="relative aspect-video w-full"
                >
                  <Image
                    fill
                    parallax={false}
                    horizontal={false}
                    src={image.url}
                    alt={image.alt}
                    sizes="(max-width: 768px) 50vw, 29vw"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </DragScroll>
    </div>
  );
};

export default Page;
