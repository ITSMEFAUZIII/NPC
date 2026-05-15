import * as THREE from 'three'
import EventBus from '../engine/EventBus.js'

export class SirAldric {
  constructor(scene) {
    this.scene = scene
    this.group = new THREE.Group()
    this.position = new THREE.Vector3(0, 0, -200)
    this.rotation = 0
    this.speed = 4
    this._time = 0
    this._walkCycle = 0
    this._currentWaypoints = []
    this._waypointIndex = 0
    this._activity = 'traveling'
    this._isInDungeon = false
    this._noticeTimer = 0
    this._auraLight = null
    this._questMarker = null
    this._swordMesh = null
    this._buildMesh()
  }

  _buildMesh() {
    const group = this.group

    // Body — gold armor
    const bodyGeo = new THREE.CapsuleGeometry(0.28, 0.95, 4, 8)
    const armorMat = new THREE.MeshLambertMaterial({ color: 0xC0A060 })
    this.bodyMesh = new THREE.Mesh(bodyGeo, armorMat)
    this.bodyMesh.position.y = 0.8
    this.bodyMesh.castShadow = true
    group.add(this.bodyMesh)

    // Head — noble skin
    const headGeo = new THREE.SphereGeometry(0.24, 8, 6)
    const headMat = new THREE.MeshLambertMaterial({ color: 0xd4a96a })
    this.headMesh = new THREE.Mesh(headGeo, headMat)
    this.headMesh.position.y = 1.9
    this.headMesh.castShadow = true
    group.add(this.headMesh)

    // Helmet crest (plume)
    const crest = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.4, 0.15),
      new THREE.MeshLambertMaterial({ color: 0xcc2222 })
    )
    crest.position.set(0, 2.2, 0)
    group.add(crest)

    // Cape
    const capeMat = new THREE.MeshLambertMaterial({ color: 0x8822aa, side: THREE.DoubleSide })
    const capeGeo = new THREE.PlaneGeometry(0.7, 1.2)
    this.cape = new THREE.Mesh(capeGeo, capeMat)
    this.cape.position.set(0, 1.1, -0.28)
    this.cape.rotation.x = 0.2
    group.add(this.cape)

    // Sword strapped to back
    const swordGeo = new THREE.BoxGeometry(0.06, 1.0, 0.05)
    const swordMat = new THREE.MeshLambertMaterial({ color: 0xc0c0c0 })
    this._swordMesh = new THREE.Mesh(swordGeo, swordMat)
    this._swordMesh.position.set(0.35, 1.2, -0.15)
    this._swordMesh.rotation.z = 0.3
    group.add(this._swordMesh)

    // Shield
    const shieldGeo = new THREE.CircleGeometry(0.35, 8)
    const shieldMat = new THREE.MeshLambertMaterial({ color: 0xc0a060 })
    const shield = new THREE.Mesh(shieldGeo, shieldMat)
    shield.position.set(-0.42, 1.1, 0.1)
    shield.rotation.y = -0.3
    group.add(shield)

    // Heraldic cross on shield
    const crossH = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.06, 0.02), new THREE.MeshLambertMaterial({ color: 0xffd700 }))
    crossH.position.set(-0.42, 1.1, 0.12)
    group.add(crossH)

    // Arms
    const armGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.7, 4)
    const armMat = new THREE.MeshLambertMaterial({ color: 0xC0A060 })
    this.leftArm = new THREE.Mesh(armGeo, armMat)
    this.leftArm.position.set(-0.36, 0.9, 0)
    this.leftArm.rotation.z = 0.3
    group.add(this.leftArm)
    this.rightArm = new THREE.Mesh(armGeo, armMat)
    this.rightArm.position.set(0.36, 0.9, 0)
    this.rightArm.rotation.z = -0.3
    group.add(this.rightArm)

    // AURA — gold glow (PointLight)
    this._auraLight = new THREE.PointLight(0xffd700, 1.5, 6)
    this._auraLight.position.y = 1
    group.add(this._auraLight)

    // Quest marker — floating triangle above head
    this._buildQuestMarker(group)

    group.position.copy(this.position)
    this.scene.add(group)
  }

  _buildQuestMarker(parent) {
    const geo = new THREE.ConeGeometry(0.15, 0.35, 3)
    const mat = new THREE.MeshBasicMaterial({ color: 0xffd700 })
    this._questMarker = new THREE.Mesh(geo, mat)
    this._questMarker.rotation.x = Math.PI
    this._questMarker.position.y = 2.8
    parent.add(this._questMarker)
  }

  setWaypoints(waypoints) {
    this._currentWaypoints = waypoints.map(w => new THREE.Vector3(w.x, 0, w.z))
    this._waypointIndex = 0
  }

  setActivity(activity) {
    this._activity = activity
    this._isInDungeon = activity === 'in_dungeon'
    if (this._isInDungeon) {
      this.group.visible = false
    } else {
      this.group.visible = true
    }
  }

  update(delta, getHeightAt) {
    this._time += delta
    if (this._isInDungeon) return

    // Move toward current waypoint
    if (this._currentWaypoints.length > 0 && this._waypointIndex < this._currentWaypoints.length) {
      const target = this._currentWaypoints[this._waypointIndex]
      const dist = this.position.distanceTo(target)

      if (dist < 1.5) {
        this._waypointIndex = (this._waypointIndex + 1) % this._currentWaypoints.length
      } else {
        const dir = target.clone().sub(this.position).normalize()
        this.position.add(dir.multiplyScalar(this.speed * delta))
        this.rotation = Math.atan2(dir.x, dir.z)
        this.group.rotation.y = this.rotation
      }
    }

    // Terrain height
    if (getHeightAt) {
      this.position.y = Math.max(0, getHeightAt(this.position.x, this.position.z))
    }
    this.group.position.copy(this.position)

    // Animate
    this._animate(delta)
  }

  _animate(delta) {
    const moving = this._currentWaypoints.length > 0 && this._waypointIndex < this._currentWaypoints.length

    if (moving) {
      this._walkCycle += delta * 4
      this.bodyMesh.position.y = 0.8 + Math.sin(this._walkCycle * 2) * 0.05
      this.leftArm.rotation.x = Math.sin(this._walkCycle) * 0.4
      this.rightArm.rotation.x = -Math.sin(this._walkCycle) * 0.4
    } else {
      // Heroic idle — chest out, slow breath
      this.bodyMesh.scale.y = 1 + Math.sin(this._time * 0.8) * 0.015
      this.leftArm.rotation.x *= 0.9
      this.rightArm.rotation.x *= 0.9
    }

    // Cape sway
    if (this.cape) {
      this.cape.rotation.z = Math.sin(this._time * 1.5) * 0.08
    }

    // Quest marker bounce
    if (this._questMarker) {
      this._questMarker.position.y = 2.8 + Math.sin(this._time * 2) * 0.12
    }

    // Aura pulse
    if (this._auraLight) {
      this._auraLight.intensity = 1.5 + Math.sin(this._time * 1.5) * 0.3
    }
  }

  lookAt(targetPos) {
    const dir = targetPos.clone().sub(this.position)
    dir.y = 0
    if (dir.length() > 0.1) {
      this.rotation = Math.atan2(dir.x, dir.z)
      this.group.rotation.y = this.rotation
    }
  }

  getMesh() { return this.group }
  getPosition() { return this.position.clone() }

  dispose() {
    this.scene.remove(this.group)
  }
}
