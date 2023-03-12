import * as THREE from 'three'

 /**
  * OnBeforeCompile Three js function
  * @param {object} mesh - Mesh with material
  * @return {void}
  */
 
 const VegetationMaterialOnBeforeCompile = (mesh) => {
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
      shader.uniforms.uDepth = { value: null } 
      shader.uniforms.uColor = { value: new THREE.Vector3() } 
 
     /**
      * @typedef {string} shaders
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
     uniform vec3 uColor;
     uniform sampler2D uDepth;
     varying vec3 vPosition; 
     ${shader.fragmentShader}`
 
     shader.fragmentShader = shader.fragmentShader.replace(
       /#include <dithering_fragment>/,
       (match) =>
         match + 
         `
         float depth = texture2D(uDepth, fract(vUv)).g;
         vec3 old_gl_FragColor = vec4(outgoingLight, diffuseColor.a).rgb;
         vec3 color =  mix(uColor, old_gl_FragColor, depth);  
         color.b += 0.005; 
         gl_FragColor = vec4(vec3(color), 1.0);    
         `
     )
 
     mesh.material.userData.materialShader = shader 
   }
 }
 
 export default VegetationMaterialOnBeforeCompile
 