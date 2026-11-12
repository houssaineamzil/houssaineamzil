import type { ReactNode } from "react";
import { CursorTail } from "@/components/cursorTail";
import { Navigation } from "@/components/navigation";

// Scopes the public marketing nav (social links, Home/About/Projects/
// Playground) to the public site only. It used to live in the root layout,
// so it rendered fixed on top of /admin too, visually clashing with the
// admin area's own header.
const SiteLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Navigation />
      <CursorTail />
      {children}
    </>
  );
};

export default SiteLayout;
