import { Footer } from "@/components/global/footer";
import { Header } from "@/components/global/header";
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
      <Footer /></div>
    </ReactLenis>
  );
};

export default RootLayout;
