import * as THREE from 'three'

export class Vegetation {
  constructor(scene) {
    this.scene = scene
    this.treeMeshes = []
    this.grassMesh = null
    this._time = 0
  }

  generate(getHeightAt) {
    this._spawnTrees(getHeightAt)
    this._spawnBushes(getHeightAt)
    this._spawnDistantMountains()
  }

  _spawnTrees(getHeightAt) {
    // Use instanced meshes for trunks and canopies
    const trunkGeo = new THREE.CylinderGeometry(0.3, 0.5, 6, 5)
    const trunkMat = new THREE.MeshLambertMaterial({ color: 0x4a3728 })
    const trunkMesh = new THREE.InstancedMesh(trunkGeo, trunkMat, 1500)
    trunkMesh.castShadow = true
    trunkMesh.receiveShadow = true

    const canopyGeo = new THREE.SphereGeometry(2.5, 6, 5)
    const canopyMat = new THREE.MeshLambertMaterial({ color: 0x1e4d2b })
    const canopyMesh = new THREE.InstancedMesh(canopyGeo, canopyMat, 1500)
    canopyMesh.castShadow = true
    canopyMesh.receiveShadow = true

    const dummy = new THREE.Object3D()
    let count = 0

    while (count < 1500) {
      const x = (Math.random() - 0.5) * 1600
      const z = (Math.random() - 0.5) * 1600
      const distFromOrigin = Math.sqrt(x * x + z * z)

      // Forest biome only
      if (distFromOrigin < 300 || distFromOrigin > 750 || z > 450) {
        continue
      }

      const trunkH = 4 + Math.random() * 4
      const y = getHeightAt ? getHeightAt(x, z) : 0

      // Trunk
      dummy.position.set(x, y + trunkH / 2, z)
      dummy.rotation.y = Math.random() * Math.PI * 2
      dummy.rotation.z = (Math.random() - 0.5) * 0.1
      dummy.scale.set(1, trunkH / 6, 1)
      dummy.updateMatrix()
      trunkMesh.setMatrixAt(count, dummy.matrix)

      // Canopy
      dummy.position.set(x, y + trunkH + 1.5, z)
      dummy.rotation.set(0, Math.random() * Math.PI * 2, 0)
      const s = 0.8 + Math.random() * 0.5
      dummy.scale.set(s, s * 0.9, s)
      dummy.updateMatrix()
      canopyMesh.setMatrixAt(count, dummy.matrix)

      count++
    }

    trunkMesh.instanceMatrix.needsUpdate = true
    canopyMesh.instanceMatrix.needsUpdate = true
    this.scene.add(trunkMesh)
    this.scene.add(canopyMesh)
    this.treeMeshes = [trunkMesh, canopyMesh]
  }

  _spawnBushes(getHeightAt) {
    const bushGeo = new THREE.SphereGeometry(0.5, 5, 4)
    const bushMat = new THREE.MeshLambertMaterial({ color: 0x2d5a27 })
    const bushMesh = new THREE.InstancedMesh(bushGeo, bushMat, 400)

    const dummy = new THREE.Object3D()
    for (let i = 0; i < 400; i++) {
      const angle = Math.random() * Math.PI * 2
      const r = 50 + Math.random() * 200
      const x = Math.cos(angle) * r
      const z = Math.sin(angle) * r
      const y = getHeightAt ? getHeightAt(x, z) : 0

      dummy.position.set(x, y + 0.4, z)
      dummy.rotation.y = Math.random() * Math.PI * 2
      const s = 0.7 + Math.random() * 0.6
      dummy.scale.set(s, s, s)
      dummy.updateMatrix()
      bushMesh.setMatrixAt(i, dummy.matrix)
    }
    bushMesh.instanceMatrix.needsUpdate = true
    this.scene.add(bushMesh)
  }

  _spawnDistantMountains() {
    // Cone geometry for far mountains
    for (let i = 0; i < 10; i++) {
      const x = (Math.random() - 0.5) * 800
      const z = 500 + Math.random() * 300
      const h = 60 + Math.random() * 80
      const r = 30 + Math.random() * 30

      const geo = new THREE.ConeGeometry(r, h, 8)
      const mat = new THREE.MeshLambertMaterial({ color: 0x7a6b55 })
      const mountain = new THREE.Mesh(geo, mat)
      mountain.position.set(x, h / 2, z)
      this.scene.add(mountain)

      // Snow cap
      const capGeo = new THREE.SphereGeometry(r * 0.35, 6, 4)
      const capMat = new THREE.MeshLambertMaterial({ color: 0xe8e8e8 })
      const cap = new THREE.Mesh(capGeo, capMat)
      cap.position.set(x, h * 0.7, z)
      this.scene.add(cap)
    }
  }

  update(delta) {
    this._time += delta
  }

  dispose() {
    this.treeMeshes.forEach(m => {
      this.scene.remove(m)
      m.geometry.dispose()
      m.material.dispose()
    })
  }
}
