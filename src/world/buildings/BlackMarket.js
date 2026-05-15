import * as THREE from 'three'

export class BlackMarket {
  constructor(scene) {
    this.scene = scene
    this.group = new THREE.Group()
    this.interactables = []
  }

  build() {
    // Underground chamber below tavern, 15 units down
    this.group.position.set(-50, -15, 10)

    // Floor
    const floor = new THREE.Mesh(
      new THREE.BoxGeometry(20, 0.2, 20),
      new THREE.MeshLambertMaterial({ color: 0x2a2018 })
    )
    floor.position.y = 0.1
    this.group.add(floor)

    // Stone walls
    const stoneMat = new THREE.MeshLambertMaterial({ color: 0x3a3028 })
    const wallData = [
      [20, 4, 0.2, 0, 2, -10], [20, 4, 0.2, 0, 2, 10],
      [0.2, 4, 20, -10, 2, 0], [0.2, 4, 20, 10, 2, 0]
    ]
    wallData.forEach(([w, h, d, x, y, z]) => {
      const wall = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), stoneMat)
      wall.position.set(x, y, z)
      this.group.add(wall)
    })

    // Low ceiling
    const ceiling = new THREE.Mesh(
      new THREE.BoxGeometry(20, 0.2, 20),
      stoneMat
    )
    ceiling.position.y = 4
    this.group.add(ceiling)

    // Red dim lighting
    const redLight = new THREE.PointLight(0x8b0000, 1.5, 25)
    redLight.position.set(0, 3, 0)
    this.group.add(redLight)

    const secondLight = new THREE.PointLight(0x440000, 1, 15)
    secondLight.position.set(-5, 2.5, -3)
    this.group.add(secondLight)

    // 3 vendor stalls with hooded figures (no faces)
    this._addVendorStalls()

    // Descend tunnel
    this._buildTunnel()

    this.group.visible = false // Hidden until discovered
    this.scene.add(this.group)
    return this.group
  }

  _addVendorStalls() {
    const hoodMat = new THREE.MeshLambertMaterial({ color: 0x1a1a1a })
    const stallMat = new THREE.MeshLambertMaterial({ color: 0x3a2818 })

    const stallPositions = [[-5, 0, -6], [0, 0, -7], [5, 0, -6]]
    stallPositions.forEach(([sx, sy, sz], idx) => {
      // Counter
      const counter = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.9, 0.7), stallMat)
      counter.position.set(sx, 0.45, sz)
      this.group.add(counter)

      // Hooded figure (no face — just geometry)
      const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.25, 0.8, 4, 8), hoodMat)
      body.position.set(sx, 1.2, sz - 0.8)
      this.group.add(body)

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 6), hoodMat)
      head.position.set(sx, 2.1, sz - 0.8)
      this.group.add(head)

      // Hood (cone)
      const hood = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.45, 8), hoodMat)
      hood.position.set(sx, 2.5, sz - 0.9)
      hood.rotation.z = 0.3
      this.group.add(hood)

      // Goods on counter
      for (let i = 0; i < 3; i++) {
        const good = new THREE.Mesh(
          new THREE.BoxGeometry(0.2, 0.25, 0.15),
          new THREE.MeshLambertMaterial({ color: [0x1a3a5c, 0x5a1a1a, 0x1a4a1a][i] })
        )
        good.position.set(sx - 0.4 + i * 0.4, 1.0, sz + 0.05)
        this.group.add(good)
      }

      this.interactables.push({
        id: 'vendor_' + idx,
        vendorIndex: idx,
        worldPos: new THREE.Vector3(-50 + sx, -15, 10 + sz),
        range: 2,
        prompt: 'Trade',
        actionType: 'trade_black_market'
      })
    })

    // Shelves with suspicious goods
    const shelfMat = new THREE.MeshLambertMaterial({ color: 0x2a1808 })
    for (let row = 0; row < 2; row++) {
      const shelf = new THREE.Mesh(new THREE.BoxGeometry(8, 0.06, 0.25), shelfMat)
      shelf.position.set(0, 1.5 + row * 0.8, 9)
      this.group.add(shelf)
    }
  }

  _buildTunnel() {
    const tunnelMat = new THREE.MeshLambertMaterial({ color: 0x2a2018 })
    // Tunnel going up (connecting to tavern trapdoor)
    for (let i = 0; i < 15; i++) {
      const section = new THREE.Mesh(
        new THREE.BoxGeometry(2, 2, 0.5),
        tunnelMat
      )
      section.position.set(3.5, i, 5 - i * 0.5)
      this.group.add(section)
    }
  }

  show() {
    this.group.visible = true
  }

  getInteractables() {
    return this.interactables
  }
}
