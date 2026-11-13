import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev server on the LAN (e.g. a phone at 192.168.x.x:3000): without this
  // Next silently blocks the cross-origin dev requests and no client JS runs.
  // The LAN IP changes between networks, so match the private ranges.
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*"],
  // The playground replaced /archive; keep old links working.
  redirects: async () => [
    { source: "/archive", destination: "/playground", permanent: true },
    // The admin sections used to be named projects / experiments.
    {
      source: "/admin/projects/:path*",
      destination: "/admin/works/:path*",
      permanent: false,
    },
    {
      source: "/admin/experiments/:path*",
      destination: "/admin/playground/:path*",
      permanent: false,
    },
  ],
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
