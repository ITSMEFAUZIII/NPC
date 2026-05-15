import * as THREE from 'three'
import { clamp, lerp } from '../utils/math.js'

export class CameraSystem {
  constructor(camera, scene) {
    this.camera = camera
    this.scene = scene
    this.mode = 'follow'
    this.target = null // mesh to follow

    // Follow cam settings
    this.followDistance = 5.5
    this.followHeight = 2.5
    this.yaw = 0
    this.pitch = 0.3
    this.minPitch = -0.1
    this.maxPitch = 1.0
    this.sensitivity = 0.003

    // Aldric drift
    this.aldricRef = null
    this.driftAngle = 0

    // Cinematic
    this.cinematicTarget = new THREE.Vector3()
    this.cinematicPos = new THREE.Vector3()
    this.letterboxActive = false

    // Smooth position
    this._currentPos = new THREE.Vector3()
    this._targetPos = new THREE.Vector3()
    this._lerpFactor = 0.08
  }

  setTarget(mesh) {
    this.target = mesh
  }

  setAldricRef(mesh) {
    this.aldricRef = mesh
  }

  setMode(mode) {
    this.mode = mode
    if (mode === 'cinematic') this._showLetterbox(true)
    else this._showLetterbox(false)
  }

  _showLetterbox(show) {
    this.letterboxActive = show
    let bars = document.getElementById('letterbox')
    if (show && !bars) {
      bars = document.createElement('div')
      bars.id = 'letterbox'
      bars.style.cssText = `
        position:fixed;top:0;left:0;width:100%;height:100%;
        pointer-events:none;z-index:20;
      `
      bars.innerHTML = `
        <div style="position:absolute;top:0;left:0;width:100%;height:12%;background:#000;"></div>
        <div style="position:absolute;bottom:0;left:0;width:100%;height:12%;background:#000;"></div>
      `
      document.body.appendChild(bars)
    } else if (!show && bars) {
      bars.remove()
    }
  }

  processMouseInput(dx, dy) {
    if (this.mode !== 'follow') return
    this.yaw -= dx * this.sensitivity
    this.pitch -= dy * this.sensitivity
    this.pitch = clamp(this.pitch, this.minPitch, this.maxPitch)
  }

  processScroll(delta) {
    this.followDistance = clamp(this.followDistance + delta * 0.01, 2, 10)
  }

  update(delta) {
    if (!this.target) return

    if (this.mode === 'follow' || this.mode === 'observe') {
      this._updateFollowCamera(delta)
    } else if (this.mode === 'cinematic') {
      this._updateCinematicCamera(delta)
    }
  }

  _updateFollowCamera(delta) {
    const targetPos = this.target.position

    // If Aldric is nearby, drift camera slightly toward him
    let extraYaw = 0
    if (this.aldricRef && this.mode === 'observe') {
      const dist = targetPos.distanceTo(this.aldricRef.position)
      if (dist < 20) {
        const dirToAldric = Math.atan2(
          this.aldricRef.position.x - targetPos.x,
          this.aldricRef.position.z - targetPos.z
        )
        const angleDiff = dirToAldric - this.yaw
        extraYaw = lerp(0, angleDiff, 0.003 * (20 - dist))
      }
    }

    const yaw = this.yaw + extraYaw
    const cosP = Math.cos(this.pitch)
    const sinP = Math.sin(this.pitch)

    const offsetX = Math.sin(yaw) * cosP * this.followDistance
    const offsetY = sinP * this.followDistance + this.followHeight
    const offsetZ = Math.cos(yaw) * cosP * this.followDistance

    this._targetPos.set(
      targetPos.x + offsetX,
      targetPos.y + offsetY,
      targetPos.z + offsetZ
    )

    this._currentPos.lerp(this._targetPos, this._lerpFactor)

    // Simple collision — keep camera above ground
    if (this._currentPos.y < 0.5) this._currentPos.y = 0.5

    this.camera.position.copy(this._currentPos)

    // Look at character, slightly above feet
    const lookAt = new THREE.Vector3(targetPos.x, targetPos.y + 1.0, targetPos.z)
    this.camera.lookAt(lookAt)
  }

  _updateCinematicCamera(delta) {
    this.camera.position.lerp(this.cinematicPos, 0.04)
    this.camera.lookAt(this.cinematicTarget)
  }

  setCinematicTarget(pos, lookAt) {
    this.cinematicPos.copy(pos)
    this.cinematicTarget.copy(lookAt)
  }

  getPosition() {
    return this.camera.position.clone()
  }

  getForwardDirection() {
    const dir = new THREE.Vector3()
    this.camera.getWorldDirection(dir)
    dir.y = 0
    dir.normalize()
    return dir
  }

  getRightDirection() {
    const dir = new THREE.Vector3()
    this.camera.getWorldDirection(dir)
    dir.y = 0
    dir.normalize()
    const right = new THREE.Vector3()
    right.crossVectors(dir, new THREE.Vector3(0, 1, 0))
    return right
  }
}
