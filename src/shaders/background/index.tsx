import { useFrame, useThree } from "@react-three/fiber"
import React, { useEffect, useMemo } from "react"
import { Vector2 } from "three"

const vertexShader = `
// attribute vec4 position;
varying vec2 fragmentCoordinates;

void main() {
	gl_Position = vec4(position.xy, 0.0, 1.0);
	fragmentCoordinates = position.xy * 1.;
}
`
const fragmentShader = `
precision highp float;
varying vec2 fragmentCoordinates;
uniform vec2 uResolution;
uniform float uTime;

// Configuration
#define NOISE_STRENGTH 0.1
#define SPECULAR_STRENGTH 0.25
#define ANIMATION_SPEED 0.5
#define DEPTH 30.
#define SEGMENT_QUALITY 2.

// Shape Definition
float blob(vec3 position) {
	float shapeSize = DEPTH;
	shapeSize *= (cos(position.z * 1.1)) * (atan(position.x) + 0.5) * (cos(position.z * cos(position.z * 20.)) + 1.0) + cos(position.z * 12. + uTime * ANIMATION_SPEED) * cos(position.x) * sin(position.y) * ((1.5));
	return shapeSize;
}

// Gaussian Noise Effect
float gaussian(float value, float mean, float sigma) {
	return (1.0 / (sigma * sqrt(12.0))) * exp(-(((value - mean) * (value - mean)) / (1.5 * (sigma * sigma))));
}

// Output
void main(void) {
	// Initial Color Gradient
	float mixFactor = fragmentCoordinates.x / uResolution.x;
	vec4 startColor = vec4(0.023, 0.035, 0.192, 1.0);
	vec4 endColor = vec4(0.03, 0.015, 0.2, 1.0);
	vec4 gradientColor = mix(startColor, endColor, mixFactor);
	gl_FragColor = gradientColor;

  // Shape Definition
	vec2 positionOffset = -3. + 1.2 * fragmentCoordinates;
	vec3 rayOrigin = vec3(positionOffset.x + 14.0, positionOffset.y + 2.7, -0.35);
	vec3 rayDirection = vec3(positionOffset.x * 8.0, positionOffset.y + 0.5, 0.8) / 140.0;
	vec4 colorAccumulation = vec4(0.0);
	float rayDistance = 0.0;
	for(int step = 0; step < 70; step++) {
		if(blob(rayOrigin + rayDirection * rayDistance) < 30.0) {
			vec3 epsilon = vec3(0.1, 0.0, 2.0);
			vec3 normal = vec3(0.0);
			normal.x = blob(rayOrigin + rayDirection * rayDistance) - blob(vec3(rayOrigin + rayDirection * rayDistance + epsilon.xyy));
			normal.y = blob(rayOrigin + rayDirection * rayDistance) - blob(vec3(rayOrigin + rayDirection * rayDistance + epsilon.yxy));
			normal.z = blob(rayOrigin + rayDirection * rayDistance) - blob(vec3(rayOrigin + rayDirection * rayDistance + epsilon.yxx)) + 1.0;
			normal = normalize(normal);
			colorAccumulation += max(dot(vec3(0.2, 1.5, -1.0), normal), 0.0) + min(dot(vec3(3.0, 10.2, -11.0), normal), 0.1) * 0.14;
			break;
		}
		rayDistance += SEGMENT_QUALITY;
	}

  // Base Color "Filter"
	gl_FragColor += vec4(0.15, 0.05, 0.38, 0.0) * 0.9;

  // Specular
	vec4 color = vec4(0.40, 0.6, 0.89, 1.0);
	gl_FragColor += colorAccumulation * SPECULAR_STRENGTH * color;

  // Brightness
	gl_FragColor *= rayDistance * 0.018;

  // Noise
	float seed = fract(uTime);
	float gaussian = fract(tan(distance(gl_FragCoord.xy * .6, gl_FragCoord.xy) * seed) * gl_FragCoord.x);
	vec3 noiseEffect = vec3(gaussian);

	gl_FragColor.rgba -= vec4(noiseEffect, .1) * NOISE_STRENGTH * 1.2;
}
`

export const Shader = () => {
	const { setSize } = useThree()

	const uniforms = useMemo(
		() => ({
			uTime: { value: 0 },
			uResolution: { value: new Vector2() },
			uMouse: { value: new Vector2() }
		}),
		[]
	)

	useEffect(() => {
		const resize = () => {
			setSize(window.innerWidth, window.innerHeight)
			uniforms.uResolution.value.x = window.innerWidth
			uniforms.uResolution.value.y = window.innerHeight
		}

		resize()
		window.addEventListener("resize", resize)
		return () => window.removeEventListener("resize", resize)
	}, [])

	useFrame(({ clock }) => {
		uniforms.uTime.value = clock.getElapsedTime()
	})

	return (
		<mesh>
			<planeGeometry args={[2, 2]} />
			<shaderMaterial
				uniforms={uniforms}
				vertexShader={vertexShader}
				fragmentShader={fragmentShader}
			/>
		</mesh>
	)
}
