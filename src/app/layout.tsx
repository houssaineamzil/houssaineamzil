import "@/styles/globals.css";
import axios from "axios";
import { CustomEase, gsap } from "gsap/all";
import type { Metadata, Viewport } from "next";

axios.defaults.baseURL = "http://127.0.0.1:3000";

gsap.registerPlugin(CustomEase);
CustomEase.create("power5.inOut", "M0,0 C0.4,0 0,1 1,1");

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};
export const metadata: Metadata = {
  title: "Høussaine Amzil — Creative Developer",
  description: "Creative Developer from Morocco.",
  keywords: [
    "Developer",
    "Designer",
    "Creative Developer",
    "Graphic Designer",
    "Morocco",
    "Next.js",
    "React",
    "JavaScript",
  ],
  authors: [
    {
      name: "Høussaine Amzil",
      url: "https://houssaineamzil.vercel.app",
    },
  ],
  creator: "Høussaine Amzil",
  publisher: "Høussaine Amzil",
  openGraph: {
    title: "Høussaine Amzil — Creative Developer",
    description: "Creative Developer from Morocco.",
    url: "https://houssaineamzil.vercel.app",
    siteName: "Høussaine Amzil — Creative Developer",
    images: [
      {
        url: "https://houssaineamzil.vercel.app/og.png",
        width: 1920,
        height: 1080,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Høussaine Amzil — Creative Developer",
    description: "Creative Developer from Morocco.",
    site: "@houssaineamzil",
    siteId: "1251202830314151936",
    creator: "@houssaineamzil",
    creatorId: "1251202830314151936",
    images: ["https://houssaineamzil.vercel.app/og.png"],
  },
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
