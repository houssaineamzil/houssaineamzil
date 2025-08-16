import "@/styles/globals.css"
import { CustomEase, gsap } from "gsap/all"
import type { Metadata, Viewport } from "next"

gsap.registerPlugin(CustomEase)
CustomEase.create("power5.inOut", "M0,0 C0.4,0 0,1 1,1")

const baseUrl = `https://${process.env.VERCEL_URL}`

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#000000"
}
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
    "JavaScript"
  ],
  authors: [
    {
      name: "Høussaine Amzil",
      url: baseUrl
    }
  ],
  creator: "Høussaine Amzil",
  publisher: "Høussaine Amzil",
  openGraph: {
    title: "Høussaine Amzil — Creative Developer",
    description: "Creative Developer from Morocco.",
    url: baseUrl,
    siteName: "Høussaine Amzil — Creative Developer",
    images: [
      {
        url: `${baseUrl}/og.png`,
        width: 1920,
        height: 1080
      }
    ],
    type: "website",
    locale: "en_US"
  },
  twitter: {
    card: "summary_large_image",
    title: "Høussaine Amzil — Creative Developer",
    description: "Creative Developer from Morocco.",
    site: "@houssaineamzil",
    siteId: "1251202830314151936",
    creator: "@houssaineamzil",
    creatorId: "1251202830314151936",
    images: [`${baseUrl}/og.png`]
  },
  alternates: {
    canonical: baseUrl,
    languages: {
      "en-US": baseUrl
    }
  },

  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1
    }
  },
  metadataBase: new URL(baseUrl),
  other: {
    "application/ld+json": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Høussaine Amzil",
      url: baseUrl,
      jobTitle: "Creative Developer",
      sameAs: [
        "https://x.com/houssaineamzil",
        "https://github.com/houssaineamzil",
        "https://behance.net/houssaineamzil",
        "https://instagram.com/houssaineamzil18",
        "https://www.linkedin.com/in/houssaineamzil"
      ]
    })
  }
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body>{children}</body>
    </html>
  )
}

export default RootLayout
