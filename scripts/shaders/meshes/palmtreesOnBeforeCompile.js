import * as THREE from 'three'

/**
 * OnBeforeCompile Three js function
 * @param {object} mesh - Mesh with material
 * @return {void}
 */

const PalmtreesMaterialOnBeforeCompile = (mesh) => {
	/**
	 * @type {object}
	 */
	const { material } = mesh
	material.onBeforeCompile = (shader) => {
		/**
		 * Uniforms
		 * @property {sampler2D} uDepth - Grayscale picture for Depth
		 * @property {vec3} uColor - Scene Color Background
		 */
		shader.uniforms.uTime = { value: null }
		shader.uniforms.uDepth = { value: null }
		shader.uniforms.uDepth2 = { value: null }
		shader.uniforms.uColor = { value: new THREE.Vector3() }

		/**
		 * @typedef {string} shaders
		 * @property {string} fragment shader
		 */

		shader.vertexShader = `
      uniform float uTime;
      uniform sampler2D uDepth2;
      ${shader.vertexShader}`
		shader.vertexShader = shader.vertexShader.replace(
			/#include <project_vertex>/,
			`
        float depth = texture2D(uDepth2, fract(vUv)).g;  
        if(depth > .7) {
          transformed.x += sin(depth * ( transformed.x * transformed.x)  + uTime) * 0.0006;
          transformed.y += sin(depth * ( transformed.y * transformed.y) + uTime) * 0.00039;
          transformed.z += sin(depth * transformed.z + uTime) * 0.00039;
        }
        vec4 mvPosition = vec4( transformed, 1.0 );
        #ifdef USE_INSTANCING
        mvPosition = instanceMatrix * mvPosition;
        #endif
        mvPosition = modelViewMatrix * mvPosition;
        gl_Position = projectionMatrix * mvPosition;
        `
		)

		shader.fragmentShader = `
     uniform vec3 uColor;
     uniform sampler2D uDepth;
     ${shader.fragmentShader}`

		shader.fragmentShader = shader.fragmentShader.replace(
			/#include <dithering_fragment>/,
			(match) =>
				match +
				`
         float depth = texture2D(uDepth, fract(vUv)).g;
         vec3 old_gl_FragColor = vec4(outgoingLight, diffuseColor.a).rgb;
         vec3 color = mix(uColor,old_gl_FragColor,depth);
         gl_FragColor = vec4(color, 1.0); 
         `
		)

		mesh.material.userData.materialShader = shader
	}
}

export default PalmtreesMaterialOnBeforeCompile
