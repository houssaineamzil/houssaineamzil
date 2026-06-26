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
            lerp: 0.15,
            duration: 1.25,
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
