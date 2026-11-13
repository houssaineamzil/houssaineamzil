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
  headers: async () => [
    {
      // The tick sound never changes under the same name; browsers can keep it.
      source: "/audio/:path*",
      headers: [
        { key: "Cache-Control", value: "public, max-age=2592000, immutable" },
      ],
    },
  ],
  images: {
    // Uploads are AVIF already; without this Next re-encodes them as WebP,
    // which is larger. Uploaded files get a random name per upload, so a
    // transformed image can be cached for a year.
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 365,
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
