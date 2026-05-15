import * as THREE from 'three'

export function createTable(x, y, z, color = 0x5c3d1e) {
  const group = new THREE.Group()
  const top = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 0.08, 1),
    new THREE.MeshLambertMaterial({ color })
  )
  top.position.y = 0.75
  group.add(top)
  const legGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.75, 4)
  const legMat = new THREE.MeshLambertMaterial({ color: 0x4a2e10 })
  const legPos = [[-0.65, -0.35], [0.65, -0.35], [-0.65, 0.35], [0.65, 0.35]]
  legPos.forEach(([lx, lz]) => {
    const leg = new THREE.Mesh(legGeo, legMat)
    leg.position.set(lx, 0.375, lz)
    group.add(leg)
  })
  group.position.set(x, y, z)
  return group
}

export function createChair(x, y, z, rotation = 0) {
  const group = new THREE.Group()
  const mat = new THREE.MeshLambertMaterial({ color: 0x4a2e10 })
  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.06, 0.5), mat)
  seat.position.y = 0.45
  group.add(seat)
  const back = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.04), mat)
  back.position.set(0, 0.75, -0.23)
  group.add(back)
  const legGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.45, 4)
  const legPos = [[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]]
  legPos.forEach(([lx, lz]) => {
    const leg = new THREE.Mesh(legGeo, mat)
    leg.position.set(lx, 0.225, lz)
    group.add(leg)
  })
  group.position.set(x, y, z)
  group.rotation.y = rotation
  return group
}

export function createBed(x, y, z) {
  const group = new THREE.Group()
  const mat = new THREE.MeshLambertMaterial({ color: 0x8b4513 })
  const frame = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.2, 2.0), mat)
  frame.position.y = 0.1
  group.add(frame)
  const mattress = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 0.2, 1.8),
    new THREE.MeshLambertMaterial({ color: 0x7a7a8a })
  )
  mattress.position.y = 0.3
  group.add(mattress)
  const pillow = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 0.1, 0.3),
    new THREE.MeshLambertMaterial({ color: 0xe8dcc8 })
  )
  pillow.position.set(0, 0.45, -0.7)
  group.add(pillow)
  group.position.set(x, y, z)
  return group
}
