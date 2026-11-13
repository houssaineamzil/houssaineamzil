import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "@/styles/globals.css";

// Self-hosted by Next at build time: no request to Google, nothing blocking
// the first paint. Used through --font-sans (see globals.css).
const inter = Inter({
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Houssaine Amzil - Creative Developer",
  description:
    "Portfolio of Høussaine Amzil, a creative developer and designer building interactive, motion-driven websites and brands.",
  robots: {
    index: false,
    follow: false,
  },
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <main className="relative block min-h-screen w-full">{children}</main>
      </body>
    </html>
  );
};

export default RootLayout;
