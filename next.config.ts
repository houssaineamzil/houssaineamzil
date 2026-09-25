import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets the dev server serve HMR/chunks when opened from another device on
  // the LAN (e.g. a phone at http://192.168.11.105:3000) instead of
  // localhost — without this, Next.js silently blocks those cross-origin
  // dev requests and the page loads but no client JS ever runs.
  allowedDevOrigins: ["192.168.11.105"],
  images: {
    remotePatterns: [
      {
        // Vercel Blob serves uploads from https://$storeId.public.blob.vercel-storage.com/...
        // — without this, next/image throws "hostname is not configured"
        // for every uploaded project/about image.
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
        port: "",
        pathname: "/**",
        search: "",
      },
    ],
  },
};

export default nextConfig;
