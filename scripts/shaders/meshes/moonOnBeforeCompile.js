import * as THREE from 'three'

/**
 * OnBeforeCompile Three js function
 * @param {object} mesh - Mesh with material
 * @return {void}
 */

const MoonMaterialOnBeforeCompile = (mesh) => {
	/**
	 * @type {object}
	 */
	const { material } = mesh
	material.onBeforeCompile = (shader) => {
		/**
		 * Uniforms
		 * @property {vec3} uHaloColor - Scene Color Background
		 */
		shader.uniforms.uHaloColor = { value: new THREE.Vector3() }

		/**
		 * @typedef {string} shaders
		 * @property {string} vertex shader
		 * @property {string} fragment shader
		 */
		shader.vertexShader = `
		 varying vec3 vPosition; 
		${shader.vertexShader}`

		shader.vertexShader = shader.vertexShader.replace(
			/#include <begin_vertex>/,
			(match) =>
				match +
				`
			vPosition = position;
			`
		)
		shader.fragmentShader = `
		uniform vec3 uHaloColor;
		varying vec3 vPosition; 
		${shader.fragmentShader}`
			shader.fragmentShader = shader.fragmentShader.replace(
				/#include <dithering_fragment>/,
				(match) =>
					match +
					`
				float moonIntensity = 0.6;
				vec3 moonUv = vPosition/0.1;
				vec2 moonUvHalo =  (vPosition.xy/0.1);
				float moonHalo = .7 - distance(moonUvHalo, vec2(0.05, -0.1));
				float moonMaskBottom = max(.5 + moonUv.y + (-moonUv.x * 0.3), 0.0);  
				float moonMask = moonHalo * moonMaskBottom / (1.0-moonIntensity);
				vec3 diffuse = diffuseColor.rgb;
				diffuse.g += 0.1;
				diffuse.b += 0.15;
				vec3 color = mix(uHaloColor, diffuse, moonMask);
				gl_FragColor = vec4(color, 1.0);
				`
			)

		mesh.material.userData.materialShader = shader
	}
}
export default MoonMaterialOnBeforeCompile