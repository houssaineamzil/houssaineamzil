import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import "@/styles/globals.css";
import ReactLenis from "lenis/react";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReactLenis
      root
      options={{
        duration: 1.2,
        autoRaf: true,
      }}
    >
      <div content="bg-white text-zinc-800 text-sm font-sans">
        <Header />
        {children}
        <Footer />
      </div>
    </ReactLenis>
  );
};

export default RootLayout;
