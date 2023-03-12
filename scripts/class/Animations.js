export default class Animations {
	constructor() {
		this.app = window.app
		this.light1 = this.app.webgl.pointLight
		this.light2 = this.app.webgl.pointLight2
		this.meshes = this.app.webgl.world.meshes
	} 

	moveLight() {
		let { x: x1, y: y1, z: z1 } = this.light1.position
		this.light1.position.x = x1 + Math.cos(this.app.timer * 10) * 0.005 * 0.05
		this.light1.position.y = y1 + Math.sin(this.app.timer * 20) * 0.005 * 0.1
		this.light1.position.z = z1 + Math.sin(this.app.timer * 30) * 0.005 * 0.1

		let { x: x2, y: y2, z: z2 } = this.light2.position
		this.light2.position.x = x2 + Math.cos(this.app.timer * 10) * 0.005 * 0.05
		this.light2.position.y = y2 + Math.sin(this.app.timer * 20) * 0.005 * 0.1
		this.light2.position.z = z2 + Math.sin(this.app.timer * 30) * 0.005 * 0.1
	}
	moveRaft() {
		const [raft] = this.meshes.filter((mesh) => mesh.name === 'Raft')
		let { y } = raft.position
		let { x: rx, y: ry, z: rz } = raft.rotation
		raft.position.y = y + Math.sin(this.app.timer) * 0.0001 * 0.05
		raft.rotation.x = rx + Math.sin(this.app.timer) * 0.001 * 0.05
		raft.rotation.z = rz + Math.sin(this.app.timer) * 0.001 * 0.5
	}
	moveGuybrush() {
		const [guybrush] = this.meshes.filter((mesh) => mesh.name === 'Guybrush')
		let { y } = guybrush.position
		let { x: rx, y: ry, z: rz } = guybrush.rotation
		guybrush.position.y = y + Math.sin(this.app.timer) * 0.0001 * 0.025
		guybrush.rotation.x = rx + Math.sin(this.app.timer) * 0.001 * 0.025
		guybrush.rotation.z = rz + Math.sin(this.app.timer) * 0.001 * 0.25
	}
	moveTrunk() {
		const [trunk] = this.meshes.filter((mesh) => mesh.name === 'Trunk')
		let { x, y, z } = trunk.position
		let { x: rx, y: ry, z: rz } = trunk.rotation
		trunk.position.y = y + Math.sin(this.app.timer) * 0.0001 * 0.05
		trunk.rotation.x = rx + Math.sin(this.app.timer) * 0.001 * 0.3
		trunk.rotation.y = ry - Math.sin(this.app.timer) * 0.001 * 0.3
		trunk.rotation.z = rz + Math.sin(this.app.timer) * 0.001 * 0.5
	}
	update() {
		this.moveLight()
		this.moveRaft()
		this.moveTrunk()
		this.moveGuybrush()   
	}
}
