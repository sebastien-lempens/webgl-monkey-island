import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js'
import Effects from './Effects'
import Animations from './Animations'
import { gsap } from 'gsap'

export default class Webgl {
	constructor() {
		this.app = window.app
		this.xr = this.app.xr
		this.params = this.app.params
		this.assetsLoaded = 0 // Incremented from class World.js
		this.assetsTotal = 40 // set this.debug to true to get Total Assets in console
		this.assetsLoadedProgress = 0 // %
		this.assetsProgressing = false
		this.mainTitleEl = document.querySelector('picture.reveal-main-title')
		this.mainTitleElshadow = document.querySelector(
			'picture.reveal-main-title-shadow'
		)
		this.initThree()
	}
	async initThree() {
		// Scene
		this.scene = new THREE.Scene()
		this.scene.background = new THREE.Color(
			this.app.params.scene.backgroundColor
		)
		//Loading Start here
		this.assetsProgressing = true

		if (this.xr) {
			// if VR Version enabled
			// based on https://github.com/mrdoob/three.js/blob/434774185e5938854452a3a507a3aa3b09108b50/examples/webxr_vr_postprocessing.html

			// Camera VR
			this.initCameraVR()
			// Lights
			this.initLights()
			// Renderer
			this.initRendererVR()
			// World
			await this.initWorld()
			//Effects
			this.initEffectsVR()
			//Animation
			this.initAnimations()
			// Resize Scene
			this.scene.position.set(0, 0, 0)
			this.scene.scale.addScalar(100)
		} else {
			// Otherwise, Screen version
			// Camera
			this.initCamera()
			// Lights
			this.initLights()
			// Renderer
			this.initRenderer()
			// World
			await this.initWorld()
			// Init OrbitControl
			this.initControls()
			//Effects
			this.initEffects()
			//Animation
			this.initAnimations()

			// Camera Sequence Animation
			if (this.app.debug) {
				this.params.camera.unlock = true
				this.params.camera.orbitControl = true
			} else {
				this.initSequenceAnimation()
			}
		}
		// Loading End here
	}
	async initControls() {
		if (this.renderer.domElement) {
			const { OrbitControls } = await import(
				'three/examples/jsm/controls/OrbitControls'
			)
			this.controls = new OrbitControls(this.camera, this.renderer.domElement)
			//	this.camera.position.set(...Object.values(this.params.camera.position))
			this.controls.enableDamping = true
			//Camera Look at Mesh
			const [mesh] = this.world.meshes.filter(({ name }) => name === 'Guybrush')
			const { x, y, z } = mesh.position.clone()
			this.controls.target = new THREE.Vector3(x, y + 0.02, z)
			this.controls.enabled = false
			this.controls.addEventListener('change', (e) => {
				// Options
				this.controls.enablePan = this.params.camera.unlock
				// Horizontal Rotation
				this.controls.minAzimuthAngle = this.params.camera.unlock
					? Infinity
					: -Math.PI / 2.5
				this.controls.maxAzimuthAngle = this.params.camera.unlock
					? Infinity
					: Math.PI / 2.2
				// Vertical Rotation
				this.controls.minPolarAngle = this.params.camera.unlock
					? 0
					: Math.PI / 4.2
				this.controls.maxPolarAngle = this.params.camera.unlock ? Math.PI : 1.65
				// Zoom limit
				this.controls.minDistance = this.params.camera.unlock ? 0 : 0.085
				this.controls.maxDistance = this.params.camera.unlock ? Infinity : 0.18
				// Update TweakPane
				this.params.camera.posXvalue = this.camera.position.x.toFixed(2)
				this.params.camera.posYvalue = this.camera.position.y.toFixed(2)
				this.params.camera.posZvalue = this.camera.position.z.toFixed(2)
				this.app.tweakPane.refresh()
			})
		}
	}
	initCamera() {
		this.camera = new THREE.PerspectiveCamera(
			55,
			window.innerWidth / window.innerHeight,
			0.01,
			500
		)
		this.camera.name = 'Camera'
		this.camera.position.set(...Object.values(this.params.camera.position))
		//	this.scene.add(this.camera)
		//	this.camera.rotation.order = 'YXZ'
		/**
		 * Camera Helper
		 */
		this.cameraHelper = new THREE.CameraHelper(this.camera)
		this.cameraHelper.visible = this.params.camera.helper
		this.scene.add(this.cameraHelper)
	}
	initCameraVR() {
		this.camera = new THREE.PerspectiveCamera(
			80,
			window.innerWidth / window.innerHeight,
			0.01,
			500
		)
		this.camera.name = 'CameraVR'
		this.camera.position.set(0, 0, 0)
	}
	async initRenderer() {
		this.clippingPlanes = [
			new THREE.Plane(
				new THREE.Vector3(0, 0, -0.0005),
				this.params.scene.reveal
			),
		]

		this.renderer = new THREE.WebGLRenderer({
			canvas: document.querySelector('canvas.webgl'),
			antialias: this.app.isMobile ? false : true,
		})
		this.renderer.setSize(window.innerWidth, window.innerHeight)
		if (this.app.isMobile) {
			this.renderer.setPixelRatio(window.devicePixelRatio / 2)
			this.renderer.domElement.style.imageRendering = 'pixelated'
		} else {
			this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
		}
		this.renderer.physicallyCorrectLights = true
		this.renderer.shadowMap.enabled = this.app.isMobile ? false : true
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
		this.renderer.clippingPlanes = this.clippingPlanes
		this.renderer.localClippingEnabled = true
		this.renderer.setAnimationLoop(() => this.update())
	}
	async initRendererVR() {
		this.renderer = new THREE.WebGLRenderer({
			canvas: document.querySelector('canvas.webgl'),
			antialias: false,
		})
		this.renderer.setSize(window.innerWidth, window.innerHeight)
		this.renderer.setPixelRatio(window.devicePixelRatio)
		this.renderer.xr.enabled = true
		this.renderer.physicallyCorrectLights = true
		this.renderer.shadowMap.enabled = true
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    await new Promise(resolve=>setTimeout(resolve,1000))
		document.body.appendChild(VRButton.createButton(this.renderer))
		this.renderer.setAnimationLoop(() => this.updateVR())
	}
	initSequenceAnimation() {
		const $this = this
		//Camera Look at Mesh
		const [mesh] = this.world.meshes.filter(({ name }) => name === 'Guybrush')
		const { x, y, z } = mesh.position.clone()
		this.camera.lookAt(new THREE.Vector3(x, y + 0.02, z))
		this.params.camera.unlock = true
		this.gsapTimeline = gsap.timeline()
		// Pixel Shader Animation

		// Clipping Scene animation
		gsap.to(this.clippingPlanes[0], {
			constant: 300,
			duration: 0,
			ease: 'power1.out',
			onComplete() {
				$this.params.scene.reveal = 300
			},
		})
		// Sequence Anim 1
		this.gsapTimeline.addLabel('sequence1')
		this.gsapTimeline.set(this.camera.position, {
			x: 0.05,
			y: 0.03,
			z: 0.2,
		})
		this.gsapTimeline.to(this.camera.position, {
			duration: 6,
			ease: 'none',
			x: 0.05,
			y: 0.02,
			z: 0.06,
		})
		// Sequence Anim 2
		this.gsapTimeline.addLabel('sequence2')
		this.gsapTimeline.set(this.camera.position, {
			x: 0.06,
			y: 0.06,
			z: -0.07,
		})
		this.gsapTimeline.to(this.camera.position, {
			onStart() {
				let { bokehPass } = $this.effects.effectComposer
				bokehPass.uniforms.aperture.value = 0.06
				bokehPass.uniforms.focus.value = 0.05
			},
			onComplete() {
				let { bokehPass } = $this.effects.effectComposer
				bokehPass.uniforms.aperture.value =
					$this.params.scene.effect.bokeh.aperture
				bokehPass.uniforms.focus.value = $this.params.scene.effect.bokeh.focus
			},
			duration: 4,
			ease: 'none',
			x: 0.085,
			y: 0.01,
			z: 0.025,
		})

		// Sequence Anim 3
		this.gsapTimeline.addLabel('sequence3')
		this.gsapTimeline.set(this.camera.position, {
			x: 0.1,
			y: 0.015,
			z: 0.1,
		})
		this.gsapTimeline.to(this.camera.position, {
			onStart() {
				$this.camera.lookAt(new THREE.Vector3(x, y + 0.02, z))
				$this.controls = null
				let { bokehPass } = $this.effects.effectComposer
				bokehPass.uniforms.aperture.value = 0.02
				bokehPass.uniforms.focus.value = 0.2
			},
			onComplete() {
				$this.initControls()
				let { bokehPass } = $this.effects.effectComposer
				bokehPass.uniforms.aperture.value =
					$this.params.scene.effect.bokeh.aperture
				bokehPass.uniforms.focus.value = $this.params.scene.effect.bokeh.focus
			},
			duration: 5,
			ease: 'none',
			x: 0.13,
			y: 0.015,
			z: 0.01,
		})
		// Sequence Anim 4
		this.gsapTimeline.addLabel('sequence4')
		this.gsapTimeline.set(this.camera.position, {
			x: -0.2,
			y: 0.02,
			z: 0.12,
		})
		this.gsapTimeline.to(this.camera.position, {
			duration: 8,
			x: 0.02,
			y: 0.03,
			z: 0.15,
			ease: 'power1.out',
			onStart() {
				let { bokehPass } = $this.effects.effectComposer
				bokehPass.uniforms.aperture.value = 0
			},
			onComplete() {
				$this.params.camera.orbitControl = true
				$this.params.camera.unlock = false
				$this.app.tweakPane.refresh()
				gsap.to($this.app.tweakPane.containerElem_, {
					opacity: 0.6,
					duration: 2,
				})
			},
		})
		/**
		 * Degug choose sequence start from
		 */
		//setTimeout(() => this.gsapTimeline.seek('sequence4'), 500)
	}
	initLights() {
		/**
		 * Ambiant Light
		 */
		this.ambiantLight = new THREE.AmbientLight(
			0xffffff,
			this.params.lights.ambiant.intensity
		)
		this.ambiantLight.color = new THREE.Color(this.params.lights.ambiant.color)
		this.ambiantLight.name = 'Ambiant Light'
		this.scene.add(this.ambiantLight)
		/**
		 * Spot Light
		 */
		this.spotLight = new THREE.SpotLight(
			new THREE.Color(this.params.lights.spot.color)
		)
		this.spotLight.name = 'Spot Light'
		this.spotLight.intensity = this.params.lights.spot.intensity
		this.spotLight.penumbra = this.params.lights.spot.penumbra
		this.spotLight.position.set(
			...Object.values(this.params.lights.spot.position)
		)
		this.spotLight.angle = this.params.lights.spot.angle
		this.spotLight.castShadow = true
		this.spotLight.shadow.mapSize.width = 256
		this.spotLight.shadow.mapSize.height = 256
		this.spotLight.shadow.camera.near = 0.5
		this.spotLight.shadow.camera.far = 2
		this.spotLight.shadow.camera.fov = 30

		this.scene.add(this.spotLight)

		this.spotLightHelper = new THREE.SpotLightHelper(this.spotLight)
		this.spotLightHelper.visible = this.params.lights.spot.helper
		this.scene.add(this.spotLightHelper)

		/**
		 * Points Light
		 */
		this.pointLight = new THREE.PointLight(0x00aaff, 1, 100)
		this.pointLight.color = new THREE.Color(this.params.lights.pointlight.color)
		this.pointLight.distance = this.params.lights.pointlight.distance
		this.pointLight.intensity = this.params.lights.pointlight.intensity
		this.pointLight.name = 'Point Light'
		//this.pointLight.castShadow = true
		this.pointLight.shadow.mapSize.width = 512
		this.pointLight.shadow.mapSize.height = 512
		this.pointLight.shadow.camera.near = 0.5
		this.pointLight.shadow.camera.far = 2
		this.pointLight.position.set(
			...Object.values(this.params.lights.pointlight.position)
		)
		this.pointLight.decay = this.params.lights.pointlight.decay
		this.pointLight.scale.setScalar(0.01)
		this.scene.add(this.pointLight)

		this.pointLightHelper = new THREE.PointLightHelper(this.pointLight)
		this.pointLightHelper.visible = this.params.lights.pointlight.helper
		this.scene.add(this.pointLightHelper)
		/**
		 * Points Light 2
		 */
		this.pointLight2 = new THREE.PointLight(0x00aaff, 1, 100)
		this.pointLight2.color = new THREE.Color(
			this.params.lights.pointlight.color
		)
		this.pointLight2.distance = this.params.lights.pointlight.distance
		this.pointLight2.intensity = this.params.lights.pointlight.intensity
		this.pointLight2.decay = this.params.lights.pointlight.decay
		this.pointLight2.name = 'Point Light 2'
		this.pointLight2.castShadow = true
		this.pointLight2.position.set(
			...Object.values(this.params.lights.pointlight2.position)
		)
		this.pointLight2.scale.setScalar(0.01)
		this.scene.add(this.pointLight2)
		this.pointLight2helper = new THREE.PointLightHelper(this.pointLight2)
		this.pointLight2helper.visible = this.params.lights.pointlight2.helper
		this.scene.add(this.pointLight2helper)
	}
	async initWorld() {
		const { default: World } = await import('./World.js')
		this.world = new World()
		await this.world.init()
		this.controls
			? (this.controls.target = new THREE.Vector3(x, y + 0.02, z))
			: null
	}
	async initEffects() {
		this.composer = new EffectComposer(this.renderer)
		const renderPass = new RenderPass(this.scene, this.camera)
		this.composer.addPass(renderPass)
		this.effects = new Effects()
	}
	async initEffectsVR() {

		this.composer = new EffectComposer(this.renderer)
		this.effects = new Effects()
		this.scene.onAfterRender = () => {
			this.composer.render()
		}
	}
	async initAnimations() {
		this.animations = new Animations()
	}
	updateLoadTitle() {
		this.assetsLoadedProgress =
			100 - (this.assetsLoaded / this.assetsTotal) * 100
		if (this.assetsProgressing) {
			this.mainTitleEl.style.clipPath = `inset(0 ${this.assetsLoadedProgress}% 0 0)`
		}
		if (this.assetsLoadedProgress === 0) {
			this.mainTitleElshadow.remove()
			this.assetsProgressing = false
		}
	}
	update() {
		this.app.timer = this.app.clock.getElapsedTime()
		if (this.assetsProgressing) {
			this.updateLoadTitle()
		}
		if (this.composer) {
			this.composer.render()
			if (this.effects) this.effects.update()
			if (this.animations) this.animations.update()
		}
		if (this.controls) {
			this.controls.update()
		}
	}
	updateVR() {
		this.app.timer = this.app.clock.getElapsedTime()
		if (this.assetsProgressing) {
			this.updateLoadTitle()
		}
		this.renderer.render(this.scene, this.camera)
	}
	resize() {
		// Update sizes
		const width = window.innerWidth
		const height = window.innerHeight

		// Update camera
		this.camera.aspect = width / height
		this.camera.updateProjectionMatrix()

		// Update renderer
		this.renderer.setSize(width, height)
		this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
		this.composer.setSize(width, height)
		this.composer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
	}
}
