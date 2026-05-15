import * as THREE from 'three'
import { Sky } from 'three/examples/jsm/objects/Sky.js'

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas
    this.renderer = null
    this.scene = null
    this.camera = null
    this.sky = null
    this.sun = null
    this.sunLight = null
    this.ambientLight = null
    this.moonLight = null
    this._currentPhase = 'morning'
    this._time = 0
  }

  init() {
    // WebGLRenderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance'
    })
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.0
    this.renderer.outputColorSpace = THREE.SRGBColorSpace

    // Scene
    this.scene = new THREE.Scene()
    this.scene.fog = new THREE.FogExp2(0x87ceeb, 0.0008)
    this.scene.background = new THREE.Color(0x87ceeb)

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1200
    )
    this.camera.position.set(-50, 5, 20)

    // Lights
    this.ambientLight = new THREE.AmbientLight(0x445566, 0.5)
    this.scene.add(this.ambientLight)

    this.sunLight = new THREE.DirectionalLight(0xffeedd, 1.2)
    this.sunLight.position.set(100, 200, 50)
    this.sunLight.castShadow = true
    this.sunLight.shadow.mapSize.set(2048, 2048)
    this.sunLight.shadow.camera.near = 0.5
    this.sunLight.shadow.camera.far = 500
    this.sunLight.shadow.camera.left = -200
    this.sunLight.shadow.camera.right = 200
    this.sunLight.shadow.camera.top = 200
    this.sunLight.shadow.camera.bottom = -200
    this.sunLight.shadow.bias = -0.001
    this.scene.add(this.sunLight)

    this.moonLight = new THREE.DirectionalLight(0x223366, 0.1)
    this.moonLight.position.set(-100, 150, -50)
    this.scene.add(this.moonLight)

    // Sky
    this.sky = new Sky()
    this.sky.scale.setScalar(900)
    this.scene.add(this.sky)
    this.sun = new THREE.Vector3()
    this._updateSkyForHour(10)

    // Stars
    this._createStars()

    // Handle resize
    window.addEventListener('resize', () => this._onResize())

    return { scene: this.scene, camera: this.camera }
  }

  _createStars() {
    const geo = new THREE.BufferGeometry()
    const positions = new Float32Array(2000 * 3)
    for (let i = 0; i < 2000; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 850
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = Math.abs(r * Math.cos(phi))
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    this.starsMesh = new THREE.Points(
      geo,
      new THREE.PointsMaterial({ color: 0xffffff, size: 1.5, sizeAttenuation: false })
    )
    this.starsMesh.visible = false
    this.scene.add(this.starsMesh)
  }

  _updateSkyForHour(hour) {
    const sky = this.sky
    const uniforms = sky.material.uniforms
    uniforms['turbidity'].value = 10
    uniforms['rayleigh'].value = 3
    uniforms['mieCoefficient'].value = 0.005
    uniforms['mieDirectionalG'].value = 0.7

    const angle = (hour / 24) * Math.PI * 2 - Math.PI / 2
    const elevation = Math.sin(angle) * 70
    const azimuth = Math.cos(angle) * 180
    const phi = THREE.MathUtils.degToRad(90 - elevation)
    const theta = THREE.MathUtils.degToRad(azimuth)
    this.sun.setFromSphericalCoords(1, phi, theta)
    uniforms['sunPosition'].value.copy(this.sun)

    const sunX = Math.cos(angle) * 400
    const sunY = Math.sin(angle) * 300
    const sunZ = -200
    this.sunLight.position.set(sunX, Math.max(sunY, 10), sunZ)
  }

  updateLighting(phase, hour) {
    this._currentPhase = phase
    this._updateSkyForHour(hour)

    const LIGHT_PHASES = {
      dawn:      { ambient: 0x334466, ambientInt: 0.4, sun: 0xff8833, sunInt: 0.5, exposure: 0.8 },
      morning:   { ambient: 0x445566, ambientInt: 0.5, sun: 0xffeedd, sunInt: 1.2, exposure: 1.0 },
      afternoon: { ambient: 0x334455, ambientInt: 0.6, sun: 0xfff5e0, sunInt: 1.5, exposure: 1.1 },
      dusk:      { ambient: 0x443322, ambientInt: 0.4, sun: 0xff5500, sunInt: 0.8, exposure: 0.7 },
      night:     { ambient: 0x111133, ambientInt: 0.15, sun: 0x223366, sunInt: 0.1, exposure: 0.3 }
    }

    const cfg = LIGHT_PHASES[phase] || LIGHT_PHASES.morning
    this.ambientLight.color.setHex(cfg.ambient)
    this.ambientLight.intensity = cfg.ambientInt
    this.sunLight.color.setHex(cfg.sun)
    this.sunLight.intensity = cfg.sunInt
    this.renderer.toneMappingExposure = cfg.exposure

    const isNight = phase === 'night'
    this.moonLight.visible = isNight
    if (this.starsMesh) this.starsMesh.visible = isNight

    if (this.sky) {
      if (isNight) {
        this.scene.background = new THREE.Color(0x050510)
      } else {
        this.scene.background = null
      }
      this.sky.visible = !isNight
    }
  }

  render() {
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera)
    }
  }

  _onResize() {
    if (!this.camera || !this.renderer) return
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  getScene() { return this.scene }
  getCamera() { return this.camera }

  dispose() {
    window.removeEventListener('resize', this._onResize)
    if (this.renderer) {
      this.scene.traverse(obj => {
        if (obj.geometry) obj.geometry.dispose()
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose())
          else obj.material.dispose()
        }
      })
      this.renderer.dispose()
    }
  }
}
