export class InputManager {
  constructor() {
    this.keys = {}
    this.justPressed = {}
    this.mouse = { dx: 0, dy: 0, scrollDelta: 0, leftButton: false }
    this._rawDx = 0
    this._rawDy = 0
    this.pointerLocked = false
    this._onKeyDown = this._onKeyDown.bind(this)
    this._onKeyUp = this._onKeyUp.bind(this)
    this._onMouseMove = this._onMouseMove.bind(this)
    this._onMouseDown = this._onMouseDown.bind(this)
    this._onMouseUp = this._onMouseUp.bind(this)
    this._onWheel = this._onWheel.bind(this)
    this._onPointerLockChange = this._onPointerLockChange.bind(this)
  }

  init() {
    window.addEventListener('keydown', this._onKeyDown)
    window.addEventListener('keyup', this._onKeyUp)
    window.addEventListener('mousemove', this._onMouseMove)
    window.addEventListener('mousedown', this._onMouseDown)
    window.addEventListener('mouseup', this._onMouseUp)
    window.addEventListener('wheel', this._onWheel, { passive: true })
    document.addEventListener('pointerlockchange', this._onPointerLockChange)
  }

  requestPointerLock(canvas) {
    if (canvas && !this.pointerLocked) {
      canvas.requestPointerLock().catch(() => {})
    }
  }

  exitPointerLock() {
    if (document.pointerLockElement) document.exitPointerLock()
  }

  _onPointerLockChange() {
    this.pointerLocked = !!document.pointerLockElement
  }

  _onKeyDown(e) {
    const key = e.code
    if (!this.keys[key]) this.justPressed[key] = true
    this.keys[key] = true
    // Prevent default for game keys
    if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space','Tab'].includes(key)) {
      e.preventDefault()
    }
  }

  _onKeyUp(e) {
    this.keys[e.code] = false
  }

  _onMouseMove(e) {
    if (this.pointerLocked) {
      this._rawDx += e.movementX || 0
      this._rawDy += e.movementY || 0
    }
  }

  _onMouseDown(e) {
    if (e.button === 0) this.mouse.leftButton = true
  }

  _onMouseUp(e) {
    if (e.button === 0) this.mouse.leftButton = false
  }

  _onWheel(e) {
    this.mouse.scrollDelta += e.deltaY
  }

  isPressed(key) {
    return !!this.keys[key]
  }

  isJustPressed(key) {
    if (this.justPressed[key]) {
      this.justPressed[key] = false
      return true
    }
    return false
  }

  getMouseDelta() {
    const dx = this._rawDx
    const dy = this._rawDy
    this._rawDx = 0
    this._rawDy = 0
    return { x: dx, y: dy }
  }

  getScrollDelta() {
    const delta = this.mouse.scrollDelta
    this.mouse.scrollDelta = 0
    return delta
  }

  isMoving() {
    return this.isPressed('KeyW') || this.isPressed('KeyS') ||
           this.isPressed('KeyA') || this.isPressed('KeyD') ||
           this.isPressed('ArrowUp') || this.isPressed('ArrowDown') ||
           this.isPressed('ArrowLeft') || this.isPressed('ArrowRight')
  }

  update() {
    // justPressed cleared per-read in isJustPressed
  }

  dispose() {
    window.removeEventListener('keydown', this._onKeyDown)
    window.removeEventListener('keyup', this._onKeyUp)
    window.removeEventListener('mousemove', this._onMouseMove)
    window.removeEventListener('mousedown', this._onMouseDown)
    window.removeEventListener('mouseup', this._onMouseUp)
    window.removeEventListener('wheel', this._onWheel)
    document.removeEventListener('pointerlockchange', this._onPointerLockChange)
    this.exitPointerLock()
  }
}
