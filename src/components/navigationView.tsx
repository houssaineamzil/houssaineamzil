import { Link } from "@/components/link";
import { Logo } from "@/components/logo";
import { collections } from "@/lib/collections";
import type { SiteLinks } from "@/lib/db/schema";

interface Props {
  links: SiteLinks;
}

const BLUR_LAYERS = [
  {
    blur: 0.5,
    mask: "linear-gradient(to bottom, black 0%, black 25%, transparent 50%)",
  },
  {
    blur: 1.5,
    mask: "linear-gradient(to bottom, black 10%, black 40%, transparent 65%)",
  },
  {
    blur: 4,
    mask: "linear-gradient(to bottom, black 20%, black 50%, transparent 80%)",
  },
  {
    blur: 8,
    mask: "linear-gradient(to bottom, black 30%, black 60%, transparent 100%)",
  },
];

const LINK = "uppercase text-xs font-medium leading-4";

const PAGES = [
  ["Home", "/"],
  ["About", "/about"],
  ["Projects", collections.works.publicPath],
  ["Playground", collections.experiments.publicPath],
] as const;

const socials = (links: SiteLinks) =>
  [
    ["LinkedIn", links.linkedin],
    ["Instagram", links.instagram],
    ["Behance", links.behance],
    ["Email", `mailto:${links.email}`],
  ] as const;

export const NavigationView: React.FC<Props> = ({ links }) => {
  return (
    <>
      {/* Progressive blur: stacked backdrop-blur layers, each masked to a
          shorter band, so the blur eases out below the nav instead of
          ending on a hard edge. Keeps the links readable over images. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-90 h-28"
      >
        {BLUR_LAYERS.map(({ blur, mask }) => (
          <div
            key={blur}
            className="absolute inset-0"
            style={{
              backdropFilter: `blur(${blur}px)`,
              WebkitBackdropFilter: `blur(${blur}px)`,
              maskImage: mask,
              WebkitMaskImage: mask,
            }}
          />
        ))}
      </div>
      <header className="fixed inset-x-0 top-0 z-100 flex w-full justify-between gap-2 p-4 text-white mix-blend-difference">
        <div className="flex-1">
          <Logo className="w-18" />
        </div>
        <div className="flex flex-1 justify-between md:w-96 md:flex-none">
          <nav className="flex flex-col items-start">
            {socials(links).map(([label, href]) => (
              <Link key={label} target="_blank" href={href} className={LINK}>
                {label}
              </Link>
            ))}
          </nav>
          <nav className="flex flex-col items-end">
            {PAGES.map(([label, href]) => (
              <Link key={label} href={href} className={LINK}>
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
    </>
  );
};
