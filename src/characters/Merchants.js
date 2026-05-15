import * as THREE from 'three'

export class Merchants {
  constructor(scene) {
    this.scene = scene
    this.merchants = []
  }

  spawnMerchant(position) {
    const group = new THREE.Group()
    const mat = new THREE.MeshLambertMaterial({ color: 0xa07850 })
    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.22, 0.75, 4, 6), mat)
    body.position.y = 0.65
    group.add(body)
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.19, 7, 5), new THREE.MeshLambertMaterial({ color: 0xc4a070 }))
    head.position.y = 1.55
    group.add(head)
    // Hat
    const hat = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 0.4, 8), new THREE.MeshLambertMaterial({ color: 0x2a4010 }))
    hat.position.y = 1.8
    group.add(hat)

    group.position.copy(position)
    this.scene.add(group)
    this.merchants.push({ group, position: position.clone() })
    return group
  }
}
