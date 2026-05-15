import * as THREE from 'three'
import EventBus from './EventBus.js'

export class WeatherSystem {
  constructor(scene) {
    this.scene = scene
    this.currentWeather = 'clear'
    this.targetWeather = 'clear'
    this.transitionProgress = 1
    this.transitionDuration = 60 // seconds
    this.daysSinceChange = 0
    this.nextChangeDay = 4 + Math.floor(Math.random() * 5)
    this.rainMesh = null
    this.cloudMeshes = []
    this.rainGain = null
    this._time = 0
    this._rainPositions = null
    this._setup()
  }

  _setup() {
    this._createRainSystem()
    this._createClouds()
    this._updateFog('clear')
  }

  _createRainSystem() {
    const count = 3000
    const geo = new THREE.BufferGeometry()
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 200
      positions[i * 3 + 1] = Math.random() * 80
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    this._rainPositions = positions
    const mat = new THREE.PointsMaterial({
      color: 0x88aacc,
      size: 0.15,
      transparent: true,
      opacity: 0.6,
      depthWrite: false
    })
    this.rainMesh = new THREE.Points(geo, mat)
    this.rainMesh.visible = false
    this.scene.add(this.rainMesh)
  }

  _createClouds() {
    for (let i = 0; i < 15; i++) {
      const cloud = this._makeCloud()
      cloud.position.set(
        (Math.random() - 0.5) * 800,
        200 + Math.random() * 80,
        (Math.random() - 0.5) * 800
      )
      this.cloudMeshes.push(cloud)
      this.scene.add(cloud)
    }
  }

  _makeCloud() {
    const group = new THREE.Group()
    const count = 3 + Math.floor(Math.random() * 4)
    for (let i = 0; i < count; i++) {
      const geo = new THREE.SphereGeometry(8 + Math.random() * 12, 6, 4)
      const mat = new THREE.MeshLambertMaterial({
        color: 0xcccccc,
        transparent: true,
        opacity: 0.7
      })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 20
      )
      group.add(mesh)
    }
    return group
  }

  _updateFog(weather) {
    if (!this.scene) return
    switch (weather) {
      case 'clear':
        this.scene.fog = new THREE.FogExp2(0x87ceeb, 0.0008)
        break
      case 'night':
        this.scene.fog = new THREE.FogExp2(0x0a0a1a, 0.002)
        break
      case 'fog':
        this.scene.fog = new THREE.FogExp2(0x8899aa, 0.006)
        break
      case 'rain':
      case 'storm':
        this.scene.fog = new THREE.FogExp2(0x445566, 0.003)
        break
      case 'cloudy':
        this.scene.fog = new THREE.FogExp2(0x778899, 0.0012)
        break
    }
  }

  setWeather(type) {
    if (this.currentWeather === type) return
    this.targetWeather = type
    this.transitionProgress = 0
    EventBus.emit('weather:changed', { type })
  }

  setNightFog() {
    this._updateFog('night')
  }

  setDayFog() {
    this._updateFog(this.currentWeather)
  }

  gameTick(state) {
    this.daysSinceChange++
    if (this.daysSinceChange >= this.nextChangeDay) {
      this.daysSinceChange = 0
      this.nextChangeDay = 4 + Math.floor(Math.random() * 5)
      const weathers = ['clear', 'cloudy', 'rain', 'fog']
      const next = weathers[Math.floor(Math.random() * weathers.length)]
      this.setWeather(next)
    }
  }

  update(delta) {
    this._time += delta

    // Transition
    if (this.transitionProgress < 1) {
      this.transitionProgress += delta / this.transitionDuration
      if (this.transitionProgress >= 1) {
        this.transitionProgress = 1
        this.currentWeather = this.targetWeather
        this._updateFog(this.currentWeather)
      }
    }

    // Rain
    const isRaining = this.currentWeather === 'rain' || this.currentWeather === 'storm'
    this.rainMesh.visible = isRaining

    if (isRaining && this._rainPositions) {
      const positions = this._rainPositions
      const count = positions.length / 3
      const fallSpeed = (this.currentWeather === 'storm' ? 60 : 40) * delta
      for (let i = 0; i < count; i++) {
        positions[i * 3 + 1] -= fallSpeed
        if (positions[i * 3 + 1] < -5) {
          positions[i * 3 + 1] = 80
        }
        // Follow camera roughly
      }
      this.rainMesh.geometry.attributes.position.needsUpdate = true
    }

    // Drift clouds
    this.cloudMeshes.forEach((c, i) => {
      c.position.x += 0.5 * delta
      if (c.position.x > 600) c.position.x = -600
    })
  }

  getCurrentWeather() {
    return this.currentWeather
  }

  destroy() {
    if (this.rainMesh) this.scene.remove(this.rainMesh)
    this.cloudMeshes.forEach(c => this.scene.remove(c))
    this.cloudMeshes = []
  }
}
