import type { Metadata } from "next";
import { Image } from "@/components/image";
import { Reveal } from "@/components/reveal";
import { getAboutContent } from "@/services/settings";

export const metadata: Metadata = {
  title: "About",
};

const Page = async () => {
  const about = await getAboutContent();

  return (
    <div className="relative min-h-screen w-full">
      <div className="p-4 pt-60 md:absolute md:right-4 md:bottom-4 md:w-[40%] aspect-[1.0457/1] md:p-0">
        <div className="relative aspect-3/4 w-full bg-neutral-200 md:aspect-auto md:h-full">
          <Image
            fill
            priority
            revealOnScroll
            alt={about.portrait.alt}
            className="object-cover"
            src={about.portrait.url}
            sizes="(max-width: 768px) 100vw, 40vw"
          />
        </div>
      </div>

      <Reveal className="flex max-w-sm flex-col gap-6 p-4 text-xs leading-tight uppercase md:absolute md:bottom-4 md:left-4 md:max-w-md md:p-0">
        {about.paragraphs.map((paragraph) => (
          <p key={paragraph} data-reveal-item>
            {paragraph}
          </p>
        ))}
      </Reveal>
    </div>
  );
};

export default Page;
