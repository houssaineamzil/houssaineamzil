"use client"

import { ReactLenis } from "@studio-freight/react-lenis"
import { type PropsWithChildren } from "react"

export const SmoothScrolling = ({ children }: PropsWithChildren) => {
	return (
		<ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothTouch: true }}>
			{children}
		</ReactLenis>
	)
}
