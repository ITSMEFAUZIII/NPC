import * as THREE from 'three'

const VILLAGER_DATA = [
  { id: 'mira', name: 'Mira', color: 0x7a9e7e, homePos: { x: 15, y: 0, z: 30 }, accessory: 'none' },
  { id: 'elder_voss', name: 'Elder Voss', color: 0x8b7355, homePos: { x: -10, y: 0, z: -20 }, accessory: 'hat' },
  { id: 'tom', name: 'Tom', color: 0x6b4226, homePos: { x: 20, y: 0, z: -15 }, accessory: 'none' },
  { id: 'pip', name: 'Pip', color: 0xd4956a, homePos: { x: -20, y: 0, z: 15 }, accessory: 'none', scale: 0.7 },
  { id: 'marta', name: 'Marta', color: 0xc9956a, homePos: { x: 5, y: 0, z: 25 }, accessory: 'hat' },
  { id: 'guard', name: 'Guard', color: 0x7a7a8a, homePos: { x: -15, y: 0, z: -50 }, accessory: 'helmet' },
  { id: 'merchant', name: 'Merchant', color: 0xa07850, homePos: { x: 30, y: 0, z: 20 }, accessory: 'hat' },
  { id: 'villager_1', name: 'Anna', color: 0xc4906a, homePos: { x: 25, y: 0, z: -25 }, accessory: 'scarf' },
  { id: 'villager_2', name: 'Ben', color: 0x7a5a40, homePos: { x: -25, y: 0, z: 30 }, accessory: 'none' },
  { id: 'villager_3', name: 'Clara', color: 0xaa8060, homePos: { x: 35, y: 0, z: -30 }, accessory: 'scarf' },
]

const SCHEDULES = {
  dawn: 'home', morning: 'work', afternoon: 'village', dusk: 'tavern', night: 'home'
}

export class Villagers {
  constructor(scene) {
    this.scene = scene
    this.villagers = []
  }

  build(getHeightAt) {
    VILLAGER_DATA.forEach(data => {
      const v = this._buildVillager(data, getHeightAt)
      this.villagers.push(v)
    })
    return this.villagers
  }

  _buildVillager(data, getHeightAt) {
    const group = new THREE.Group()
    const s = data.scale || 1

    const bodyMat = new THREE.MeshLambertMaterial({ color: data.color })
    const bodyGeo = new THREE.CapsuleGeometry(0.22 * s, 0.75 * s, 4, 6)
    const body = new THREE.Mesh(bodyGeo, bodyMat)
    body.position.y = 0.65 * s
    body.castShadow = true
    group.add(body)

    const headGeo = new THREE.SphereGeometry(0.19 * s, 7, 5)
    const headMat = new THREE.MeshLambertMaterial({ color: 0xc4a070 })
    const head = new THREE.Mesh(headGeo, headMat)
    head.position.y = 1.55 * s
    head.castShadow = true
    group.add(head)

    // Accessory
    if (data.accessory === 'hat') {
      const hat = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18 * s, 0.22 * s, 0.3 * s, 8),
        new THREE.MeshLambertMaterial({ color: 0x3d2510 })
      )
      hat.position.y = 1.8 * s
      group.add(hat)
    }
    if (data.accessory === 'scarf') {
      const scarf = new THREE.Mesh(
        new THREE.TorusGeometry(0.16 * s, 0.04 * s, 4, 8),
        new THREE.MeshLambertMaterial({ color: 0xcc4422 })
      )
      scarf.position.y = 1.4 * s
      scarf.rotation.x = Math.PI / 2
      group.add(scarf)
    }
    if (data.accessory === 'helmet') {
      const helm = new THREE.Mesh(
        new THREE.SphereGeometry(0.22 * s, 7, 5),
        new THREE.MeshLambertMaterial({ color: 0x7a7a8a })
      )
      helm.position.y = 1.65 * s
      group.add(helm)
    }

    const homePos = new THREE.Vector3(data.homePos.x, 0, data.homePos.z)
    const terrainY = getHeightAt ? Math.max(0, getHeightAt(homePos.x, homePos.z)) : 0
    homePos.y = terrainY
    group.position.copy(homePos)

    this.scene.add(group)

    return {
      id: data.id,
      name: data.name,
      group,
      homePos: homePos.clone(),
      position: homePos.clone(),
      targetPos: homePos.clone(),
      speed: 2 + Math.random() * 1,
      trustAldric: 80,
      trustKael: 20,
      isAlive: true,
      hasInfo: !!data.hasInfo,
      _walkCycle: 0,
      _idleTimer: Math.random() * 5,
      _bowTimer: 0,
      _time: 0,
      bodyMesh: body,
      headMesh: head,
      _scale: s
    }
  }

  update(delta, phase, aldricPosition, getHeightAt) {
    this.villagers.forEach(v => {
      if (!v.isAlive) return
      v._time += delta
      v._idleTimer -= delta

      // Move toward target
      const dist = v.position.distanceTo(v.targetPos)
      if (dist > 0.5) {
        const dir = v.targetPos.clone().sub(v.position).normalize()
        v.position.add(dir.multiplyScalar(v.speed * delta))
        if (getHeightAt) v.position.y = Math.max(0, getHeightAt(v.position.x, v.position.z))
        v.group.position.copy(v.position)
        v.group.rotation.y = Math.atan2(dir.x, dir.z)

        v._walkCycle += delta * 3
        v.bodyMesh.position.y = 0.65 * v._scale + Math.sin(v._walkCycle * 2) * 0.03
      } else {
        // Idle
        v.bodyMesh.position.y = 0.65 * v._scale + Math.sin(v._time * 0.7) * 0.01

        // Wander occasionally
        if (v._idleTimer <= 0) {
          v._idleTimer = 5 + Math.random() * 10
          const wander = new THREE.Vector3(
            v.homePos.x + (Math.random() - 0.5) * 8,
            0,
            v.homePos.z + (Math.random() - 0.5) * 8
          )
          if (getHeightAt) wander.y = Math.max(0, getHeightAt(wander.x, wander.z))
          v.targetPos.copy(wander)
        }
      }

      // React to Aldric — bow when nearby
      if (aldricPosition) {
        const distToAldric = v.position.distanceTo(aldricPosition)
        if (distToAldric < 5) {
          v.group.lookAt(aldricPosition)
        }
        if (distToAldric < 2) {
          // Bow animation
          v._bowTimer += delta
          v.group.rotation.x = Math.sin(v._bowTimer * 3) * 0.2
        } else {
          v.group.rotation.x *= 0.95
          v._bowTimer = 0
        }
      }
    })
  }

  setSchedule(phase) {
    this.villagers.forEach(v => {
      let target
      switch (phase) {
        case 'dawn':
        case 'night':
          target = v.homePos.clone()
          break
        case 'morning':
        case 'afternoon':
          target = new THREE.Vector3(
            v.homePos.x + (Math.random() - 0.5) * 20,
            0,
            v.homePos.z + (Math.random() - 0.5) * 20
          )
          break
        case 'dusk':
          // Head to tavern area
          target = new THREE.Vector3(-50 + (Math.random() - 0.5) * 10, 0, 10 + (Math.random() - 0.5) * 10)
          break
        default:
          target = v.homePos.clone()
      }
      v.targetPos.copy(target)
    })
  }

  getVillager(id) {
    return this.villagers.find(v => v.id === id)
  }

  getInteractables() {
    return this.villagers.map(v => ({
      id: v.id,
      mesh: v.group.children[0],
      worldPos: v.position,
      range: 2,
      prompt: `Talk to ${v.name}`,
      villager: v
    }))
  }

  dispose() {
    this.villagers.forEach(v => this.scene.remove(v.group))
  }
}
