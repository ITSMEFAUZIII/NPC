import * as CANNON from 'cannon-es'

export class PhysicsWorld {
  constructor() {
    this.world = new CANNON.World()
    this.world.gravity.set(0, -9.82, 0)
    this.world.broadphase = new CANNON.NaiveBroadphase()
    this.world.solver.iterations = 10
    this.bodies = []
    this.fixedTimeStep = 1 / 60
    this.maxSubSteps = 3
  }

  init() {
    this.createGroundPlane()
  }

  createGroundPlane() {
    const groundShape = new CANNON.Plane()
    const groundBody = new CANNON.Body({ mass: 0 })
    groundBody.addShape(groundShape)
    groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
    this.world.addBody(groundBody)
    return groundBody
  }

  createBoxCollider(w, h, d, position) {
    const shape = new CANNON.Box(new CANNON.Vec3(w/2, h/2, d/2))
    const body = new CANNON.Body({ mass: 0 })
    body.addShape(shape)
    if (position) body.position.set(position.x, position.y, position.z)
    this.world.addBody(body)
    this.bodies.push(body)
    return body
  }

  createCapsuleCollider(r, h) {
    const body = new CANNON.Body({ mass: 1 })
    body.addShape(new CANNON.Sphere(r))
    body.linearDamping = 0.9
    body.angularDamping = 1.0
    this.world.addBody(body)
    this.bodies.push(body)
    return body
  }

  addBody(body) {
    this.world.addBody(body)
    this.bodies.push(body)
  }

  removeBody(body) {
    this.world.removeBody(body)
    this.bodies = this.bodies.filter(b => b !== body)
  }

  step(deltaTime) {
    this.world.step(this.fixedTimeStep, deltaTime, this.maxSubSteps)
  }

  syncMeshToBody(mesh, body) {
    mesh.position.copy(body.position)
    mesh.quaternion.copy(body.quaternion)
  }

  destroy() {
    this.bodies.forEach(b => this.world.removeBody(b))
    this.bodies = []
  }
}
