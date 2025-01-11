import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "cdn.sanity.io"
			}
		]
	},
	experimental: {
		turbo: {
			rules: {
				"*.glsl": {
					loaders: ["raw-loader"],
					as: "*.js"
				},
				"*.frag": {
					loaders: ["raw-loader"],
					as: "*.js"
				},
				"*.vert": {
					loaders: ["raw-loader"],
					as: "*.js"
				}
			}
		}
	}
}

export default nextConfig
