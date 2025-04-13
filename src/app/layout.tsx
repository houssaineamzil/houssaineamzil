import type { Metadata } from "next"

import "@/styles/globals.css"
import { Navigation } from "@/components/navigation"
import gsap from "gsap"
import CustomEase from "gsap/dist/CustomEase"
import ReactLenis from "lenis/react"

gsap.registerPlugin(CustomEase)
CustomEase.create("easeInOut", "0.58, 0, 0, 1")

export const metadata: Metadata = {
	title: "Houssaine Amzil - Creative Developer",
	description: ""
}

const RootLayout = ({
	children
}: Readonly<{
	children: React.ReactNode
}>) => {
	return (
		<html lang="en">
			<body>
				<ReactLenis root>
					<Navigation />
					<main className="absolute inset-0 w-full h-full">{children}</main>
				</ReactLenis>
			</body>
		</html>
	)
}

export default RootLayout
