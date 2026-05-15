import * as THREE from 'three'
import EventBus from '../engine/EventBus.js'

export class Kael {
  constructor(scene) {
    this.scene = scene
    this.mesh = null
    this.group = new THREE.Group()
    this.position = new THREE.Vector3(-50, 0, 10)
    this.rotation = 0
    this.walkSpeed = 3.5
    this.hurrySpeed = 5.5
    this.turnSpeed = 2.5
    this._time = 0
    this._walkCycle = 0
    this._isMoving = false
    this._stepTimer = 0
    this._monologueTimer = 60 + Math.random() * 60
    this._monologues = []
    this._buildMesh()
  }

  _buildMesh() {
    const group = this.group

    // Body (capsule — muted brown)
    const bodyGeo = new THREE.CapsuleGeometry(0.25, 0.85, 4, 8)
    const bodyMat = new THREE.MeshLambertMaterial({ color: 0x6b4c2a })
    this.bodyMesh = new THREE.Mesh(bodyGeo, bodyMat)
    this.bodyMesh.position.y = 0.75
    this.bodyMesh.castShadow = true
    group.add(this.bodyMesh)

    // Head
    const headGeo = new THREE.SphereGeometry(0.22, 8, 6)
    const headMat = new THREE.MeshLambertMaterial({ color: 0xc4956a })
    this.headMesh = new THREE.Mesh(headGeo, headMat)
    this.headMesh.position.y = 1.75
    this.headMesh.castShadow = true
    group.add(this.headMesh)

    // Apron
    const apronGeo = new THREE.PlaneGeometry(0.35, 0.6)
    const apronMat = new THREE.MeshLambertMaterial({ color: 0x8b8b8b, side: THREE.DoubleSide })
    this.apron = new THREE.Mesh(apronGeo, apronMat)
    this.apron.position.set(0, 0.8, 0.26)
    group.add(this.apron)

    // Arms
    const armGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.65, 4)
    const armMat = new THREE.MeshLambertMaterial({ color: 0x6b4c2a })
    this.leftArm = new THREE.Mesh(armGeo, armMat)
    this.leftArm.position.set(-0.32, 0.9, 0)
    this.leftArm.rotation.z = 0.3
    group.add(this.leftArm)

    this.rightArm = new THREE.Mesh(armGeo, armMat)
    this.rightArm.position.set(0.32, 0.9, 0)
    this.rightArm.rotation.z = -0.3
    group.add(this.rightArm)

    // Shadow override — smaller than Aldric's
    group.traverse(m => {
      if (m.isMesh) {
        m.castShadow = true
        m.receiveShadow = true
      }
    })

    group.position.copy(this.position)
    this.scene.add(group)
  }

  setMonologues(day) {
    const base = [
      "He didn't look at me again today.",
      "I know things he will never know.",
      "Is this enough? Is any of this enough?",
      `Day ${day}. He still doesn't know my name.`,
      "I changed something today. Nobody will ever know."
    ]
    if (day <= 5) {
      base.push("Another day. Another hero.")
    }
    this._monologues = base
  }

  update(delta, input, cameraYaw, getHeightAt, state) {
    this._time += delta
    const isHurrying = input.isPressed('ShiftLeft') || input.isPressed('ShiftRight')
    const speed = isHurrying ? this.hurrySpeed : this.walkSpeed

    let moved = false
    const moveDir = new THREE.Vector3()

    // Forward/back relative to camera yaw
    if (input.isPressed('KeyW') || input.isPressed('ArrowUp')) {
      moveDir.x -= Math.sin(cameraYaw) * speed * delta
      moveDir.z -= Math.cos(cameraYaw) * speed * delta
      moved = true
    }
    if (input.isPressed('KeyS') || input.isPressed('ArrowDown')) {
      moveDir.x += Math.sin(cameraYaw) * speed * delta
      moveDir.z += Math.cos(cameraYaw) * speed * delta
      moved = true
    }
    if (input.isPressed('KeyA') || input.isPressed('ArrowLeft')) {
      moveDir.x -= Math.cos(cameraYaw) * speed * delta
      moveDir.z += Math.sin(cameraYaw) * speed * delta
      moved = true
    }
    if (input.isPressed('KeyD') || input.isPressed('ArrowRight')) {
      moveDir.x += Math.cos(cameraYaw) * speed * delta
      moveDir.z -= Math.sin(cameraYaw) * speed * delta
      moved = true
    }

    if (moved) {
      const newPos = this.position.clone().add(moveDir)

      // World bounds
      newPos.x = Math.max(-950, Math.min(950, newPos.x))
      newPos.z = Math.max(-950, Math.min(950, newPos.z))

      // Terrain height
      if (getHeightAt) {
        newPos.y = Math.max(0, getHeightAt(newPos.x, newPos.z))
      }

      this.position.copy(newPos)
      this.group.position.copy(this.position)

      // Face movement direction
      if (moveDir.length() > 0) {
        const targetRotation = Math.atan2(moveDir.x, moveDir.z)
        this.rotation = targetRotation
        this.group.rotation.y = this.rotation
      }

      // Footstep
      this._stepTimer += delta
      if (this._stepTimer > (isHurrying ? 0.3 : 0.45)) {
        this._stepTimer = 0
        EventBus.emit('sfx', { type: 'footstep_wood' })
      }
    }

    this._isMoving = moved
    this._animateCharacter(delta, moved)

    // Internal monologue
    this._monologueTimer -= delta
    if (this._monologueTimer <= 0 && this._monologues.length > 0) {
      this._monologueTimer = 60 + Math.random() * 60
      const text = this._monologues[Math.floor(Math.random() * this._monologues.length)]
      EventBus.emit('ui:narrator', { text })
    }
  }

  _animateCharacter(delta, moving) {
    if (moving) {
      this._walkCycle += delta * 4
      // Leg swing (body bob)
      this.bodyMesh.position.y = 0.75 + Math.sin(this._walkCycle * 2) * 0.04
      // Arm swing
      this.leftArm.rotation.x = Math.sin(this._walkCycle) * 0.3
      this.rightArm.rotation.x = -Math.sin(this._walkCycle) * 0.3
    } else {
      // Idle sway
      this.bodyMesh.position.y = 0.75 + Math.sin(this._time * 0.8) * 0.02
      this.leftArm.rotation.x *= 0.9
      this.rightArm.rotation.x *= 0.9
    }
  }

  playAction(action) {
    // Visual feedback for actions
    switch (action) {
      case 'serve':
        this.rightArm.rotation.x = -0.8
        setTimeout(() => { if (this.rightArm) this.rightArm.rotation.x = -0.3 }, 1200)
        break
      case 'startled':
        this.bodyMesh.position.z = -0.1
        setTimeout(() => { if (this.bodyMesh) this.bodyMesh.position.z = 0 }, 300)
        break
    }
  }

  getMesh() { return this.group }
  getPosition() { return this.position.clone() }

  dispose() {
    this.scene.remove(this.group)
  }
}
