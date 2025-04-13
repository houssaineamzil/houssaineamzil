import { Link } from "@/components/link";

export const Navigation: React.FC = () => {
  return (
    <header className="fixed inset-x-0 top-0 z-100 flex w-full justify-between gap-2 p-2">
      <div className="flex-1">
        <svg
          className="w-18"
          viewBox="0 0 84 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>logo</title>
          <path d="M1 0H0V32H1V0Z" fill="currentColor" />
          <path d="M3 0H2V32H3V0Z" fill="currentColor" />
          <path d="M6 0H4V32H6V0Z" fill="currentColor" />
          <path d="M9 0H8V32H9V0Z" fill="currentColor" />
          <path d="M11 0H10V32H11V0Z" fill="currentColor" />
          <path d="M14 0H13V32H14V0Z" fill="currentColor" />
          <path d="M16 0H15V32H16V0Z" fill="currentColor" />
          <path d="M18 0H17V32H18V0Z" fill="currentColor" />
          <path d="M21 0H20V32H21V0Z" fill="currentColor" />
          <path d="M24 0H23V32H24V0Z" fill="currentColor" />
          <path d="M26 0H25V32H26V0Z" fill="currentColor" />
          <path d="M29 0H27V32H29V0Z" fill="currentColor" />
          <path d="M31 0H30V32H31V0Z" fill="currentColor" />
          <path d="M34 0H32V32H34V0Z" fill="currentColor" />
          <path d="M36.5 0H36V32H36.5V0Z" fill="currentColor" />
          <path d="M38.5 0H38V32H38.5V0Z" fill="currentColor" />
          <path d="M41 0H40V32H41V0Z" fill="currentColor" />
          <path d="M44 0H42V32H44V0Z" fill="currentColor" />
          <path d="M46 0H45V32H46V0Z" fill="currentColor" />
          <path d="M49 0H48V32H49V0Z" fill="currentColor" />
          <path d="M51 0H50V32H51V0Z" fill="currentColor" />
          <path d="M55 0H53V32H55V0Z" fill="currentColor" />
          <path d="M56 0H55V32H56V0Z" fill="currentColor" />
          <path d="M59 0H57V32H59V0Z" fill="currentColor" />
          <path d="M61 0H60V32H61V0Z" fill="currentColor" />
          <path d="M65 0H63V32H65V0Z" fill="currentColor" />
          <path d="M67 0H66V32H67V0Z" fill="currentColor" />
          <path d="M68.5 0H68V32H68.5V0Z" fill="currentColor" />
          <path d="M71 0H70V32H71V0Z" fill="currentColor" />
          <path d="M74 0H73V32H74V0Z" fill="currentColor" />
          <path d="M76 0H75V32H76V0Z" fill="currentColor" />
          <path d="M81 0H79V32H81V0Z" fill="currentColor" />
          <path d="M82 0H81V32H82V0Z" fill="currentColor" />
          <path d="M84 0H83V32H84V0Z" fill="currentColor" />
        </svg>
      </div>
      <div className="flex flex-1 justify-between md:w-96 md:flex-none">
        <div className="flex flex-col items-start">
          <Link target="_blank" href="https://linkedin.com/in/houssaineamzil">
            LinkedIn
          </Link>
          <Link target="_blank" href="https://instagram.com/houssaineamzil18">
            Instagram
          </Link>
          <Link target="_blank" href="https://behance.net/houssaineamzil">
            Behance
          </Link>
          <Link target="_blank" href="mailto:houssaineamzil18@gmail.com">
            Email
          </Link>
        </div>
        <div className="flex flex-col items-end">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/works">Projects</Link>
          <Link href="/archive">Archive</Link>
        </div>
      </div>
    </header>
  );
};
