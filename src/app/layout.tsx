import type { Metadata } from "next";

import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Houssaine Amzil - Creative Developer",
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
