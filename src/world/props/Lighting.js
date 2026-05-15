import * as THREE from 'three'

export class WorldLighting {
  constructor(scene) {
    this.scene = scene
    this.torches = []
    this._time = 0
  }

  createTorch(position) {
    const light = new THREE.PointLight(0xf59e0b, 0.8, 8)
    light.position.copy(position)
    light._baseIntensity = 0.8
    light._flickerFreq = 2 + Math.random() * 4
    light._flickerPhase = Math.random() * Math.PI * 2
    light.visible = false // lit at dusk
    this.scene.add(light)
    this.torches.push(light)

    // Torch geometry
    const poleGeo = new THREE.CylinderGeometry(0.04, 0.04, 2, 4)
    const poleMat = new THREE.MeshLambertMaterial({ color: 0x4a3728 })
    const pole = new THREE.Mesh(poleGeo, poleMat)
    pole.position.copy(position)
    pole.position.y += 1
    this.scene.add(pole)

    return light
  }

  addVillageTorches() {
    const positions = [
      new THREE.Vector3(-52, 2.5, 8),
      new THREE.Vector3(-48, 2.5, 12),
      new THREE.Vector3(-2, 2.5, -2),
      new THREE.Vector3(2, 2.5, 2),
      new THREE.Vector3(18, 2.5, -17),
      new THREE.Vector3(28, 2.5, 18),
      new THREE.Vector3(-32, 2.5, -38),
      new THREE.Vector3(-28, 2.5, -42),
    ]
    positions.forEach(p => this.createTorch(p))
  }

  setTimeOfDay(phase) {
    const isNight = phase === 'night'
    const isDusk = phase === 'dusk'
    const lit = isNight || isDusk
    this.torches.forEach(t => { t.visible = lit })
  }

  update(delta) {
    this._time += delta
    this.torches.forEach(t => {
      if (!t.visible) return
      t.intensity = t._baseIntensity +
        Math.sin(this._time * t._flickerFreq + t._flickerPhase) * 0.2
    })
  }
}
