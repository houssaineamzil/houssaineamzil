import type { Metadata } from "next";

import { Navigation } from "@/components/navigation";
import "@/styles/globals.css";
import ReactLenis from "lenis/react";

export const metadata: Metadata = {
  title: "Houssaine Amzil - Creative Developer",
  description: "",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      <body>
        <ReactLenis
          root
          options={{
            // `lerp` alone drives wheel/touch scrolling with per-frame damping
            // toward the current target. Setting `duration` too makes Lenis
            // use a fixed-length eased tween instead — which fully restarts
            // on every wheel event, so a fast flick (many events in quick
            // succession) never gets past the first fraction of the curve
            // before being reset, producing a stuttery "launches then stops"
            // feel instead of smooth continuous motion.
            lerp: 0.15,
            syncTouch: true,
          }}
        >
          <Navigation />
          <main className="relative block min-h-screen w-full">{children}</main>
        </ReactLenis>
      </body>
    </html>
  );
};

export default RootLayout;
