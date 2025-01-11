"use client"

import { Shader } from "@/shaders/background"
import { Canvas } from "@react-three/fiber"
import React, { Suspense } from "react"

export const HomeScene = () => {
	const canvas = React.useRef<HTMLCanvasElement>(null)

	return (
		<>
			<Canvas ref={canvas} camera={{ position: [0, 0, 0.615], zoom: 1 }}>
				<ambientLight intensity={0.5} />
				<pointLight position={[10, 10, 10]} />

				<Suspense fallback={null}>
					<Shader />

					{/* <EffectComposer>
					<Noise opacity={0.02} />
				</EffectComposer> */}
				</Suspense>
			</Canvas>
			<div
				style={{
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					position: "fixed",
					pointerEvents: "none",
					opacity: 0.05,
					zIndex: 9999,
					display: "block",
					backgroundSize: "125px",
					backgroundPosition: "0 0",
					backgroundImage:
						"url(https://beta-houssaineamzil.vercel.app/assets/images/noise.gif)"
				}}
			/>
		</>
	)
}
