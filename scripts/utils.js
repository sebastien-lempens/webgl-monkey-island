import * as THREE from 'three'
import { Pane } from 'tweakpane'

const getMeshSize = (mesh) => {
	return new THREE.Box3().setFromObject(mesh).getSize(mesh.position.clone())
}
const getTweakPane = (ctx) => {
	ctx.gui = new Pane()
	ctx.gui.containerElem_.style.width = '400px'
	/**
	 * Pane Scene
	 */
	const paneScene = ctx.gui.addFolder({
		title: 'Scene',
		expanded: false,
	})
	// Background Color
	paneScene
		.addInput(ctx.params.scene, 'backgroundColor', {
			label: 'Background Color',
		})
		.on('change', ({ value }) => {
			ctx.scene.background = new THREE.Color(value)
		})
	//ClipPane
	paneScene
		.addInput(ctx.params.scene, 'reveal', {
			min: -500,
			max: 300,
			step: 0.001,
			label: 'Reveal Scene',
		})
		.on('change', ({ value }) => {
			const [plane] = ctx.webgl.clippingPlanes
			ctx.webgl.clippingPlanes[0].constant = value
		})
	// Effect: Bloom
	paneScene
		.addInput(ctx.params.scene.effect.bloom, 'strength', {
			label: 'Bloom strength',
			min: 0,
			max: 1,
			step: 0.001,
		})
		.on('change', ({ value }) => {
			const {
				effectComposer: { bloomPass },
			} = ctx
			bloomPass.strength = value
		})
	paneScene
		.addInput(ctx.params.scene.effect.bloom, 'radius', {
			label: 'Bloom radius',
			min: 0,
			max: 2,
			step: 0.001,
		})
		.on('change', ({ value }) => {
			const {
				effectComposer: { bloomPass },
			} = ctx
			bloomPass.radius = value
		})
	paneScene
		.addInput(ctx.params.scene.effect.bloom, 'threshold', {
			label: 'Bloom threshold',
			min: 0,
			max: 0.5,
			step: 0.0001,
		})
		.on('change', ({ value }) => {
			const {
				effectComposer: { bloomPass },
			} = ctx
			bloomPass.threshold = value
		})
	ctx.gui.addSeparator()
	// Effect : Bokeh
	paneScene
		.addInput(ctx.params.scene.effect.bokeh, 'aperture', {
			label: 'Bokeh Aperture',
			min: 0,
			max: 0.1,
			step: 0.00001,
		})
		.on('change', ({ value }) => {
			const {
				effectComposer: { bokehPass },
			} = ctx
			bokehPass.uniforms.aperture.value = value
		})
	paneScene
		.addInput(ctx.params.scene.effect.bokeh, 'focus', {
			label: 'Bokeh Focus',
			min: 0,
			max: 1,
			step: 0.0001,
		})
		.on('change', ({ value }) => {
			const {
				effectComposer: { bokehPass },
			} = ctx
			bokehPass.uniforms.focus.value = value
		})
	ctx.gui.addSeparator()
	/**
	 * Pane Camera
	 */
	const paneCamera = ctx.gui.addFolder({
		title: 'Camera',
		expanded: false,
	})
	paneCamera
		.addInput(ctx.params.camera, 'orbitControl', {
			label: 'OrbitControl: Enable',
		})
		.on('change', ({ value }) => {
			const { controls } = ctx.webgl
			controls.enabled = value
		})

	paneCamera.addInput(ctx.params.camera, 'unlock', {
		label: 'OrbitControl: Disable Restrictions',
	})

	paneCamera.addInput(ctx.params.camera, 'posXvalue')
	paneCamera.addInput(ctx.params.camera, 'posYvalue')
	paneCamera.addInput(ctx.params.camera, 'posZvalue')

	ctx.gui.addSeparator()
	/**
	 * Pane Lights
	 */
	const paneLights = ctx.gui.addFolder({
		title: 'Lights',
		expanded: false,
	})
	// Ambiant Light
	paneLights
		.addInput(ctx.params.lights.ambiant, 'color', {
			label: 'Ambiant Color',
		})
		.on('change', ({ value }) => {
			ctx.webgl.ambiantLight.color = new THREE.Color(value)
		})
	paneLights
		.addInput(ctx.params.lights.ambiant, 'intensity', {
			label: 'Ambiant Intensity',
			min: 0,
			max: 8,
			step: 0.01,
		})
		.on('change', ({ value }) => {
			ctx.webgl.ambiantLight.intensity = value
		})
	paneLights.addSeparator()
	//Spot Light Color
	paneLights
		.addInput(ctx.params.lights.spot, 'color', {
			label: 'Spot Light Color',
		})
		.on('change', ({ value }) => {
			ctx.webgl.spotLight.color = new THREE.Color(value)
		})
	//Spot Light Intensity
	paneLights
		.addInput(ctx.params.lights.spot, 'intensity', {
			label: 'Spot Light Intensity',
			min: 0,
			max: 4,
			step: 0.01,
		})
		.on('change', ({ value }) => {
			ctx.webgl.spotLight.intensity = value
		})
	//Spot Light Angle
	paneLights
		.addInput(ctx.params.lights.spot, 'angle', {
			label: 'Spot Light angle',
			min: 0,
			max: 0.2,
			step: 0.001,
		})
		.on('change', ({ value }) => {
			ctx.webgl.spotLight.angle = value
		})
	//Spot Light Penumbra
	paneLights
		.addInput(ctx.params.lights.spot, 'penumbra', {
			label: 'Spot Light penumbra',
			min: 0,
			max: 1,
			step: 0.01,
		})
		.on('change', ({ value }) => {
			ctx.webgl.spotLight.penumbra = value
		})
	// Sport Light Position
	paneLights
		.addInput(ctx.params.lights.spot, 'position', {
			x: { min: -2, max: 2, step: 0.001 },
			y: { min: -2, max: 2, step: 0.001 },
			z: { min: -2, max: 2, step: 0.001 },
			label: 'Spot Light Position',
		})
		.on('change', ({ value }) => {
			ctx.webgl.spotLight.position.set(...Object.values(value))
		})

	//Spot Light Helper
	paneLights
		.addInput(ctx.params.lights.spot, 'helper', {
			label: 'Spot Light Helper',
		})
		.on('change', ({ value }) => {
			ctx.webgl.spotLightHelper.visible = value
		})
	paneLights.addSeparator()
	// Point Light Color
	paneLights
		.addInput(ctx.params.lights.pointlight, 'color', {
			label: 'Point Light Color',
		})
		.on('change', ({ value }) => {
			ctx.webgl.pointLight.color = new THREE.Color(value)
			ctx.webgl.pointLight2.color = new THREE.Color(value)
		})
	// Point Light Distance
	paneLights
		.addInput(ctx.params.lights.pointlight, 'distance', {
			min: 0.1,
			max: 2,
			step: 0.01,
			label: 'Point Light Distance',
		})
		.on('change', ({ value }) => {
			ctx.webgl.pointLight.distance = value
			ctx.webgl.pointLight2.distance = value
		})
	// Point Light Decay
	paneLights
		.addInput(ctx.params.lights.pointlight, 'decay', {
			min: 0,
			max: 2,
			step: 0.01,
			label: 'Point Light Decay',
		})
		.on('change', ({ value }) => {
			ctx.webgl.pointLight.decay = value
			ctx.webgl.pointLight2.decay = value
		})
	// Point Light Position
	paneLights
		.addInput(ctx.params.lights.pointlight, 'position', {
			x: { min: -1, max: 1, step: 0.001 },
			y: { min: -1, max: 1, step: 0.001 },
			z: { min: -1, max: 1, step: 0.001 },
			label: 'Point Light Position',
		})
		.on('change', ({ value }) => {
			ctx.webgl.pointLight.position.set(...Object.values(value))
		})
	// Point Light Intensity
	paneLights
		.addInput(ctx.params.lights.pointlight, 'intensity', {
			min: 0,
			max: 1,
			step: 0.001,
			label: 'Point Light Intensity',
		})
		.on('change', ({ value }) => {
			ctx.webgl.pointLight.intensity = value
			ctx.webgl.pointLight2.intensity = value
		})

	// Point Light Helper
	paneLights
		.addInput(ctx.params.lights.pointlight, 'helper', {
			label: 'Point Light Helper',
		})
		.on('change', ({ value }) => {
			ctx.webgl.pointLightHelper.visible = value
		})

	// Point Light Position
	paneLights
		.addInput(ctx.params.lights.pointlight2, 'position', {
			x: { min: -1, max: 1, step: 0.001 },
			y: { min: -1, max: 1, step: 0.001 },
			z: { min: -1, max: 1, step: 0.001 },
			label: 'Point Light 2 Position',
		})
		.on('change', ({ value }) => {
			ctx.webgl.pointLight2.position.set(...Object.values(value))
		})

	// Point Light 2 Helper
	paneLights
		.addInput(ctx.params.lights.pointlight2, 'helper', {
			label: 'Point Light 2 Helper',
		})
		.on('change', ({ value }) => {
			ctx.webgl.pointLight2helper.visible = value
		})

	return ctx.gui
}
export { getMeshSize, getTweakPane }
