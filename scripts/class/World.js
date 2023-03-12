import * as THREE from 'three'
export default class World {
	constructor() {
		this.app = window.app
		this.scene = this.app.webgl.scene
		this.meshes = null
		this.textures = null
	}
	async init() {
		await this.loadModel()
		await this.loadTextures()
		await this.setMaterial()
		await this.setCastShadow()
		this.scene.add(...this.meshes)
		this.app.debug &&
			console.info(`Total assets to load: ${this.app.webgl.assetsLoaded}`)
	}
	async loadModel() {
		const { GLTFLoader } = await import(
			'three/examples/jsm/loaders/GLTFLoader.js'
		)
		const { DRACOLoader } = await import(
			'three/examples/jsm/loaders/DRACOLoader.js'
		)
		await new Promise((resolve) => {
			const dracoLoader = new DRACOLoader()
			dracoLoader.setDecoderPath('draco/')
			const gltfLoader = new GLTFLoader()
			gltfLoader.setDRACOLoader(dracoLoader)
			gltfLoader.load(
				'assets/gltf/monkey-island-tribute-foreground-draco.gltf',
				async ({ scene }) => {
					const meshes_foreground = [...scene.children]
					this.meshes = meshes_foreground
					this.app.webgl.assetsLoaded++
					gltfLoader.load(
						'assets/gltf/monkey-island-tribute-background-draco.gltf',
						async ({ scene }) => {
							const meshes_background = [...scene.children]
							this.meshes = [...meshes_foreground, ...meshes_background]
							this.app.webgl.assetsLoaded++
							resolve()
						}
					)
				}
			)
		})
	}
	async loadTextures() {
		this.textures = {}
		for (const { name: key } of this.meshes) {
			this.textures[key] = {}
			await new Promise((resolve) => {
				new THREE.TextureLoader().load(
					`assets/textures/BaseColor${key}.jpg`,
					(texture) => {
						//	texture.magFilter = THREE.NearestFilter
						//texture.minFilter = THREE.NearestFilter
						texture.wrapS = texture.wrapT = THREE.RepeatWrapping
						texture.repeat.y = -1
						Object.assign(this.textures[key], { color: texture })
						this.app.webgl.assetsLoaded++
						resolve()
					},
					(progress) => {},
					(error) => {
						console.error(`Image "BaseColor${key}.jpg" non chargée`)
						console.info(error)
					}
				)
			})
			if (key === 'Clouds' || key === 'Moon' || key === 'Vegetation') {
				Object.assign(this.textures[key], { roughness: false })
				Object.assign(this.textures[key], { normal: false })
			} else {
				await new Promise((resolve) => {
					new THREE.TextureLoader().load(
						`assets/textures/Roughness${key}.jpg`,
						(texture) => {
							//texture.magFilter = THREE.NearestFilter
							//texture.minFilter = THREE.NearestFilter
							texture.wrapS = texture.wrapT = THREE.RepeatWrapping
							texture.repeat.y = -1
							Object.assign(this.textures[key], { roughness: texture })
							this.app.webgl.assetsLoaded++
							resolve()
						},
						(progress) => {},
						(error) => {
							console.error(`Image "Roughness${key}.jpg" non chargée`)
							console.info(error)
						}
					)
				})
				await new Promise((resolve) => {
					new THREE.TextureLoader().load(
						`assets/textures/Normal${key}.jpg`,
						(texture) => {
							//texture.magFilter = THREE.NearestFilter
							//texture.minFilter = THREE.NearestFilter
							texture.wrapS = texture.wrapT = THREE.RepeatWrapping
							texture.repeat.y = -1
							Object.assign(this.textures[key], { normal: texture })
							this.app.webgl.assetsLoaded++
							resolve()
						},
						(progress) => {},
						(error) => {
							console.error(`Image "Normal${key}.jpg" non chargée`)
							console.info(error)
						}
					)
				})
			}
		}
	}
	async setCastShadow() {
		this.meshes.forEach((mesh) => {
			if (
				mesh.name === 'Sea' ||
				mesh.name === 'Shores' ||
				mesh.name === 'Raft'
			) {
				mesh.receiveShadow = true
			}
			if (
				mesh.name === 'Monkey' ||
				mesh.name === 'Shores' ||
				mesh.name === 'Palmtrees' ||
				mesh.name === 'Trunk' ||
				mesh.name === 'Rocks' ||
				mesh.name === 'Raft' ||
				mesh.name === 'Guybrush'
			) {
				mesh.castShadow = true
			}
		})
	}
	async setMaterial() {
		for (let mesh of this.meshes) {
			await new Promise((resolve) => {
				const { name } = mesh
				mesh.material && mesh.material.dispose()
				if (name === 'Clouds' || name === 'Moon') {
					mesh.material = new THREE.MeshBasicMaterial({
						side: THREE.DoubleSide,
						map: this.textures[name].color,
					})
				} else {
					mesh.material = new THREE.MeshStandardMaterial({
						side: THREE.DoubleSide,
						map: this.textures[name].color,
						normalMap: this.textures[name].normal,
						roughnessMap: this.textures[name].roughness,
					})
				}
				resolve()
			})
		}
	}
}
