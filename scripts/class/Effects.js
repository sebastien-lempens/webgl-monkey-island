import * as THREE from 'three'
import { gsap } from 'gsap'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass'
import { ColorCorrectionShader } from 'three/examples/jsm/shaders/ColorCorrectionShader'
//import { SobelOperatorShader } from 'three/examples/jsm/shaders/SobelOperatorShader'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import FogVertex from '../shaders/fog/vertex.glsl'
import FogFragment from '../shaders/fog/fragment.glsl'
import FlameVertex from '../shaders/flame/vertex.glsl'
import FlameFragment from '../shaders/flame/fragment.glsl'
import DustVertex from '../shaders/dust/vertex.glsl'
import DustFragment from '../shaders/dust/fragment.glsl'
import StarsVertex from '../shaders/stars/vertex.glsl'
import StarsFragment from '../shaders/stars/fragment.glsl'
import SceneVertex from '../shaders/scene/vertex.glsl'
import SceneFragment from '../shaders/scene/fragment.glsl'
import SeaMaterialOnBeforeCompile from '../shaders/meshes/seaOnBeforeCompile.js'
import StarsMaterialOnBeforeCompile from '../shaders/meshes/starsOnBeforeCompile.js'
import ShoresMaterialOnBeforeCompile from '../shaders/meshes/shoresOnBeforeCompile.js'
import TreesMaterialOnBeforeCompile from '../shaders/meshes/treesOnBeforeCompile.js'
import MountainsMaterialOnBeforeCompile from '../shaders/meshes/mountainsOnBeforeCompile.js'
import VegetationMaterialOnBeforeCompile from '../shaders/meshes/vegetationOnBeforeCompile.js'
import RocksMaterialOnBeforeCompile from '../shaders/meshes/rocksOnBeforeCompile.js'
import PalmtreesMaterialOnBeforeCompile from '../shaders/meshes/palmtreesOnBeforeCompile.js'
import MoonMaterialOnBeforeCompile from '../shaders/meshes/moonOnBeforeCompile.js'

export default class Effects {
  constructor() {
    this.app = window.app
    this.scene = this.app.webgl.scene
    this.camera = this.app.webgl.camera
    this.meshes = this.app.webgl.world.meshes
    this.effectComposer = {}
    this.fog = {
      geometry: null,
      material: null,
      mesh: null,
    }
    this.flame = {
      geometry: null,
      material: null,
      mesh: null,
    }
    this.flame2 = {
      geometry: null,
      material: null,
      mesh: null,
    }
    this.stars = {
      geometry: null,
      material: null,
      mesh: null,
    }
    this.dust = {
      geometry: null,
      material: null,
      mesh: null,
      colors: [
        [0, 1, 1],
        [1, 1, 1],
      ],
      particles: 400,
    }
    this.mesh = {}
  
    this.addFog()
    this.addFlames()
    this.addStars()
    this.addDust()
    this.setShaderMeshTrees()
    this.setShaderMeshShores()
    this.setShaderMeshSea()
    this.setShaderMeshMountains()
    this.setShaderMeshVegetation()
    this.setShaderMeshRocks()
    this.setShaderMeshPalmtrees()
    this.setShaderMeshMoon()
    this.setShaderScene()
  }
  addFog() {
    this.fog.geometry = new THREE.BoxBufferGeometry(0.6, 0.005, 0.5, 1, 1, 1)
    this.fog.material = new THREE.ShaderMaterial({
      clipping: this.app.xr ? false : true,
      clippingPlanes: this.app.xr ? [] : this.app.webgl.clippingPlanes,
      uniforms: {
        uTime: { value: this.app.timer },
        uColor: { value: this.scene.background },
      },
      transparent: true,
      vertexShader: FogVertex,
      fragmentShader: FogFragment,
    })
    this.fog.mesh = new THREE.Mesh(this.fog.geometry, this.fog.material)
    this.fog.mesh.position.z = 0.0
    this.fog.mesh.position.y = 0.0065
    this.fog.mesh.name = 'Fog'
    this.scene.add(this.fog.mesh)
  }
  addFlames() {
    this.flame.geometry = new THREE.PlaneBufferGeometry(0.03, 0.03)
    this.flame.material = new THREE.ShaderMaterial({
      transparent: true,
      clipping: this.app.xr ? false : true,
      clippingPlanes: this.app.xr ? [] : this.app.webgl.clippingPlanes,
      uniforms: {
        uTime: { value: this.app.timer },
      },
      vertexShader: FlameVertex,
      fragmentShader: FlameFragment,
    })
    this.flame.mesh = new THREE.Mesh(this.flame.geometry, this.flame.material)
    this.flame.mesh.position.set(-0.0646, 0.031, -0.027)
    this.flame.mesh.name = 'Flame'
    this.flame2.mesh = this.flame.mesh.clone()
    this.flame2.mesh.name = 'Flame 2'
    this.flame2.mesh.position.set(-0.055, 0.031, -0.083)
    this.scene.add(this.flame.mesh)
    setTimeout(() => this.scene.add(this.flame2.mesh), 500)
  }
  addStars() {
    const vertices = []
    const opacities = []
    for (let i = 0; i < 5000; i++) {
      const x = THREE.MathUtils.randFloatSpread(10)
      const y = THREE.MathUtils.randFloat(0, 5)
      const z = THREE.MathUtils.randFloatSpread(10)
      vertices.push(x, y, z)
      opacities.push(Math.random() * 0.4 + 0.05)
    }
    this.stars.geometry = new THREE.BufferGeometry()
    this.stars.geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(vertices, 3)
    )
    this.stars.geometry.setAttribute(
      'opacity',
      new THREE.Float32BufferAttribute(opacities, 1)
    )
    this.stars.material = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        uSize: { value: 0.9 },
      },
      vertexShader: StarsVertex,
      fragmentShader: StarsFragment,
    })
    this.stars.mesh = new THREE.Points(this.stars.geometry, this.stars.material)
    this.scene.add(this.stars.mesh)
  }
  addDust() {
    // Vertices Position
    const positions = []
    const colors = []
    const opacities = []
    for (let i = 0; i < this.dust.particles; i++) {
      const xyz = [
        THREE.MathUtils.randFloatSpread(0.25),
        Math.random() * 0.05 + 0.005,
        THREE.MathUtils.randFloatSpread(0.25),
      ]
      const randomColor =
        this.dust.colors[
          Math.round(Math.random() * (this.dust.colors.length - 1))
        ]
      const rgb = randomColor

      const opacity = Math.random() + 0.2

      positions.push(...xyz)
      colors.push(...rgb)
      opacities.push(opacity)
    }

    this.dust.geometry = new THREE.BufferGeometry()
    this.dust.geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(positions, 3)
    )
    this.dust.geometry.setAttribute(
      'color',
      new THREE.Float32BufferAttribute(colors, 3)
    )
    this.dust.geometry.setAttribute(
      'opacity',
      new THREE.Float32BufferAttribute(opacities, 1)
    )

    this.dust.material = new THREE.ShaderMaterial({
      clipping: this.app.xr ? false : true,
      clippingPlanes: this.app.xr ? [] : this.app.webgl.clippingPlanes,
      uniforms: {
        uTime: { value: this.app.timer },
        uSize: { value: 0.9 },
      },
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      vertexShader: DustVertex,
      fragmentShader: DustFragment,
    })
    this.dust.mesh = new THREE.Points(this.dust.geometry, this.dust.material)
    this.scene.add(this.dust.mesh)
  }
  setShaderMeshSea() {
    const [mesh] = this.meshes.filter((mesh) => mesh.name === 'Sea')
    this.mesh.sea = mesh
    SeaMaterialOnBeforeCompile(this.mesh.sea)
  }
  setShaderMeshShores() {
    const [mesh] = this.meshes.filter((mesh) => mesh.name === 'Shores')
    this.mesh.shores = mesh
    ShoresMaterialOnBeforeCompile(this.mesh.shores)
  }
  setShaderMeshTrees() {
    const [mesh] = this.meshes.filter((mesh) => mesh.name === 'Trees')
    this.mesh.trees = mesh
    TreesMaterialOnBeforeCompile(this.mesh.trees)
  }
  setShaderMeshMountains() {
    const [mesh] = this.meshes.filter((mesh) => mesh.name === 'Mountains')
    this.mesh.mountains = mesh
    MountainsMaterialOnBeforeCompile(this.mesh.mountains)
  }
  setShaderMeshVegetation() {
    const [mesh] = this.meshes.filter((mesh) => mesh.name === 'Vegetation')
    this.mesh.vegetation = mesh
    VegetationMaterialOnBeforeCompile(this.mesh.vegetation)
  }
  setShaderMeshRocks() {
    const [mesh] = this.meshes.filter((mesh) => mesh.name === 'Rocks')
    this.mesh.rocks = mesh
    RocksMaterialOnBeforeCompile(this.mesh.rocks)
  }
  setShaderMeshPalmtrees() {
    const [mesh] = this.meshes.filter((mesh) => mesh.name === 'Palmtrees')
    this.mesh.palmtrees = mesh
    PalmtreesMaterialOnBeforeCompile(this.mesh.palmtrees)
  }
  setShaderMeshMoon() {
    const [mesh] = this.meshes.filter((mesh) => mesh.name === 'Moon')
    this.mesh.moon = mesh
    this.mesh.moon.scale.addScalar(0.35)
    MoonMaterialOnBeforeCompile(this.mesh.moon)
  }
  async setShaderScene() {
  
    /**
     * BloomPass Shader
     */
    const bloomPass = new UnrealBloomPass()
    bloomPass.strength = this.app.params.scene.effect.bloom.strength
    bloomPass.radius = this.app.params.scene.effect.bloom.radius
    bloomPass.threshold = this.app.params.scene.effect.bloom.threshold
    this.effectComposer.bloomPass = bloomPass
    /**
     * BokehPass Shader
     */
    const bokehPass = new BokehPass(this.scene, this.camera, {
      focus: this.app.params.scene.effect.bokeh.focus,
      aperture: this.app.params.scene.effect.bokeh.aperture,
      maxblur: 0.01,
    })
    this.effectComposer.bokehPass = bokehPass

    /**
     * Custom Shaders
     * 1. Color Correction
     * 2. Custom Shader
     */
    const colorCorrectionShader = new ShaderPass(ColorCorrectionShader)
    colorCorrectionShader.uniforms.addRGB.value = new THREE.Vector3(
      0,
      0.01,
      0.04
    )
    colorCorrectionShader.uniforms.powRGB.value = new THREE.Vector3(1, 1, 0.95)

    /*const edgeShader = new ShaderPass(SobelOperatorShader)

		edgeShader.uniforms.resolution.value = new THREE.Vector2(
			window.innerWidth,
			window.innerHeight
		)
		this.effectComposer.edgeShader = edgeShader */

    const sceneReveal = {
      uniforms: {
        tDiffuse: { value: null },
        opacity: { value: 1.0 },
        uColor: { value: this.scene.background },
        uProgress: { value: 0.0001 },
      },
      vertexShader: SceneVertex,
      fragmentShader: SceneFragment,
    }
    const sceneRevealPass = new ShaderPass(sceneReveal)
    sceneRevealPass.material.transparent = true
    const { mainTitleEl } = this.app.webgl
    gsap.to(sceneRevealPass.material.uniforms.uProgress, {
      onStart() {
        mainTitleEl.removeAttribute('style')
        gsap.to(mainTitleEl, {
          ease: 'power1.inOut',
          delay: 0.5,
          duration: 2,
          opacity: 0,
          force3D: true,
          scale: 1.2,
          onComplete() {
            const h1 = document.querySelector('h1')
            h1.classList.add('top-left-position')
            gsap.set(mainTitleEl, {
              scale: 1,
            })
            gsap.fromTo(
              mainTitleEl,
              {
                opacity: 0,
                scale: 0.9,
              },
              {
                opacity: 1,
                scale: 1,
                duration: 2,
                force3D: true,
                ease: 'power1.inOut',
              }
            )
          },
        })
      },
      delay: 1,
      value: 1.2,
      duration: 4,
      ease: 'none',
    })

    /**
     * Add shader to composer
     */
    //this.app.webgl.composer.removePass(edgeShader)
    //this.app.webgl.composer.addPass(edgeShader)
    this.app.webgl.composer.addPass(sceneRevealPass)
    this.app.webgl.composer.addPass(colorCorrectionShader)
    if(this.app.xr === false) this.app.webgl.composer.addPass(bloomPass)
    if(this.app.xr === false) this.app.webgl.composer.addPass(bokehPass)

    this.app.effectComposer = this.effectComposer
  }

  update() {
    if (this.fog.material) {
      this.fog.material.uniforms.uTime.value = this.app.timer
      this.fog.material.uniforms.uColor.value = this.scene.background
    }
    if (this.flame.material) {
      this.flame.material.uniforms.uTime.value = this.app.timer
      this.flame.mesh.rotation.y = this.flame2.mesh.rotation.y =
        this.app.webgl.camera.rotation.y
    }
    if (this.dust.mesh) {
      this.dust.material.uniforms.uTime.value = this.app.timer
    }
    if (this.mesh.sea) {
      if (
        !this.mesh.sea.material.userData.materialShader.uniforms.uDepth.value
      ) {
        this.mesh.sea.material.userData.materialShader.uniforms.uDepth.value =
          new THREE.TextureLoader().load('assets/textures/GrayscaleSea.jpg')
      }
      this.mesh.sea.material.userData.materialShader.uniforms.uColor.value =
        this.scene.background
      this.mesh.sea.material.userData.materialShader.uniforms.uTime.value =
        this.app.timer
    }
    if (this.mesh.shores) {
      if (
        !this.mesh.shores.material.userData.materialShader.uniforms.uDepth.value
      ) {
        this.mesh.shores.material.userData.materialShader.uniforms.uDepth.value =
          new THREE.TextureLoader().load('assets/textures/GrayscaleShores.jpg')
      }
      this.mesh.shores.material.userData.materialShader.uniforms.uColor.value =
        this.scene.background
    }
    if (this.mesh.trees) {
      if (
        !this.mesh.trees.material.userData.materialShader.uniforms.uDepth.value
      ) {
        this.mesh.trees.material.userData.materialShader.uniforms.uDepth.value =
          new THREE.TextureLoader().load('assets/textures/GrayscaleTrees.jpg')
      }
      this.mesh.trees.material.userData.materialShader.uniforms.uColor.value =
        this.scene.background
    }
    if (this.mesh.mountains) {
      if (
        !this.mesh.mountains.material.userData.materialShader.uniforms.uDepth
          .value
      ) {
        this.mesh.mountains.material.userData.materialShader.uniforms.uDepth.value =
          new THREE.TextureLoader().load(
            'assets/textures/GrayscaleMountains.jpg'
          )
      }
      this.mesh.mountains.material.userData.materialShader.uniforms.uColor.value =
        this.scene.background
    }
    if (this.mesh.vegetation) {
      if (
        !this.mesh.vegetation.material.userData.materialShader.uniforms.uDepth
          .value
      ) {
        this.mesh.vegetation.material.userData.materialShader.uniforms.uDepth.value =
          new THREE.TextureLoader().load(
            'assets/textures/GrayscaleVegetation.jpg'
          )
      }
      this.mesh.vegetation.material.userData.materialShader.uniforms.uColor.value =
        this.scene.background
    }
    if (this.mesh.rocks) {
      if (
        !this.mesh.rocks.material.userData.materialShader.uniforms.uDepth.value
      ) {
        this.mesh.rocks.material.userData.materialShader.uniforms.uDepth.value =
          new THREE.TextureLoader().load('assets/textures/GrayscaleRocks.jpg')
      }
      this.mesh.rocks.material.userData.materialShader.uniforms.uColor.value =
        this.scene.background
    }
    if (this.mesh.palmtrees) {
      if (
        !this.mesh.palmtrees.material.userData.materialShader.uniforms.uDepth
          .value
      ) {
        this.mesh.palmtrees.material.userData.materialShader.uniforms.uDepth.value =
          new THREE.TextureLoader().load(
            'assets/textures/GrayscalePalmtrees.jpg'
          )
      }
      if (
        !this.mesh.palmtrees.material.userData.materialShader.uniforms.uDepth2
          .value
      ) {
        this.mesh.palmtrees.material.userData.materialShader.uniforms.uDepth2.value =
          new THREE.TextureLoader().load(
            'assets/textures/Grayscale2Palmtrees.jpg'
          )
      }
      this.mesh.palmtrees.material.userData.materialShader.uniforms.uColor.value =
        this.scene.background

      this.mesh.palmtrees.material.userData.materialShader.uniforms.uTime.value =
        this.app.timer
    }
    if (this.mesh.moon) {
      this.mesh.moon.material.userData.materialShader.uniforms.uHaloColor.value =
        this.scene.background
    }
  }
}
