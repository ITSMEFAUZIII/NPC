import * as THREE from 'three'

export class Dungeon {
  constructor(scene) {
    this.scene = scene
    this.group = new THREE.Group()
  }

  build() {
    const stoneMat = new THREE.MeshLambertMaterial({ color: 0x4a4040 })

    // Entrance arch
    const archLeft = new THREE.Mesh(new THREE.BoxGeometry(1, 5, 1), stoneMat)
    archLeft.position.set(-2, 2.5, 0)
    this.group.add(archLeft)

    const archRight = archLeft.clone()
    archRight.position.set(2, 2.5, 0)
    this.group.add(archRight)

    const archTop = new THREE.Mesh(new THREE.BoxGeometry(5, 1, 1), stoneMat)
    archTop.position.y = 5.5
    this.group.add(archTop)

    // Torus arch
    const torus = new THREE.Mesh(
      new THREE.TorusGeometry(2, 0.3, 4, 8, Math.PI),
      stoneMat
    )
    torus.rotation.z = Math.PI
    torus.position.y = 5.5
    this.group.add(torus)

    // Dark interior hint
    const darkness = new THREE.Mesh(
      new THREE.PlaneGeometry(3.5, 5),
      new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide })
    )
    darkness.position.set(0, 2.5, -0.5)
    this.group.add(darkness)

    // Eerie green torch
    const torchLight = new THREE.PointLight(0x00ff44, 1, 8)
    torchLight.position.set(2.5, 4, 0.5)
    this.group.add(torchLight)

    this.group.position.set(200, -5, 350)
    this.scene.add(this.group)
    return this.group
  }
}
