import { Fragment } from "react";
import { DragScroll } from "@/components/dragScroll";
import { GalleryMinimap } from "@/components/galleryMinimap";
import { Image } from "@/components/image";
import { InlineSelect, InlineText, MediaSlot } from "@/components/inlineEdit";
import { Link } from "@/components/link";
import { ProjectNavLink } from "@/components/projectNavLink";
import { Reveal } from "@/components/reveal";
import { type CollectionKind, collections } from "@/lib/collections";
import { PROJECT_TYPES, ROLES } from "@/lib/projectOptions";
import { isVideoSrc } from "@/lib/utils";
import type { MediaType, ProjectSummary, ProjectType } from "@/types";

/** What the live editor wires in: with it, every field edits in place. */
export interface ProjectEditApi {
  update: <K extends keyof ProjectType>(key: K, value: ProjectType[K]) => void;
  uploadHero: (file: File) => void;
  uploadGallery: (index: number, file: File) => void;
  /** Still image shown in the minimap in place of a video. */
  uploadPoster: (index: number, file: File) => void;
}

interface Props {
  kind: CollectionKind;
  project: ProjectType;
  /** Neighbouring projects for the footer nav; omitted in the editor preview. */
  prev?: ProjectSummary;
  next?: ProjectSummary;
  email: string;
  /** Present in the admin's live editor, absent on the public page. */
  edit?: ProjectEditApi;
}

const Paragraphs: React.FC<{ text: string }> = ({ text }) =>
  text
    .split(/\n\s*\n/)
    .filter(Boolean)
    .map((paragraph) => (
      <p key={paragraph} data-reveal-lines className="text-sm leading-snug">
        {paragraph}
      </p>
    ));

export const ProjectDetail: React.FC<Props> = ({
  kind,
  project,
  prev,
  next,
  email,
  edit,
}) => {
  const { publicPath, backLabel } = collections[kind];
  const sectionFields = [
    { label: "Strategy", key: "strategy" },
    { label: "Result", key: "result" },
    { label: "Impact", key: "impact" },
  ] as const;
  // In the editor all three always show, so there is somewhere to type.
  const sections = sectionFields.filter(
    ({ key }) => edit || project[key].trim(),
  );
  // Public: empty values are left out, so unset fields leave no blank rows.
  // Editor: every row shows, with its field in place.
  const text = (
    key: "name" | "year" | "designer" | "developer" | "url",
    placeholder: string,
    className?: string,
  ) =>
    edit && (
      <InlineText
        value={project[key]}
        onChange={(value) => edit.update(key, value)}
        placeholder={placeholder}
        className={className}
      />
    );
  const facts: { label: string; value: React.ReactNode }[] = [
    { label: "Client", value: text("name", "Name") ?? project.name },
    { label: "Year", value: text("year", "Year") ?? project.year },
    {
      label: "Type",
      value: edit ? (
        <InlineSelect
          value={project.projectType}
          options={PROJECT_TYPES}
          onChange={(value) => edit.update("projectType", value)}
          placeholder="Type"
        />
      ) : (
        project.projectType
      ),
    },
    {
      label: "Role",
      value: edit ? (
        <InlineSelect
          value={project.role}
          options={ROLES}
          onChange={(value) => edit.update("role", value)}
          placeholder="Role"
        />
      ) : (
        project.role
      ),
    },
    {
      label: "Design",
      value: text("designer", "Designer") ?? project.designer,
    },
    {
      label: "Development",
      value: text("developer", "Developer") ?? project.developer,
    },
    {
      label: "Live",
      value:
        text("url", "https://…", "normal-case") ??
        (project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            Visit
          </a>
        )),
    },
  ];
  const showDescription = !sectionFields.some(({ key }) => project[key].trim());
  const galleryImages = [project.image, ...project.gallery];

  return (
    <div className="w-full">
      <Reveal className="flex w-full flex-col justify-end gap-16 p-4 pt-28 md:fixed md:inset-y-0 md:left-0 md:w-[42%] md:overflow-y-auto md:p-4 md:pt-24">
        <div className="flex flex-col gap-10">
          <dl className="grid grid-cols-[auto_1fr] gap-x-10 gap-y-1 text-xs font-medium uppercase text-neutral-950">
            {facts
              .filter(({ value }) => edit || value)
              .map(({ label, value }) => (
                <Fragment key={label}>
                  <dt data-reveal-item className="text-muted">
                    {label}
                  </dt>
                  <dd data-reveal-item>{value}</dd>
                </Fragment>
              ))}
          </dl>

          {/* The three case-study sections replace the description; it
              only shows for projects that don't have them (e.g. experiments). */}
          {showDescription && (
            <div className="flex max-w-md flex-col gap-2">
              {edit ? (
                <InlineText
                  multiline
                  value={project.description}
                  onChange={(value) => edit.update("description", value)}
                  placeholder="Description (shown until you fill in the sections below)"
                  className="text-sm leading-snug"
                />
              ) : (
                <Paragraphs text={project.description} />
              )}
            </div>
          )}

          {sections.length > 0 && (
            <div className="flex max-w-md flex-col gap-6">
              {sections.map(({ label, key }) => (
                <section key={key} className="flex flex-col gap-2">
                  <h2
                    data-reveal-item
                    className="text-muted flex items-center gap-2 text-[11px] font-medium uppercase"
                  >
                    <span aria-hidden className="size-2 bg-current" />
                    {label}
                  </h2>
                  {edit ? (
                    <InlineText
                      multiline
                      value={project[key]}
                      onChange={(value) => edit.update(key, value)}
                      placeholder={`Write the ${label.toLowerCase()}…`}
                      className="text-sm leading-snug"
                    />
                  ) : (
                    <Paragraphs text={project[key]} />
                  )}
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
          {prev && next && (
            <div className="flex items-center justify-between font-medium uppercase text-neutral-950">
              <div data-reveal-item className="flex">
                <ProjectNavLink
                  href={`${publicPath}/${prev.slug}`}
                  label="Prev"
                  name={prev.name}
                  imageUrl={prev.image.url}
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
                  imageUrl={next.image.url}
                />
              </div>
            </div>
          )}
        </div>
      </Reveal>

      <GalleryMinimap
        images={galleryImages}
        onAdd={
          edit && (() => edit.update("gallery", [...project.gallery, EMPTY]))
        }
      />

      {/* Dragging to scroll belongs to the public page; in the editor it
          would fight text selection. */}
      <GalleryColumn editing={!!edit}>
        <div
          data-gallery-image={0}
          className="relative aspect-3/4 md:aspect-square w-full"
        >
          {edit ? (
            <MediaSlot
              filled={!!project.image.url}
              label="Upload image"
              onFile={edit.uploadHero}
              className="size-full"
            >
              {project.image.url && (
                <Image
                  fill
                  parallax
                  src={project.image.url}
                  alt={project.image.alt}
                  sizes="(max-width: 768px) 100vw, 58vw"
                />
              )}
            </MediaSlot>
          ) : (
            project.image.url && (
              <Image
                fill
                parallax
                priority
                revealOnScroll
                src={project.image.url}
                alt={project.image.alt}
                sizes="(max-width: 768px) 100vw, 58vw"
              />
            )
          )}
        </div>

        <div className="flex flex-col gap-2">
          {project.gallery.map((image, imageIndex) => (
            <div
              className="p-[6%] bg-neutral-200"
              // biome-ignore lint/suspicious/noArrayIndexKey: gallery items have no id, are only appended, and an empty slot has no url to key on
              key={imageIndex}
            >
              <div
                data-gallery-image={imageIndex + 1}
                className="relative aspect-video w-full"
              >
                {edit ? (
                  <MediaSlot
                    filled={!!image.url}
                    label="Upload image"
                    onFile={(file) => edit.uploadGallery(imageIndex, file)}
                    className="size-full"
                  >
                    {image.url && (
                      <Image
                        fill
                        src={image.url}
                        alt={image.alt}
                        sizes="(max-width: 768px) 90vw, 52vw"
                      />
                    )}
                  </MediaSlot>
                ) : (
                  image.url && (
                    <Image
                      fill
                      revealOnScroll
                      src={image.url}
                      alt={image.alt}
                      sizes="(max-width: 768px) 90vw, 52vw"
                    />
                  )
                )}
              </div>
              {edit && isVideoSrc(image.url) && (
                <label className="mt-2 block cursor-pointer text-[11px] text-neutral-500 uppercase hover:underline">
                  {image.poster ? "Replace poster" : "Set poster"}
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) edit.uploadPoster(imageIndex, file);
                      e.target.value = "";
                    }}
                  />
                </label>
              )}
            </div>
          ))}
        </div>
      </GalleryColumn>
    </div>
  );
};

const EMPTY: MediaType = { url: "", alt: "" };

const GalleryColumn: React.FC<{
  editing: boolean;
  children: React.ReactNode;
}> = ({ editing, children }) => {
  const className =
    "flex w-full flex-col gap-2 p-4 md:pt-24 md:pl-[calc(42%+0.5rem)]";
  return editing ? (
    <div className={className}>{children}</div>
  ) : (
    <DragScroll className={className}>{children}</DragScroll>
  );
};
