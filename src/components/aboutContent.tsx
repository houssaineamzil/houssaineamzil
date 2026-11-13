import { Image } from "@/components/image";
import { InlineText, MediaSlot } from "@/components/inlineEdit";
import { Reveal } from "@/components/reveal";
import type { AboutContent as AboutContentType } from "@/lib/db/schema";
import { cn } from "@/lib/utils";

/** What the live editor wires in: with it, the text and portrait edit in place. */
export interface AboutEditApi {
  updateParagraph: (index: number, value: string) => void;
  uploadPortrait: (file: File) => void;
}

interface Props {
  about: AboutContentType;
  /** Present in the admin's live editor, absent on the public page. */
  edit?: AboutEditApi;
  className?: string;
}

export const AboutContent: React.FC<Props> = ({ about, edit, className }) => {
  const portrait = about.portrait.url && (
    <Image
      fill
      // The portrait is the page's largest paint: fetched first and shown
      // straight away, with no reveal animation in front of it.
      loading="eager"
      fetchPriority="high"
      alt={about.portrait.alt}
      className="object-cover"
      src={about.portrait.url}
      sizes="(max-width: 768px) 100vw, 40vw"
    />
  );

  return (
    <div className={cn("relative min-h-screen w-full", className)}>
      <div className="p-4 pt-60 md:absolute md:right-4 md:bottom-4 md:w-[40%] aspect-[1.0457/1] md:p-0">
        <div className="relative aspect-3/4 w-full bg-neutral-200 md:aspect-auto md:h-full">
          {edit ? (
            <MediaSlot
              filled={!!about.portrait.url}
              label="Upload portrait"
              accept="image/*"
              onFile={edit.uploadPortrait}
              className="size-full"
            >
              {portrait}
            </MediaSlot>
          ) : (
            portrait
          )}
        </div>
      </div>

      <Reveal className="flex max-w-sm flex-col gap-6 p-4 text-xs leading-tight uppercase md:absolute md:bottom-4 md:left-4 md:max-w-md md:p-0">
        {about.paragraphs.map((paragraph, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: paragraphs are edited in place and never reordered
          <p key={index} data-reveal-item>
            {edit ? (
              <InlineText
                multiline
                value={paragraph}
                onChange={(value) => edit.updateParagraph(index, value)}
                placeholder="Write a paragraph…"
              />
            ) : (
              paragraph
            )}
          </p>
        ))}
      </Reveal>
    </div>
  );
};
