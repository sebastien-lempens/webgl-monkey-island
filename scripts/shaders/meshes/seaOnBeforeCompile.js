import * as THREE from 'three'
/**
 * @typedef {import} snoise3
 * @param {snoise3} 3D noise function
 */
import snoise3 from '../packages/glsl-noise/simplex-3d.glsl'

/**
 * OnBeforeCompile Three js function
 * @param {object} mesh - Mesh with material
 * @return {void}
 */

const SeaMaterialOnBeforeCompile = (mesh) => {
  /**
   * @type {object}
   */
  const { material } = mesh
  material.onBeforeCompile = (shader) => {
    /**
     * Uniforms
     * @property {float} uTime - Timer
     * @property {sampler2D} uDepth - Grayscale picture for Depth
     * @property {vec3} uColor - Scene Color Background
     */
    shader.uniforms.uTime = { value: 0 }
    shader.uniforms.uDepth = { value: null }
    shader.uniforms.uColor = { value: new THREE.Vector3() }

    /**
     * @typedef {string} shaders
     * @property {string} vertex shader
     * @property {string} fragment shader
     */
    shader.vertexShader = `
    varying vec3 vPosition; 
    uniform float uTime;
    ${snoise3}
    ${shader.vertexShader}`
    shader.vertexShader = shader.vertexShader.replace(
      /#include <beginnormal_vertex>/,
      (match) =>
        `
        vec3 normalTransform = normal;
        normalTransform.xz +=  0.025 * sin( normalTransform.xz * 100.0 + uTime);
        vec3 objectNormal = vec3( normalTransform );
        #ifdef USE_TANGENT
          vec3 objectTangent = vec3( tangent.xyz );
        #endif
      `
    )
    shader.vertexShader = shader.vertexShader.replace(
      /#include <begin_vertex>/,
      (match) => 
        match +
        `
      float noise = snoise((transformed.xxz) * 150.0 + uTime/10.0); 
      noise += snoise((transformed.xzz) * 300.0 + uTime/10.0); 
      transformed.yz += noise * normalTransform.xz * 0.1 * 0.35;
      vPosition = transformed;
      `
    )

    shader.fragmentShader = `
    uniform float uTime;
    uniform vec3 uColor;
    uniform sampler2D uDepth;
    varying vec3 vPosition;
    ${snoise3} 
    ${shader.fragmentShader}`
    shader.fragmentShader = shader.fragmentShader.replace(
      /#include <dithering_fragment>/,
      (match) =>
        match +
        `
        float depth = texture2D(uDepth, fract(vUv)).g;
        float noise = snoise(vPosition * 20.0 + uTime/5.0); 
        vec3 old_gl_FragColor = vec4(outgoingLight, diffuseColor.a).rgb;
        vec3 color = mix(uColor,old_gl_FragColor,depth);
        gl_FragColor = vec4(color, 1.0);
        `
    )

    mesh.material.userData.materialShader = shader
  }
}

export default SeaMaterialOnBeforeCompile
