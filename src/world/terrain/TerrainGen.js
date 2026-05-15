import * as THREE from 'three'
import { noise2D } from '../../utils/noise.js'

export class TerrainGen {
  constructor(scene) {
    this.scene = scene
    this.mesh = null
  }

  generate() {
    const size = 2000
    const segments = 128
    const geo = new THREE.PlaneGeometry(size, size, segments, segments)
    geo.rotateX(-Math.PI / 2)

    const positions = geo.attributes.position
    const colors = []
    const count = positions.count

    for (let i = 0; i < count; i++) {
      const x = positions.getX(i)
      const z = positions.getZ(i)
      const y = this._heightAt(x, z)
      positions.setY(i, y)

      const color = this._colorAt(x, z, y)
      colors.push(color.r, color.g, color.b)
    }

    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
    geo.computeVertexNormals()

    const mat = new THREE.MeshLambertMaterial({
      vertexColors: true,
      side: THREE.FrontSide
    })

    this.mesh = new THREE.Mesh(geo, mat)
    this.mesh.receiveShadow = true
    this.mesh.name = 'terrain'
    this.scene.add(this.mesh)

    this._addRoads()
    return this.mesh
  }

  _heightAt(x, z) {
    const distFromOrigin = Math.sqrt(x * x + z * z)
    const flatBlend = Math.min(1, distFromOrigin / 200)

    let base = noise2D(x * 0.003, z * 0.003) * 30
    let detail = noise2D(x * 0.01, z * 0.01) * 5

    let mountain = 0
    if (z > 400) {
      const mBlend = Math.min(1, (z - 400) / 200)
      mountain = noise2D(x * 0.001, z * 0.001) * 120 * mBlend
    }

    const height = base + detail + mountain
    return height * flatBlend
  }

  _colorAt(x, z, y) {
    if (y > 80) return new THREE.Color(0xe8e8e8) // snow
    if (z > 400 || y > 30) return new THREE.Color(0x8b7355) // mountain
    const distFromOrigin = Math.sqrt(x * x + z * z)
    if (distFromOrigin < 350) return new THREE.Color(0x4a7c59) // plains
    return new THREE.Color(0x2d5a27) // forest
  }

  _addRoads() {
    // South road to village
    this._createRoad([
      new THREE.Vector3(0, 0.2, -800),
      new THREE.Vector3(0, 0.2, -400),
      new THREE.Vector3(0, 0.2, 0)
    ])
    // East road to dungeon
    this._createRoad([
      new THREE.Vector3(0, 0.2, 0),
      new THREE.Vector3(100, 0.2, 175),
      new THREE.Vector3(200, 0.2, 350)
    ])
  }

  _createRoad(points) {
    const curve = new THREE.CatmullRomCurve3(points)
    const tubeGeo = new THREE.TubeGeometry(curve, 40, 3, 4, false)
    const mat = new THREE.MeshLambertMaterial({ color: 0xa0826d })
    const road = new THREE.Mesh(tubeGeo, mat)
    road.receiveShadow = true
    this.scene.add(road)
  }

  getHeightAt(x, z) {
    return this._heightAt(x, z)
  }

  dispose() {
    if (this.mesh) {
      this.scene.remove(this.mesh)
      this.mesh.geometry.dispose()
      this.mesh.material.dispose()
    }
  }
}
