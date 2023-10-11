// types
import type { Metadata } from "next";

// imports
import { Cursor } from "_components/Cursor";
import { Footer } from "_components/Footer";
import { Header } from "_components/Header";
import { PageWithTransition } from "_components/PageTransition";
import { ThemeProvider } from "_components/ThemeProvider";
import "_styles/globals.scss";
import { Suspense } from "react";
import { NoiseLayer } from "_components/NoiseLayer";

import { Syne } from "next/font/google";
import localFont from "next/font/local";

// font
const TTNeueFont = localFont({
  display: "swap",
  variable: "--font-ttNeue",
  src: "../_assets/fonts/TT Firs Neue Trial Var Roman.ttf",
});

const SyneFont = Syne({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-syne",
});

// metadata
export const metadata: Metadata = {
  title: {
    template: "%s | Høussaine Amzil",
    default: "Høussaine Amzil",
  },
  description:
    "Creative developer passionate about building appealing and interactive web experiences.",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <Suspense fallback={null}>
            <PageWithTransition>
              <Cursor />
              <NoiseLayer />
              <Header />
              {children}
              <Footer />
            </PageWithTransition>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
