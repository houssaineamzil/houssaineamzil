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
	shapeSize *= (cos(position.z * 1.1)) * (atan(position.x) + .5) * (cos(position.z * cos(position.z * 10.)) + .5) + cos(position.z * 6. + uTime * ANIMATION_SPEED) * cos(position.x) * sin(position.y) * .75;
	return shapeSize/.5;
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
	vec2 positionOffset = -3. + 1.2 * (fragmentCoordinates / .8);
	vec3 rayOrigin = vec3(positionOffset.x + 14.0, positionOffset.y + 2.7, -0.35);
	vec3 rayDirection = vec3(positionOffset.x * 8.0, positionOffset.y + 0.5, 0.8) / 140.0;
	vec4 colorAccumulation = vec4(0.0);
	float rayDistance = 0.0;
	for(int step = 0; step < 80; step++) {
		if(blob(rayOrigin + rayDirection * rayDistance) < 40.0) {
			vec3 epsilon = vec3(0.1, 0.0, 2.0);
			vec3 normal = vec3(0.0);
			normal.x = blob(rayOrigin + rayDirection * rayDistance) - blob(vec3(rayOrigin + rayDirection * rayDistance + epsilon.xyy));
			// normal.y = blob(rayOrigin + rayDirection * rayDistance) - blob(vec3(rayOrigin + rayDirection * rayDistance + epsilon.yxy));
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

  // // Noise
	// vec2 pixelSize = vec2(1.0) / uResolution.xy;
	// vec2 uvCoordinates = fragmentCoordinates * pixelSize * 1.0;
	// float noiseSeed = dot(uvCoordinates * vec2(5.0), vec2(12.0, 52.0));
	// float noiseValue = fract(sin(.90) * (43758.5453 / 2.0) + rayDistance);
	// noiseValue = gaussian(noiseValue, float(0.0), float(0.5) * float(0.5));
	// vec3 noiseEffect = vec3(noiseValue) * (1.0 - gl_FragColor.rgb);

	// gl_FragColor.rgb -= noiseEffect * NOISE_STRENGTH * 30.0;

	float seed = fract(uTime);
	float gos = fract(tan(distance(gl_FragCoord.xy * .6, gl_FragCoord.xy) * seed) * gl_FragCoord.x);

	vec4 rgba = vec4(gos, gos, gos, .1);

	// gl_FragColor.rgb = rgb;
	gl_FragColor.rgba -= rgba * NOISE_STRENGTH * 1.2;

  // // Alpha
	// float colorBrightness = dot(gl_FragColor.rgb, vec3(0.299, 0.587, 0.114));
	// float alphaFactor = 0.005 + (0.2 * smoothstep(0.0, 0.1, colorBrightness));
	// gl_FragColor.a *= alphaFactor;
}
