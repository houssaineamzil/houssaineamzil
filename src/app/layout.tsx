import type { Metadata } from "next";

import "@/styles/globals.css";

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
    <html lang="en">
      <body>
        <main className="relative block min-h-screen w-full">{children}</main>
      </body>
    </html>
  );
};

export default RootLayout;
