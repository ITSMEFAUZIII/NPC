import * as THREE from 'three'
import { createTable, createChair } from '../props/Furniture.js'

export class Village {
  constructor(scene) {
    this.scene = scene
    this.interactables = []
    this.group = new THREE.Group()
    scene.add(this.group)
  }

  build() {
    this._buildWell(0, 0, 0)
    this._buildBlacksmith(20, 0, -15)
    this._buildMarketStalls(30, 0, 20)
    this._buildChurch(-30, 0, -40)
    this._buildNoticeBoard(-5, 0, -10)
    this._buildHouses()
    this._buildGraveyard(-60, 0, -60)
    return this.group
  }

  _buildHouse(x, z, w = 6, d = 5, h = 3.5, wallColor = 0xd4c4a8, roofColor = 0x5a3e2b) {
    const group = new THREE.Group()
    // Walls
    const wallMat = new THREE.MeshLambertMaterial({ color: wallColor })
    const walls = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), wallMat)
    walls.position.y = h / 2
    walls.castShadow = true
    walls.receiveShadow = true
    group.add(walls)

    // Roof (prism)
    const roofMat = new THREE.MeshLambertMaterial({ color: roofColor })
    const roofGeo = new THREE.CylinderGeometry(0, w * 0.7, 2.5, 4)
    roofGeo.rotateY(Math.PI / 4)
    const roof = new THREE.Mesh(roofGeo, roofMat)
    roof.position.y = h + 1.2
    roof.castShadow = true
    group.add(roof)

    // Windows
    const winMat = new THREE.MeshLambertMaterial({ color: 0xf5c842, emissive: 0xf5c842, emissiveIntensity: 0 })
    const winGeo = new THREE.BoxGeometry(0.5, 0.6, 0.05)
    const win1 = new THREE.Mesh(winGeo, winMat)
    win1.position.set(w * 0.3, h * 0.6, d / 2 + 0.01)
    const win2 = new THREE.Mesh(winGeo, winMat)
    win2.position.set(-w * 0.3, h * 0.6, d / 2 + 0.01)
    group.add(win1, win2)

    // Door
    const doorMat = new THREE.MeshLambertMaterial({ color: 0x4a2e10 })
    const door = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.8, 0.05), doorMat)
    door.position.set(0, 0.9, d / 2 + 0.01)
    group.add(door)

    group.position.set(x, 0, z)
    this.group.add(group)
    return group
  }

  _buildWell(x, y, z) {
    const group = new THREE.Group()
    // Stone base
    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(1.5, 1.5, 1, 12),
      new THREE.MeshLambertMaterial({ color: 0x8b8680 })
    )
    base.position.y = 0.5
    group.add(base)

    // 4 wooden poles
    const poleGeo = new THREE.CylinderGeometry(0.07, 0.07, 2.5, 4)
    const poleMat = new THREE.MeshLambertMaterial({ color: 0x5c3d1e })
    const poleOffsets = [[-1, -1], [1, -1], [-1, 1], [1, 1]]
    poleOffsets.forEach(([px, pz]) => {
      const pole = new THREE.Mesh(poleGeo, poleMat)
      pole.position.set(px, 1.75, pz)
      group.add(pole)
    })

    // Cross beam
    const beam = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.12, 0.12),
      poleMat
    )
    beam.position.set(0, 3, 0)
    group.add(beam)

    // Small pyramid roof
    const roof = new THREE.Mesh(
      new THREE.ConeGeometry(1.8, 1, 4),
      new THREE.MeshLambertMaterial({ color: 0x5a3e2b })
    )
    roof.rotation.y = Math.PI / 4
    roof.position.y = 3.8
    group.add(roof)

    group.position.set(x, y, z)
    this.group.add(group)

    this.interactables.push({
      id: 'town_well',
      mesh: base,
      worldPos: new THREE.Vector3(x, y, z),
      range: 2.5,
      prompt: 'Read inscription',
      dialogueId: 'interact_well'
    })

    return group
  }

  _buildBlacksmith(x, y, z) {
    const group = new THREE.Group()
    const wallMat = new THREE.MeshLambertMaterial({ color: 0xa0856a })

    // Main structure (open front)
    const back = new THREE.Mesh(new THREE.BoxGeometry(7, 4, 0.3), wallMat)
    back.position.set(0, 2, -3)
    back.castShadow = true
    group.add(back)
    const left = new THREE.Mesh(new THREE.BoxGeometry(0.3, 4, 6), wallMat)
    left.position.set(-3.5, 2, 0)
    left.castShadow = true
    group.add(left)
    const right = new THREE.Mesh(new THREE.BoxGeometry(0.3, 4, 6), wallMat)
    right.position.set(3.5, 2, 0)
    right.castShadow = true
    group.add(right)
    // Roof
    const roofMat = new THREE.MeshLambertMaterial({ color: 0x3d3d3d })
    const roof = new THREE.Mesh(new THREE.BoxGeometry(8, 0.2, 7), roofMat)
    roof.position.y = 4.1
    group.add(roof)

    // Anvil
    const anvil = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.5, 0.4), new THREE.MeshLambertMaterial({ color: 0x444444 }))
    anvil.position.set(-1, 0.9, -1)
    group.add(anvil)
    const anvilBase = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 0.7, 6), new THREE.MeshLambertMaterial({ color: 0x5a3e2b }))
    anvilBase.position.set(-1, 0.35, -1)
    group.add(anvilBase)

    // Forge fire (orange point light)
    const forgeFire = new THREE.PointLight(0xff6600, 2, 6)
    forgeFire.position.set(1, 1.5, -1)
    group.add(forgeFire)

    const fireGeo = new THREE.SphereGeometry(0.3, 6, 4)
    const fireMat = new THREE.MeshBasicMaterial({ color: 0xff4400 })
    const fireMesh = new THREE.Mesh(fireGeo, fireMat)
    fireMesh.position.set(1, 1, -1)
    group.add(fireMesh)

    group.position.set(x, y, z)
    this.group.add(group)
    return group
  }

  _buildMarketStalls(x, y, z) {
    const colors = [0xcc3333, 0x3366cc, 0x33aa44, 0xccaa00]
    for (let i = 0; i < 4; i++) {
      const stall = new THREE.Group()
      // Table
      const table = new THREE.Mesh(
        new THREE.BoxGeometry(2.5, 0.1, 1.2),
        new THREE.MeshLambertMaterial({ color: 0x8b6914 })
      )
      table.position.y = 0.8
      stall.add(table)

      // Canopy
      const canopyMat = new THREE.MeshLambertMaterial({ color: colors[i], side: THREE.DoubleSide })
      const canopy = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 1.5), canopyMat)
      canopy.rotation.x = -0.2
      canopy.position.set(0, 2.2, -0.2)
      stall.add(canopy)

      // Goods on table
      for (let j = 0; j < 4; j++) {
        const good = new THREE.Mesh(
          new THREE.BoxGeometry(0.2 + Math.random() * 0.2, 0.2, 0.15),
          new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff })
        )
        good.position.set(-0.8 + j * 0.5, 0.95, 0)
        stall.add(good)
      }

      // Poles
      const poleMat = new THREE.MeshLambertMaterial({ color: 0x5c3d1e })
      const poleGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.3, 4)
      ;[[-1.1, -0.5], [1.1, -0.5], [-1.1, 0.4], [1.1, 0.4]].forEach(([px, pz]) => {
        const pole = new THREE.Mesh(poleGeo, poleMat)
        pole.position.set(px, 1.15, pz)
        stall.add(pole)
      })

      stall.position.set(x + i * 3.5, y, z)
      this.group.add(stall)
    }
  }

  _buildChurch(x, y, z) {
    const group = new THREE.Group()
    const stoneMat = new THREE.MeshLambertMaterial({ color: 0x8b8680 })

    // Main body
    const body = new THREE.Mesh(new THREE.BoxGeometry(6, 7, 9), stoneMat)
    body.position.y = 3.5
    body.castShadow = true
    group.add(body)

    // Bell tower
    const tower = new THREE.Mesh(new THREE.BoxGeometry(2.5, 12, 2.5), stoneMat)
    tower.position.set(-1.5, 6, -4)
    tower.castShadow = true
    group.add(tower)

    // Roof
    const roofMat = new THREE.MeshLambertMaterial({ color: 0x3d3d3d })
    const mainRoof = new THREE.Mesh(new THREE.CylinderGeometry(0, 3.5, 3, 4), roofMat)
    mainRoof.rotation.y = Math.PI / 4
    mainRoof.position.y = 8.5
    group.add(mainRoof)

    const towerRoof = new THREE.Mesh(new THREE.CylinderGeometry(0, 1.8, 3, 4), roofMat)
    towerRoof.rotation.y = Math.PI / 4
    towerRoof.position.set(-1.5, 13.5, -4)
    group.add(towerRoof)

    // Arched entrance
    const archMat = new THREE.MeshLambertMaterial({ color: 0x7a6e66 })
    const arch = new THREE.Mesh(
      new THREE.TorusGeometry(1.2, 0.2, 4, 8, Math.PI),
      archMat
    )
    arch.position.set(0, 2.2, 4.5)
    arch.rotation.z = Math.PI
    group.add(arch)

    // Stained glass windows (emissive colored planes)
    const glassColors = [0x8844ff, 0xff8844, 0x44ff88]
    glassColors.forEach((c, i) => {
      const glass = new THREE.Mesh(
        new THREE.PlaneGeometry(0.8, 1.2),
        new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.7, side: THREE.DoubleSide })
      )
      glass.position.set(-1.5 + i * 1.5, 5, 3.05)
      group.add(glass)
    })

    // Interactive prayer spot
    this.interactables.push({
      id: 'church',
      mesh: body,
      worldPos: new THREE.Vector3(x, y, z),
      range: 4,
      prompt: 'Enter shrine',
      dialogueId: 'interact_church'
    })

    group.position.set(x, y, z)
    this.group.add(group)
    return group
  }

  _buildNoticeBoard(x, y, z) {
    const group = new THREE.Group()
    const woodMat = new THREE.MeshLambertMaterial({ color: 0x5c3d1e })

    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 2.5, 4), woodMat)
    post.position.y = 1.25
    group.add(post)

    const board = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1, 0.08), woodMat)
    board.position.set(0, 2.2, 0)
    group.add(board)

    // Paper notes
    const paperMat = new THREE.MeshBasicMaterial({ color: 0xf5e6c8, side: THREE.DoubleSide })
    for (let i = 0; i < 3; i++) {
      const paper = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.35), paperMat)
      paper.position.set(-0.45 + i * 0.45, 2.2, 0.05)
      paper.rotation.z = (Math.random() - 0.5) * 0.15
      group.add(paper)
    }

    this.interactables.push({
      id: 'notice_board',
      mesh: board,
      worldPos: new THREE.Vector3(x, y, z),
      range: 2.5,
      prompt: 'Read notices',
      dialogueId: 'interact_notice_board'
    })

    group.position.set(x, y, z)
    this.group.add(group)
    return group
  }

  _buildHouses() {
    const houseData = [
      { x: -20, z: 25, w: 5, d: 4, h: 3, wall: 0xd4c4a8, roof: 0x5a3e2b },
      { x: 10, z: 25, w: 4.5, d: 4, h: 3.2, wall: 0xc9b89a, roof: 0x4a2e10 },
      { x: -35, z: 5, w: 5, d: 5, h: 3.5, wall: 0xd0c0a5, roof: 0x6a4030 },
      { x: 35, z: -5, w: 5.5, d: 4.5, h: 3, wall: 0xbfaf99, roof: 0x3d2e20 },
      { x: -15, z: -30, w: 4, d: 3.5, h: 2.8, wall: 0xd4c4a8, roof: 0x5a4030 },
      { x: 10, z: -30, w: 6, d: 5, h: 3.8, wall: 0xc8b89a, roof: 0x4a3020 },
      { x: -40, z: -20, w: 4.5, d: 4, h: 3.2, wall: 0xd2c2aa, roof: 0x5a3e2b },
      { x: 40, z: 30, w: 5, d: 4, h: 3.0, wall: 0xcab5a0, roof: 0x4a3520 },
    ]
    houseData.forEach(h => this._buildHouse(h.x, 0, h.z, h.w, h.d, h.h, h.wall, h.roof))
  }

  _buildGraveyard(x, y, z) {
    const group = new THREE.Group()
    const stoneMat = new THREE.MeshLambertMaterial({ color: 0x7a7a8a })

    // Fence
    for (let i = 0; i < 16; i++) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.5, 0.1), stoneMat)
      const angle = (i / 16) * Math.PI * 2
      post.position.set(Math.cos(angle) * 8, 0.75, Math.sin(angle) * 6)
      group.add(post)
    }

    // Gravestones
    for (let i = 0; i < 12; i++) {
      const stone = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.9 + Math.random() * 0.4, 0.12),
        stoneMat
      )
      stone.position.set(
        (Math.random() - 0.5) * 12,
        0.5,
        (Math.random() - 0.5) * 8
      )
      stone.rotation.y = (Math.random() - 0.5) * 0.3
      group.add(stone)
    }

    group.position.set(x, y, z)
    this.group.add(group)
  }

  getInteractables() {
    return this.interactables
  }
}
