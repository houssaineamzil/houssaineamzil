import type { ReactNode } from "react";
import { Navigation } from "@/components/navigation";

// Scopes the public marketing nav (social links, Home/About/Projects/
// Archive) to the public site only. It used to live in the root layout,
// so it rendered fixed on top of /admin too, visually clashing with the
// admin area's own header.
const SiteLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Navigation />
      {children}
    </>
  );
};

export default SiteLayout;
