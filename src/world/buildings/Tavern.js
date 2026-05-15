import * as THREE from 'three'
import { createTable, createChair, createBed } from '../props/Furniture.js'

export class Tavern {
  constructor(scene) {
    this.scene = scene
    this.group = new THREE.Group()
    this.interactables = []
    this.candleLights = []
    this.fireplaceLight = null
    this.windows = []
    this.trapdoor = null
    this._time = 0
    this._smokeParticles = null
    this._dustParticles = null
  }

  build() {
    this._buildExterior()
    this._buildInterior()
    this._addLighting()
    this._addParticles()
    this.group.position.set(-50, 0, 10)
    this.scene.add(this.group)
    return this.group
  }

  _buildExterior() {
    const plasterMat = new THREE.MeshLambertMaterial({ color: 0xd4c4a8 })
    const timberMat = new THREE.MeshLambertMaterial({ color: 0x3d2510 })
    const roofMat = new THREE.MeshLambertMaterial({ color: 0x3d3d3d })

    // Main walls
    const walls = new THREE.Mesh(new THREE.BoxGeometry(12, 6, 9), plasterMat)
    walls.position.y = 3
    walls.castShadow = true
    walls.receiveShadow = true
    this.group.add(walls)

    // Timber beams overlay pattern
    for (let i = 0; i < 4; i++) {
      const beam = new THREE.Mesh(new THREE.BoxGeometry(12.05, 0.15, 0.12), timberMat)
      beam.position.set(0, 1.5 + i * 1.2, 4.51)
      this.group.add(beam)
    }
    const vertBeam = new THREE.Mesh(new THREE.BoxGeometry(0.12, 6.05, 0.12), timberMat)
    vertBeam.position.set(-3, 3, 4.51)
    const vertBeam2 = vertBeam.clone()
    vertBeam2.position.set(3, 3, 4.51)
    this.group.add(vertBeam, vertBeam2)

    // Steep pitched roof
    const roofGeo = new THREE.CylinderGeometry(0, 7, 4, 4)
    roofGeo.rotateY(Math.PI / 4)
    const roof = new THREE.Mesh(roofGeo, roofMat)
    roof.position.y = 8
    roof.castShadow = true
    this.group.add(roof)

    // Chimney
    const chimney = new THREE.Mesh(
      new THREE.BoxGeometry(1, 3.5, 1),
      new THREE.MeshLambertMaterial({ color: 0x8b7355 })
    )
    chimney.position.set(3, 9, -1)
    this.group.add(chimney)

    // Windows with warm emissive glow
    const winData = [[-3, 2.5, 4.51], [3, 2.5, 4.51], [-3, 2.5, -4.51], [3, 2.5, -4.51]]
    winData.forEach(([wx, wy, wz]) => {
      const winMat = new THREE.MeshLambertMaterial({
        color: 0xf5c842,
        emissive: 0xf5c842,
        emissiveIntensity: 0.5
      })
      const win = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.9, 0.05), winMat)
      win.position.set(wx, wy, wz)
      this.group.add(win)
      this.windows.push({ mesh: win, mat: winMat })
    })

    // Sign: "THE GREY FLAGON"
    const signCanvas = document.createElement('canvas')
    signCanvas.width = 256; signCanvas.height = 64
    const ctx = signCanvas.getContext('2d')
    ctx.fillStyle = '#4a2e10'
    ctx.fillRect(0, 0, 256, 64)
    ctx.fillStyle = '#f5c842'
    ctx.font = 'bold 18px serif'
    ctx.textAlign = 'center'
    ctx.fillText('THE GREY FLAGON', 128, 40)
    const signTex = new THREE.CanvasTexture(signCanvas)
    const sign = new THREE.Mesh(
      new THREE.BoxGeometry(3, 0.7, 0.05),
      new THREE.MeshBasicMaterial({ map: signTex })
    )
    sign.position.set(0, 6.2, 4.52)
    this.group.add(sign)

    // Door
    const door = new THREE.Mesh(
      new THREE.BoxGeometry(1.8, 2.4, 0.1),
      new THREE.MeshLambertMaterial({ color: 0x4a2e10 })
    )
    door.position.set(0, 1.2, 4.51)
    this.group.add(door)
  }

  _buildInterior() {
    const floorMat = new THREE.MeshLambertMaterial({ color: 0x4a3020 })
    const wallMatLow = new THREE.MeshLambertMaterial({ color: 0x7a6a5a })
    const wallMatHigh = new THREE.MeshLambertMaterial({ color: 0x4a3520 })

    // Floor
    const floor = new THREE.Mesh(new THREE.BoxGeometry(11.8, 0.1, 8.8), floorMat)
    floor.position.y = 0.05
    floor.receiveShadow = true
    this.group.add(floor)

    // Floor planks pattern
    for (let i = 0; i < 10; i++) {
      const plank = new THREE.Mesh(
        new THREE.BoxGeometry(11.8, 0.01, 0.05),
        new THREE.MeshLambertMaterial({ color: 0x3a2010 })
      )
      plank.position.set(0, 0.11, -4.4 + i * 0.9)
      this.group.add(plank)
    }

    // Tables
    const tablePositions = [[-4, 0, 2], [-2, 0, 2], [0, 0, 2], [-4, 0, -1], [-2, 0, -1], [2, 0, -1]]
    tablePositions.forEach(([tx, ty, tz]) => {
      const table = createTable(tx, ty, tz)
      // Chairs around each table
      this.group.add(table)
      this.group.add(createChair(tx - 1, 0, tz, 0))
      this.group.add(createChair(tx + 1, 0, tz, Math.PI))
      this.group.add(createChair(tx, 0, tz - 0.8, Math.PI / 2))
    })

    // Bar counter
    const barMat = new THREE.MeshLambertMaterial({ color: 0x5c3010 })
    const bar = new THREE.Mesh(new THREE.BoxGeometry(8, 1, 0.8), barMat)
    bar.position.set(0, 0.5, -3.5)
    bar.castShadow = true
    this.group.add(bar)

    // Bottles on shelf behind bar
    const shelfY = [1.8, 2.5]
    shelfY.forEach(sy => {
      const shelf = new THREE.Mesh(new THREE.BoxGeometry(7.5, 0.06, 0.25), barMat)
      shelf.position.set(0, sy, -4.3)
      this.group.add(shelf)
      for (let i = 0; i < 8; i++) {
        const bottleColor = [0x2244aa, 0x44aa22, 0xaa4422, 0xaaaa22][Math.floor(Math.random() * 4)]
        const bottleGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.4 + Math.random() * 0.2, 6)
        const bottle = new THREE.Mesh(
          bottleGeo,
          new THREE.MeshLambertMaterial({ color: bottleColor, transparent: true, opacity: 0.8 })
        )
        bottle.position.set(-3.2 + i * 0.9, sy + 0.25, -4.35)
        this.group.add(bottle)
      }
    })

    // Bar stools
    for (let i = 0; i < 5; i++) {
      const stool = new THREE.Mesh(
        new THREE.CylinderGeometry(0.25, 0.2, 0.75, 6),
        new THREE.MeshLambertMaterial({ color: 0x4a2e10 })
      )
      stool.position.set(-3 + i * 1.5, 0.375, -2.8)
      this.group.add(stool)
    }

    // Fireplace
    const stoneMat = new THREE.MeshLambertMaterial({ color: 0x6a6055 })
    const fireplace = new THREE.Mesh(new THREE.BoxGeometry(2.5, 2.8, 0.5), stoneMat)
    fireplace.position.set(4, 1.4, -4.2)
    this.group.add(fireplace)

    // Fire in fireplace
    const fireMat = new THREE.MeshBasicMaterial({ color: 0xff4400 })
    const fire = new THREE.Mesh(new THREE.SphereGeometry(0.35, 6, 4), fireMat)
    fire.position.set(4, 0.8, -4.0)
    this.group.add(fire)
    this.fireMesh = fire

    // Stairs to upper floor
    for (let i = 0; i < 8; i++) {
      const step = new THREE.Mesh(
        new THREE.BoxGeometry(1.5, 0.2, 0.4),
        new THREE.MeshLambertMaterial({ color: 0x5c3d1e })
      )
      step.position.set(-4.5, 0.1 + i * 0.25, -3 + i * 0.4)
      this.group.add(step)
    }

    // Upper floor
    const upperFloor = new THREE.Mesh(
      new THREE.BoxGeometry(11.8, 0.1, 4),
      floorMat
    )
    upperFloor.position.set(0, 3.1, -2.3)
    this.group.add(upperFloor)

    // Kael's room (upper floor)
    const bed = createBed(0, 3.2, -3.8)
    this.group.add(bed)

    // Chest
    const chest = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.5, 0.4),
      new THREE.MeshLambertMaterial({ color: 0x5c3010 })
    )
    chest.position.set(3, 3.45, -4.2)
    this.group.add(chest)

    // Trapdoor (hidden initially)
    const trapdoor = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.05, 1.2),
      new THREE.MeshLambertMaterial({ color: 0x4a2e10, transparent: true, opacity: 0 })
    )
    trapdoor.position.set(3.5, 0.08, -3.2)
    this.group.add(trapdoor)
    this.trapdoor = trapdoor
    this._trapdoorMat = trapdoor.material

    this.interactables.push({
      id: 'bar_counter',
      mesh: bar,
      worldPos: new THREE.Vector3(-50, 0, 10 - 3.5),
      range: 2,
      prompt: 'Tend bar',
      actionType: 'bar_counter'
    })
    this.interactables.push({
      id: 'trapdoor',
      mesh: trapdoor,
      worldPos: new THREE.Vector3(-50 + 3.5, 0, 10 - 3.2),
      range: 1.5,
      prompt: 'Examine trapdoor',
      dialogueId: null,
      requiresFlag: 'trapdoorDiscovered'
    })
  }

  _addLighting() {
    // 6 candle point lights
    const candlePositions = [
      [-3, 1.2, 1.5], [0, 1.2, 1.5], [3, 1.2, 1.5],
      [-3, 1.2, -0.5], [0, 1.2, -0.5], [3, 1.2, -0.5]
    ]
    candlePositions.forEach(([cx, cy, cz]) => {
      const light = new THREE.PointLight(0xf59e0b, 0.8, 6)
      light.position.set(cx, cy, cz)
      light._baseIntensity = 0.8
      light._flickerFreq = 2 + Math.random() * 3
      light._flickerPhase = Math.random() * Math.PI * 2
      this.group.add(light)
      this.candleLights.push(light)
    })

    // Fireplace light
    this.fireplaceLight = new THREE.PointLight(0xff6600, 2, 15)
    this.fireplaceLight.position.set(4, 1.5, -4)
    this.group.add(this.fireplaceLight)
  }

  _addParticles() {
    // Smoke particles from chimney
    const count = 30
    const smokeGeo = new THREE.BufferGeometry()
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = 3 + (Math.random() - 0.5) * 0.5
      positions[i * 3 + 1] = 10 + Math.random() * 5
      positions[i * 3 + 2] = -1 + (Math.random() - 0.5) * 0.3
    }
    smokeGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    this._smokePositions = positions
    this._smokeCount = count
    const smokeMat = new THREE.PointsMaterial({
      color: 0x888888, size: 0.6, transparent: true, opacity: 0.3, depthWrite: false
    })
    this._smokeParticles = new THREE.Points(smokeGeo, smokeMat)
    this.group.add(this._smokeParticles)

    // Dust motes
    const dustCount = 80
    const dustGeo = new THREE.BufferGeometry()
    const dustPos = new Float32Array(dustCount * 3)
    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 10
      dustPos[i * 3 + 1] = 0.5 + Math.random() * 2.5
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 8
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3))
    this._dustPositions = dustPos
    this._dustCount = dustCount
    const dustMat = new THREE.PointsMaterial({
      color: 0xffeedd, size: 0.03, transparent: true, opacity: 0.4, depthWrite: false
    })
    this._dustParticles = new THREE.Points(dustGeo, dustMat)
    this.group.add(this._dustParticles)
  }

  revealTrapdoor() {
    if (this._trapdoorMat) {
      this._trapdoorMat.opacity = 1
      this._trapdoorMat.transparent = false
    }
  }

  setNightMode(isNight) {
    const intensity = isNight ? 0.5 : 0
    this.windows.forEach(({ mat }) => {
      mat.emissiveIntensity = intensity
    })
  }

  update(delta, time) {
    this._time += delta

    // Flicker candles
    this.candleLights.forEach(l => {
      l.intensity = l._baseIntensity + Math.sin(this._time * l._flickerFreq + l._flickerPhase) * 0.2
    })

    // Flicker fireplace
    if (this.fireplaceLight) {
      this.fireplaceLight.intensity = 1.8 + Math.sin(this._time * 3.7) * 0.4
    }

    // Animate fire
    if (this.fireMesh) {
      this.fireMesh.scale.y = 1 + Math.sin(this._time * 4) * 0.1
    }

    // Smoke drift
    if (this._smokeParticles && this._smokePositions) {
      const pos = this._smokePositions
      for (let i = 0; i < this._smokeCount; i++) {
        pos[i * 3 + 1] += delta * 1.5
        pos[i * 3] += Math.sin(this._time + i) * delta * 0.1
        if (pos[i * 3 + 1] > 16) {
          pos[i * 3 + 1] = 10
          pos[i * 3] = 3 + (Math.random() - 0.5) * 0.5
        }
      }
      this._smokeParticles.geometry.attributes.position.needsUpdate = true
    }

    // Dust drift
    if (this._dustParticles && this._dustPositions) {
      const pos = this._dustPositions
      for (let i = 0; i < this._dustCount; i++) {
        pos[i * 3] += Math.sin(this._time * 0.3 + i) * delta * 0.05
        pos[i * 3 + 1] += Math.sin(this._time * 0.2 + i * 0.5) * delta * 0.02
        if (pos[i * 3 + 1] > 3.5) pos[i * 3 + 1] = 0.5
        if (pos[i * 3 + 1] < 0.3) pos[i * 3 + 1] = 3.0
      }
      this._dustParticles.geometry.attributes.position.needsUpdate = true
    }
  }

  getInteractables() {
    return this.interactables
  }

  getWorldPosition() {
    return this.group.position.clone()
  }
}
