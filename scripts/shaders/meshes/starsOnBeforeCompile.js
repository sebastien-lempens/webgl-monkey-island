import * as THREE from 'three'

/**
 * OnBeforeCompile Three js function
 * @param {object} mesh - Mesh with material
 * @return {void}
 */

const StarsMaterialOnBeforeCompile = (mesh) => {
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
        attribute float opacity;
        varying float vOpacity;
		${shader.vertexShader}`

    shader.vertexShader = shader.vertexShader.replace(
      /#include <begin_vertex>/,
      (match) =>
        match +
        `
        vOpacity = opacity;
			`
    )
    shader.fragmentShader = `
    varying float vOpacity;
		${shader.fragmentShader}`
    shader.fragmentShader = shader.fragmentShader.replace(
      /#include <dithering_fragment>/,
      (match) =>
        match +
        `
        gl_FragColor = vec4(color, 1.0);
				    `
    )

    mesh.material.userData.materialShader = shader
  }
}
export default StarsMaterialOnBeforeCompile
