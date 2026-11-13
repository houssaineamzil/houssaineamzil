import ReactLenis from "lenis/react";
import type { ReactNode } from "react";
import { CursorTail } from "@/components/cursorTail";
import { Navigation } from "@/components/navigation";

// The public site only: smooth scrolling, the nav and the cursor tail. /admin
// keeps native scrolling, which suits its forms and drag-to-reorder.
const SiteLayout = ({ children }: { children: ReactNode }) => {
  return (
    <ReactLenis
      root
      options={{
        // `lerp` alone drives wheel/touch scrolling with per-frame damping
        // toward the current target. Setting `duration` too makes Lenis
        // use a fixed-length eased tween instead, which fully restarts
        // on every wheel event, so a fast flick never gets past the first
        // fraction of the curve before being reset (a stuttery "launches
        // then stops" feel).
        lerp: 0.15,
        syncTouch: true,
      }}
    >
      <Navigation />
      <CursorTail />
      {children}
    </ReactLenis>
  );
};

export default SiteLayout;
