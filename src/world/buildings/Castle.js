import * as THREE from 'three'

export class Castle {
  constructor(scene) {
    this.scene = scene
    this.group = new THREE.Group()
    this.darkLordLight = null
    this._time = 0
  }

  build() {
    this._buildCastle()
    this.group.position.set(800, 120, 600)
    this.scene.add(this.group)
    return this.group
  }

  _buildCastle() {
    const stoneMat = new THREE.MeshLambertMaterial({ color: 0x5a5a6e })
    const darkStoneMat = new THREE.MeshLambertMaterial({ color: 0x404050 })

    // Main keep
    const keep = new THREE.Mesh(new THREE.BoxGeometry(30, 40, 30), stoneMat)
    keep.position.y = 20
    keep.castShadow = true
    this.group.add(keep)

    // 4 corner towers
    const towerPositions = [[-18, 0, -18], [18, 0, -18], [-18, 0, 18], [18, 0, 18]]
    towerPositions.forEach(([tx, ty, tz]) => {
      const tower = new THREE.Mesh(new THREE.CylinderGeometry(5, 6, 50, 8), stoneMat)
      tower.position.set(tx, 25, tz)
      tower.castShadow = true
      this.group.add(tower)

      // Battlements
      for (let i = 0; i < 8; i++) {
        const cren = new THREE.Mesh(
          new THREE.BoxGeometry(2, 2, 2),
          darkStoneMat
        )
        const angle = (i / 8) * Math.PI * 2
        cren.position.set(tx + Math.cos(angle) * 5, 51.5, tz + Math.sin(angle) * 5)
        this.group.add(cren)
      }
    })

    // Dark Lord's tallest tower (with purple glow)
    const dlTower = new THREE.Mesh(new THREE.CylinderGeometry(4, 5, 65, 8), darkStoneMat)
    dlTower.position.set(0, 32, -20)
    dlTower.castShadow = true
    this.group.add(dlTower)

    // Purple glow light
    this.darkLordLight = new THREE.PointLight(0x8800ff, 3, 400)
    this.darkLordLight.position.set(0, 70, -20)
    this.group.add(this.darkLordLight)

    // Courtyard walls
    const wallH = 15
    const wallData = [
      { w: 50, d: 1.5, pos: [0, wallH / 2, -30] },
      { w: 50, d: 1.5, pos: [0, wallH / 2, 30] },
      { w: 1.5, d: 60, pos: [-30, wallH / 2, 0] },
      { w: 1.5, d: 60, pos: [30, wallH / 2, 0] }
    ]
    wallData.forEach(({ w, d, pos }) => {
      const wall = new THREE.Mesh(new THREE.BoxGeometry(w, wallH, d), stoneMat)
      wall.position.set(...pos)
      this.group.add(wall)
    })

    // Gate / drawbridge
    const gate = new THREE.Mesh(
      new THREE.PlaneGeometry(8, 12),
      new THREE.MeshLambertMaterial({ color: 0x5c3d1e, side: THREE.DoubleSide })
    )
    gate.position.set(0, 6, 30)
    gate.rotation.x = -0.1
    this.group.add(gate)
  }

  update(delta, darkLordPower = 40) {
    this._time += delta
    if (this.darkLordLight) {
      const basePower = (darkLordPower / 100) * 3
      this.darkLordLight.intensity = basePower + Math.sin(this._time * 1.5) * 0.5
    }
  }

  setDefeated() {
    if (this.darkLordLight) {
      this.darkLordLight.color.setHex(0xffdd88)
      this.darkLordLight.intensity = 2
    }
  }
}
