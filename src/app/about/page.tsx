import type { Metadata } from "next";
import { Image } from "@/components/image";

export const metadata: Metadata = {
  title: "About",
};

const Page = () => {
  return (
    <div className="relative min-h-screen w-full">
      <div className="p-4 pt-60 md:absolute md:right-4 md:bottom-4 md:w-[40%] aspect-[1.0457/1] md:p-0">
        <div className="relative aspect-3/4 w-full bg-neutral-200 md:aspect-auto md:h-full">
          <Image
            fill
            priority
            alt="Høussaine Amzil"
            className="object-cover"
            src="/aqgfyrlygqymxaue7cz4.avif"
            sizes="(max-width: 768px) 100vw, 40vw"
          />
        </div>
      </div>

      <div className="flex max-w-sm flex-col gap-6 p-4 text-xs leading-tight uppercase md:absolute md:bottom-4 md:left-4 md:max-w-md md:p-0">
        <p>Høussaine Amzil is a creative developer.</p>
        <p>
          He designs and builds interactive, motion-driven interfaces at the
          crossroads of design and engineering. Guided by rhythm, detail and
          feel, his work explores the tension between code and craft.
        </p>
        <p>
          Influenced by editorial design and motion graphics, he shapes minimal
          yet expressive experiences — where every interaction is intentional,
          every detail considered.
        </p>
        <p>
          Høussaine collaborates with brands and studios who value thoughtful,
          well-crafted digital products.
        </p>
      </div>
    </div>
  );
};

export default Page;
